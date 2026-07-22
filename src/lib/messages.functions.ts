// HANDOFF §2.6 / §5 — in-platform messaging server functions.
// All queries run through the caller's RLS-scoped client; the policies decide
// who can read/insert/mark-read. Email is a notification-only side effect
// (no PHI in the patient-facing message), and never blocks the write.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Db = SupabaseClient<any, "public", any>;

export type Message = {
  id: string;
  senderRole: "patient" | "staff";
  senderId: string | null;
  body: string;
  readAt: string | null;
  createdAt: string;
};

export type MessageThread = {
  patientId: string;
  patientName: string;
  patientEmail: string | null;
  lastBody: string;
  lastAt: string;
  lastSenderRole: "patient" | "staff";
  unreadCount: number; // patient messages not yet read by staff
};

type MessageRow = {
  id: string;
  patient_id: string;
  sender_id: string | null;
  sender_role: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

function rowToMessage(row: MessageRow): Message {
  return {
    id: row.id,
    senderRole: row.sender_role as Message["senderRole"],
    senderId: row.sender_id,
    body: row.body,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

type Ctx = { supabase: unknown; userId: string };

async function assertStaff(context: Ctx): Promise<Db> {
  const db = context.supabase as Db;
  const { data, error } = await db.from("user_roles").select("role").eq("user_id", context.userId);
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

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------------------------------------------------------------------------
// Patient side
// ---------------------------------------------------------------------------
export const listMyThreadFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = (context as Ctx).supabase as Db;
    const { data, error } = await db
      .from("messages")
      .select("id, patient_id, sender_id, sender_role, body, read_at, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error("Could not load your messages.");
    return (data as MessageRow[]).map(rowToMessage);
  });

export const sendMyMessageFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ body: z.string().trim().min(1).max(4000) }))
  .handler(async ({ data, context }) => {
    const ctx = context as Ctx;
    const db = ctx.supabase as Db;

    const { data: row, error } = await db
      .from("messages")
      .insert({
        patient_id: ctx.userId,
        sender_id: ctx.userId,
        sender_role: "patient",
        body: data.body,
      })
      .select("id, patient_id, sender_id, sender_role, body, read_at, created_at")
      .single();
    if (error || !row) throw new Error("Could not send your message.");

    // Notify the clinic (internal — a preview is fine here).
    try {
      const { data: me } = await db
        .from("profiles")
        .select("first_name, last_name, email")
        .eq("id", ctx.userId)
        .maybeSingle();
      const name = me
        ? [me.first_name, me.last_name].filter(Boolean).join(" ").trim() || me.email || "A patient"
        : "A patient";
      const emails = await import("@/lib/emails.functions");
      const preview = data.body.length > 240 ? `${data.body.slice(0, 240)}…` : data.body;
      await emails.sendRawEmail({
        to: emails.adminRecipients(),
        subject: `New portal message from ${name}`,
        html: `
          <div style="font-family: 'Public Sans', Helvetica, Arial, sans-serif; color: #1F3D2E; max-width: 560px; margin: 0 auto; padding: 24px;">
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C47D5A; margin: 0 0 12px;">New Portal Message</p>
            <h1 style="font-size: 20px; margin: 0 0 12px;">${esc(name)}</h1>
            <div style="padding: 14px 16px; background: #FAF7F2; border: 1px solid #F0EDE5; border-radius: 3px; font-size: 14px; white-space: pre-wrap;">${esc(preview)}</div>
            <p style="margin-top: 16px; font-size: 13px;"><a href="${appOrigin()}/admin/messages" style="color: #1F3D2E;">Open in admin →</a></p>
          </div>`,
      });
    } catch (err) {
      console.error("[messages] clinic notification failed:", err);
    }

    return rowToMessage(row as MessageRow);
  });

export const markMyThreadReadFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as Ctx;
    const db = ctx.supabase as Db;
    const { error } = await db
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("patient_id", ctx.userId)
      .eq("sender_role", "staff")
      .is("read_at", null);
    if (error) throw new Error("Could not update messages.");
    return { ok: true as const };
  });

// ---------------------------------------------------------------------------
// Staff side (admin/clinician)
// ---------------------------------------------------------------------------
export const listMessageThreadsFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await assertStaff(context as Ctx);

    const { data: rows, error } = await db
      .from("messages")
      .select("id, patient_id, sender_id, sender_role, body, read_at, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load message threads.");

    const byPatient = new Map<string, MessageRow[]>();
    for (const row of rows as MessageRow[]) {
      const list = byPatient.get(row.patient_id) ?? [];
      list.push(row);
      byPatient.set(row.patient_id, list);
    }

    const patientIds = [...byPatient.keys()];
    const nameById = new Map<string, { name: string; email: string | null }>();
    if (patientIds.length) {
      const { data: profiles } = await db
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", patientIds);
      for (const p of (profiles ?? []) as Array<{ id: string; first_name: string | null; last_name: string | null; email: string | null }>) {
        const name = [p.first_name, p.last_name].filter(Boolean).join(" ").trim() || p.email || "Patient";
        nameById.set(p.id, { name, email: p.email });
      }
    }

    const threads: MessageThread[] = patientIds.map((pid) => {
      const msgs = byPatient.get(pid)!; // newest first (query order)
      const last = msgs[0]!;
      const unreadCount = msgs.filter((m) => m.sender_role === "patient" && m.read_at === null).length;
      const info = nameById.get(pid);
      return {
        patientId: pid,
        patientName: info?.name ?? "Patient",
        patientEmail: info?.email ?? null,
        lastBody: last.body,
        lastAt: last.created_at,
        lastSenderRole: last.sender_role as MessageThread["lastSenderRole"],
        unreadCount,
      };
    });

    threads.sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
    return threads;
  });

export const listThreadFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ patientId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const db = await assertStaff(context as Ctx);
    const { data: rows, error } = await db
      .from("messages")
      .select("id, patient_id, sender_id, sender_role, body, read_at, created_at")
      .eq("patient_id", data.patientId)
      .order("created_at", { ascending: true });
    if (error) throw new Error("Could not load the conversation.");
    return (rows as MessageRow[]).map(rowToMessage);
  });

export const sendStaffMessageFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ patientId: z.string().uuid(), body: z.string().trim().min(1).max(4000) }))
  .handler(async ({ data, context }) => {
    const ctx = context as Ctx;
    const db = await assertStaff(ctx);

    const { data: row, error } = await db
      .from("messages")
      .insert({
        patient_id: data.patientId,
        sender_id: ctx.userId,
        sender_role: "staff",
        body: data.body,
      })
      .select("id, patient_id, sender_id, sender_role, body, read_at, created_at")
      .single();
    if (error || !row) throw new Error("Could not send the message.");

    // Notify the patient — no body in the email (keep PHI out of inboxes).
    try {
      const { data: p } = await db
        .from("profiles")
        .select("first_name, email")
        .eq("id", data.patientId)
        .maybeSingle();
      if (p?.email) {
        const emails = await import("@/lib/emails.functions");
        const first = p.first_name ? esc(p.first_name) : "there";
        await emails.sendRawEmail({
          to: p.email,
          subject: "You have a new message from your care team — JC Integrative Health",
          html: `
            <div style="font-family: 'Public Sans', Helvetica, Arial, sans-serif; color: #1F3D2E; max-width: 560px; margin: 0 auto; padding: 24px;">
              <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C47D5A; margin: 0 0 12px;">New Message</p>
              <h1 style="font-size: 20px; margin: 0 0 12px;">Hi ${first},</h1>
              <p style="font-size: 14px; line-height: 1.6;">Your care team sent you a new message in the patient portal. For your privacy, the message is not included in this email.</p>
              <p style="margin-top: 16px;"><a href="${appOrigin()}/patient/messages" style="display: inline-block; background: #1F3D2E; color: #FAF7F2; text-decoration: none; padding: 10px 18px; border-radius: 3px; font-size: 13px;">Open your portal</a></p>
              <p style="margin-top: 20px; font-size: 12px; color: #436B52;">This portal is not for emergencies. If you are experiencing one, call 911.</p>
            </div>`,
        });
      }
    } catch (err) {
      console.error("[messages] patient notification failed:", err);
    }

    return rowToMessage(row as MessageRow);
  });

export const markThreadReadFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ patientId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const db = await assertStaff(context as Ctx);
    const { error } = await db
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("patient_id", data.patientId)
      .eq("sender_role", "patient")
      .is("read_at", null);
    if (error) throw new Error("Could not update the conversation.");
    return { ok: true as const };
  });
