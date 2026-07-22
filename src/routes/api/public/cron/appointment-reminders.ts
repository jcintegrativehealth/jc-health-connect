// HANDOFF §8.7 — appointment reminder endpoint, invoked by pg_cron via
// pg_net every 30 minutes (schedule SQL lives in LOVABLE-TODO.md).
// Sends the `appointment-reminder` template ~24h before Confirmed visits and
// stamps reminder_sent_at so a visit is never reminded twice.
import { createFileRoute } from "@tanstack/react-router";
import type { SupabaseClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/public/cron/appointment-reminders")({
  server: {
    handlers: {
      POST: handleReminders,
      GET: handleReminders,
    },
  },
});

type Db = SupabaseClient<any, "public", any>;

const DAY_MS = 86_400_000;

/** Minutes-since-epoch in the clinic's wall-clock time zone. */
function clinicNowMinutes(tz: string): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const dayNumber = Date.UTC(get("year"), get("month") - 1, get("day")) / DAY_MS;
  return dayNumber * 1440 + get("hour") * 60 + get("minute");
}

/** Same scale as clinicNowMinutes for a stored appointment date + 'HH:mm'. */
function appointmentMinutes(date: string, time: string): number {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  return (Date.UTC(y!, mo! - 1, d!) / DAY_MS) * 1440 + h! * 60 + mi!;
}

async function handleReminders({ request }: { request: Request }): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  const provided =
    request.headers.get("x-cron-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (provided !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as unknown as Db;

  const tz = process.env.CLINIC_TZ || "America/Denver";
  const now = clinicNowMinutes(tz);

  // Candidates: Confirmed, not yet reminded, with an email, today→+2 days.
  const from = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10);
  const to = new Date(Date.now() + 2 * DAY_MS).toISOString().slice(0, 10);
  const { data: rows, error } = await db
    .from("appointments")
    .select("id, date, time, patient_name, email, format, meeting_link")
    .eq("status", "Confirmed")
    .is("reminder_sent_at", null)
    .not("email", "is", null)
    .gte("date", from)
    .lte("date", to);

  if (error) {
    console.error("[reminders] query failed:", error);
    return Response.json({ error: "Query failed" }, { status: 500 });
  }

  // 23h–25h out: with a 30-minute cron cadence every visit lands in the
  // window exactly once before being stamped.
  const due = (rows ?? []).filter((r: any) => {
    const delta = appointmentMinutes(r.date, r.time) - now;
    return delta >= 23 * 60 && delta <= 25 * 60;
  });

  let sent = 0;
  const emails = await import("@/lib/emails.functions");
  for (const r of due as Array<{
    id: string; date: string; time: string; patient_name: string;
    email: string; format: string; meeting_link: string | null;
  }>) {
    const result = await emails.sendTemplateEmail({
      to: r.email,
      subject: "Reminder: your appointment is tomorrow — JC Integrative Health",
      template: "appointment-reminder",
      props: {
        firstName: r.patient_name.split(" ")[0],
        date: new Date(`${r.date}T12:00:00`).toLocaleDateString("en-US", {
          weekday: "long", month: "long", day: "numeric", year: "numeric",
        }),
        time: r.time,
        format: r.format,
        provider: "Dr. Jason Chen",
        joinUrl: r.meeting_link ?? undefined,
      },
    });

    if (result.ok) {
      const { error: stampError } = await db
        .from("appointments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", r.id);
      if (stampError) console.error(`[reminders] stamp failed for ${r.id}:`, stampError);
      sent += 1;
    }
  }

  return Response.json({ checked: rows?.length ?? 0, due: due.length, sent });
}
