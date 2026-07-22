// HANDOFF §5 — appointments server functions.
// Contract: §2.3 column names, snake_case in DB ↔ camelCase in the store.
// Public `create` inserts via service role after narrow validation; everything
// else requires auth + staff role checked through the RLS-scoped client.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { AppointmentRequest } from "@/lib/appointmentStore";

// Literal mirrors of the appointmentStore exports (kept inline to avoid a
// runtime import cycle — appointmentStore imports this module).
const STATUSES = [
  "Pending", "Confirmed", "Checked In", "In Progress",
  "Completed", "Cancelled", "No Show", "Rescheduled",
] as const;
const TAGS = [
  "New patient", "Returning patient", "Follow-up",
  "Prospective", "Past patient", "VIP", "Cancelled",
] as const;
const PAYS = ["Pending", "Paid", "Partial", "Overdue", "Refunded", "Waived"] as const;

type Db = SupabaseClient<any, "public", any>;

type AppointmentRow = {
  id: string;
  created_at: string;
  updated_at: string | null;
  source: string;
  date: string;
  time: string;
  patient_id: string | null;
  patient_name: string;
  patient_tag: string | null;
  email: string | null;
  phone: string | null;
  type: string;
  service: string;
  state: string;
  lang: string;
  format: string;
  duration: number;
  status: string;
  pay: string;
  notes: string | null;
  meeting_link: string | null;
  follow_up_id: string | null;
  reminder_sent_at: string | null;
};

function rowToAppointment(row: AppointmentRow): AppointmentRequest {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
    source: row.source as AppointmentRequest["source"],
    date: row.date,
    time: row.time,
    patient: row.patient_name,
    patientTag: (row.patient_tag ?? undefined) as AppointmentRequest["patientTag"],
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    type: row.type,
    service: row.service,
    state: row.state,
    lang: row.lang,
    format: row.format as AppointmentRequest["format"],
    duration: row.duration,
    status: row.status as AppointmentRequest["status"],
    pay: row.pay as AppointmentRequest["pay"],
    notes: row.notes ?? undefined,
    meetingLink: row.meeting_link ?? undefined,
    followUpId: row.follow_up_id ?? undefined,
  };
}

/** Accepts '9:00 AM', '14:30', '08:30' … and returns 'HH:mm' 24h (DB contract). */
function normalizeTime(raw: string): string {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) throw new Error(`Invalid time: ${raw}`);
  let hours = Number(m[1]);
  const minutes = m[2]!;
  const meridiem = m[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  if (hours > 23) throw new Error(`Invalid time: ${raw}`);
  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

const optionalTrimmed = (max: number) =>
  z.string().trim().max(max).optional()
    .transform((v) => (v ? v : undefined));

const createInput = z.object({
  source: z.enum(["public", "admin"]).default("public"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  time: z.string().min(1).max(20),
  patient: z.string().trim().min(1).max(200),
  patientTag: z.enum(TAGS).optional(),
  email: z.string().trim().email().max(320).optional().or(z.literal("").transform(() => undefined)),
  phone: optionalTrimmed(40),
  type: z.string().trim().min(1).max(160),
  service: z.string().trim().max(160).default(""),
  state: z.string().trim().max(120).default(""),
  lang: z.string().trim().max(40).default("English"),
  format: z.enum(["In-person", "Telehealth"]),
  duration: z.number().int().min(5).max(480).default(45),
  status: z.enum(STATUSES).default("Pending"),
  pay: z.enum(PAYS).default("Pending"),
  notes: optionalTrimmed(4000),
  meetingLink: z.string().trim().url().max(500).optional().or(z.literal("").transform(() => undefined)),
  followUpId: optionalTrimmed(20),
});

const updatePatch = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().min(1).max(20).optional(),
  patient: z.string().trim().min(1).max(200).optional(),
  patientTag: z.enum(TAGS).nullish(),
  email: z.string().trim().email().max(320).nullish(),
  phone: z.string().trim().max(40).nullish(),
  type: z.string().trim().min(1).max(160).optional(),
  service: z.string().trim().max(160).optional(),
  state: z.string().trim().max(120).optional(),
  lang: z.string().trim().max(40).optional(),
  format: z.enum(["In-person", "Telehealth"]).optional(),
  duration: z.number().int().min(5).max(480).optional(),
  status: z.enum(STATUSES).optional(),
  pay: z.enum(PAYS).optional(),
  notes: z.string().max(4000).nullish(),
  meetingLink: z.string().trim().url().max(500).nullish().or(z.literal("").transform(() => null)),
  followUpId: z.string().max(20).nullish(),
});

type StaffContext = { supabase: unknown; userId: string };

/** Role check via the caller's RLS-scoped client — never via the admin client. */
async function assertStaff(context: StaffContext): Promise<Db> {
  const db = context.supabase as Db;
  const { data, error } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error("Could not verify permissions.");
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin") && !roles.includes("clinician")) {
    throw new Error("Forbidden: staff access required.");
  }
  return db;
}

function appOrigin(): string {
  return process.env.APP_ORIGIN || "https://jcintegrativehealth.com";
}

const prettyDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

async function sendBookingEmails(row: AppointmentRow): Promise<void> {
  const emails = await import("@/lib/emails.functions");
  const firstName = row.patient_name.split(" ")[0];

  if (row.email) {
    await emails.sendTemplateEmail({
      to: row.email,
      subject: "We received your appointment request — JC Integrative Health",
      template: "appointment-request-received",
      props: {
        firstName,
        requestedDate: prettyDate(row.date),
        requestedTime: row.time,
        format: row.format,
        service: row.service || row.type,
        referenceCode: row.id,
      },
    });
  }

  await emails.sendTemplateEmail({
    to: emails.adminRecipients(),
    subject: `New appointment request ${row.id} — ${row.patient_name}`,
    template: "new-appointment-request-admin",
    props: {
      patientName: row.patient_name,
      patientEmail: row.email ?? undefined,
      patientPhone: row.phone ?? undefined,
      requestedDate: prettyDate(row.date),
      requestedTime: row.time,
      format: row.format,
      service: row.service,
      visitType: row.type,
      state: row.state,
      language: row.lang,
      notes: row.notes ?? undefined,
      referenceCode: row.id,
      submittedAt: new Date(row.created_at).toLocaleString("en-US"),
      reviewUrl: `${appOrigin()}/admin/appointments/${row.id}`,
    },
    replyTo: row.email ?? undefined,
  });
}

async function sendChangeEmails(before: AppointmentRow, after: AppointmentRow): Promise<void> {
  if (!after.email) return;
  const emails = await import("@/lib/emails.functions");
  const firstName = after.patient_name.split(" ")[0];
  const common = {
    firstName,
    format: after.format,
    provider: "Dr. Jason Chen",
    service: after.service || after.type,
  };

  const rescheduled =
    before.status !== "Cancelled" &&
    after.status !== "Cancelled" &&
    (before.date !== after.date || before.time !== after.time);

  if (rescheduled) {
    await emails.sendTemplateEmail({
      to: after.email,
      subject: "Your appointment was rescheduled — JC Integrative Health",
      template: "appointment-rescheduled",
      props: {
        ...common,
        previousDate: prettyDate(before.date),
        previousTime: before.time,
        newDate: prettyDate(after.date),
        newTime: after.time,
        duration: `${after.duration} min`,
        joinUrl: after.meeting_link ?? undefined,
      },
    });
    return;
  }

  if (before.status !== after.status && after.status === "Confirmed") {
    await emails.sendTemplateEmail({
      to: after.email,
      subject: "Your appointment is confirmed — JC Integrative Health",
      template: "appointment-confirmed",
      props: {
        ...common,
        date: prettyDate(after.date),
        time: after.time,
        duration: `${after.duration} min`,
        joinUrl: after.meeting_link ?? undefined,
      },
    });
  }

  if (before.status !== after.status && after.status === "Cancelled") {
    await emails.sendTemplateEmail({
      to: after.email,
      subject: "Your appointment was cancelled — JC Integrative Health",
      template: "appointment-cancellation",
      props: {
        ...common,
        date: prettyDate(after.date),
        time: after.time,
        cancelledBy: "clinic",
        bookUrl: `${appOrigin()}/book`,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Public: /book submission. Inserts as service role; no direct anon insert.
// ---------------------------------------------------------------------------
export const createAppointmentFn = createServerFn({ method: "POST" })
  .validator(createInput)
  .handler(async ({ data }) => {
    const { assertRateLimit, clientIp } = await import("@/lib/rate-limit.server");
    assertRateLimit(`book:${clientIp()}`, 5, 10 * 60_000);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as Db;

    const { data: row, error } = await db
      .from("appointments")
      .insert({
        source: data.source,
        date: data.date,
        time: normalizeTime(data.time),
        patient_name: data.patient,
        patient_tag: data.patientTag ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        type: data.type,
        service: data.service,
        state: data.state,
        lang: data.lang,
        format: data.format,
        duration: data.duration,
        status: data.status,
        pay: data.pay,
        notes: data.notes ?? null,
        meeting_link: data.meetingLink ?? null,
        follow_up_id: data.followUpId ?? null,
      })
      .select("*")
      .single();

    if (error || !row) {
      console.error("[appointments] insert failed:", error);
      throw new Error("Could not submit the appointment request.");
    }

    // Email is a side effect — never fail the booking because of it.
    await sendBookingEmails(row as AppointmentRow).catch((err) =>
      console.error("[appointments] booking emails failed:", err),
    );

    return rowToAppointment(row as AppointmentRow);
  });

// ---------------------------------------------------------------------------
// Authenticated reads. RLS decides visibility (staff: all, patient: own).
// ---------------------------------------------------------------------------
export const listAppointmentsFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = context.supabase as Db;
    const { data, error } = await db
      .from("appointments")
      .select("*")
      .order("date", { ascending: false })
      .order("time", { ascending: false });
    if (error) throw new Error("Could not load appointments.");
    return (data as AppointmentRow[]).map(rowToAppointment);
  });

export const getAppointmentFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().min(1).max(20) }))
  .handler(async ({ data, context }) => {
    const db = context.supabase as Db;
    const { data: row, error } = await db
      .from("appointments")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error("Could not load the appointment.");
    return row ? rowToAppointment(row as AppointmentRow) : null;
  });

// ---------------------------------------------------------------------------
// Staff mutations. Authorization: role check through context.supabase, then
// the update itself also runs RLS-scoped (staff update policy).
// ---------------------------------------------------------------------------
export const updateAppointmentFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ id: z.string().min(1).max(20), patch: updatePatch }))
  .handler(async ({ data, context }) => {
    const db = await assertStaff(context as StaffContext);

    const { data: before, error: readError } = await db
      .from("appointments")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (readError || !before) throw new Error("Appointment not found.");

    const p = data.patch;
    const patch: Record<string, unknown> = {};
    if (p.date !== undefined) patch.date = p.date;
    if (p.time !== undefined) patch.time = normalizeTime(p.time);
    if (p.patient !== undefined) patch.patient_name = p.patient;
    if (p.patientTag !== undefined) patch.patient_tag = p.patientTag;
    if (p.email !== undefined) patch.email = p.email;
    if (p.phone !== undefined) patch.phone = p.phone;
    if (p.type !== undefined) patch.type = p.type;
    if (p.service !== undefined) patch.service = p.service;
    if (p.state !== undefined) patch.state = p.state;
    if (p.lang !== undefined) patch.lang = p.lang;
    if (p.format !== undefined) patch.format = p.format;
    if (p.duration !== undefined) patch.duration = p.duration;
    if (p.status !== undefined) patch.status = p.status;
    if (p.pay !== undefined) patch.pay = p.pay;
    if (p.notes !== undefined) patch.notes = p.notes;
    if (p.meetingLink !== undefined) patch.meeting_link = p.meetingLink;
    if (p.followUpId !== undefined) patch.follow_up_id = p.followUpId;

    if (Object.keys(patch).length === 0) {
      return rowToAppointment(before as AppointmentRow);
    }

    const { data: after, error } = await db
      .from("appointments")
      .update(patch)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error || !after) throw new Error("Could not update the appointment.");

    await sendChangeEmails(before as AppointmentRow, after as AppointmentRow).catch((err) =>
      console.error("[appointments] change emails failed:", err),
    );

    return rowToAppointment(after as AppointmentRow);
  });

export const bookFollowUpFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      parentId: z.string().min(1).max(20),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      time: z.string().min(1).max(20),
      type: z.string().trim().min(1).max(160),
      service: z.string().trim().max(160).default(""),
      format: z.enum(["In-person", "Telehealth"]),
      duration: z.number().int().min(5).max(480),
      meetingLink: z.string().trim().url().max(500).optional().or(z.literal("").transform(() => undefined)),
      notes: optionalTrimmed(4000),
      patientTag: z.enum(TAGS).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const db = await assertStaff(context as StaffContext);

    const { data: parent, error: parentError } = await db
      .from("appointments")
      .select("*")
      .eq("id", data.parentId)
      .maybeSingle();
    if (parentError || !parent) throw new Error("Parent appointment not found.");
    const parentRow = parent as AppointmentRow;

    // Inserts require the service role (no insert grant for authenticated) —
    // authorized above via the caller's own RLS-scoped role check.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const admin = supabaseAdmin as unknown as Db;

    const { data: follow, error } = await admin
      .from("appointments")
      .insert({
        source: "admin",
        date: data.date,
        time: normalizeTime(data.time),
        patient_id: parentRow.patient_id,
        patient_name: parentRow.patient_name,
        patient_tag: data.patientTag ?? "Follow-up",
        email: parentRow.email,
        phone: parentRow.phone,
        type: data.type,
        service: data.service,
        state: parentRow.state,
        lang: parentRow.lang,
        format: data.format,
        duration: data.duration,
        status: "Confirmed",
        pay: "Pending",
        notes: data.notes ?? null,
        meeting_link: data.meetingLink ?? null,
      })
      .select("*")
      .single();
    if (error || !follow) throw new Error("Could not book the follow-up.");
    const followRow = follow as AppointmentRow;

    const { error: linkError } = await db
      .from("appointments")
      .update({ follow_up_id: followRow.id })
      .eq("id", parentRow.id);
    if (linkError) console.error("[appointments] follow-up link failed:", linkError);

    await sendChangeEmails({ ...followRow, status: "Pending" }, followRow).catch((err) =>
      console.error("[appointments] follow-up email failed:", err),
    );

    return rowToAppointment(followRow);
  });
