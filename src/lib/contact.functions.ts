// HANDOFF §5 — contact server function.
// Public submit (§2.5): rate-limited, service-role insert, then fires the
// sender confirmation + clinic notification emails as non-blocking effects.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

type Db = SupabaseClient<any, "public", any>;

export const submitContactFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(1).max(200),
      email: z.string().trim().email().max(320),
      inquiryType: z.string().trim().max(120).optional(),
      message: z.string().trim().min(1).max(6000),
    }),
  )
  .handler(async ({ data }) => {
    const { assertRateLimit, clientIp } = await import("@/lib/rate-limit.server");
    assertRateLimit(`contact:${clientIp()}`, 5, 10 * 60_000);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as Db;

    const { data: row, error } = await db
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        inquiry_type: data.inquiryType ?? null,
        message: data.message,
      })
      .select("id, created_at")
      .single();

    if (error || !row) {
      console.error("[contact] insert failed:", error);
      throw new Error("Could not send your message. Please try again.");
    }

    const submittedAt = new Date(row.created_at as string).toLocaleString("en-US");

    // Emails are side effects — the submission is already stored.
    try {
      const emails = await import("@/lib/emails.functions");
      const firstName = data.name.split(" ")[0];

      await emails.sendTemplateEmail({
        to: data.email,
        subject: "We received your message — JC Integrative Health",
        template: "contact-confirmation",
        props: {
          firstName,
          inquiryType: data.inquiryType,
          messagePreview: data.message.length > 220 ? `${data.message.slice(0, 220)}…` : data.message,
          submittedAt,
        },
      });

      const esc = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      await emails.sendRawEmail({
        to: emails.adminRecipients(),
        subject: `New contact submission — ${data.name}${data.inquiryType ? ` (${data.inquiryType})` : ""}`,
        replyTo: data.email,
        html: `
          <div style="font-family: 'Public Sans', Helvetica, Arial, sans-serif; color: #1F3D2E; max-width: 560px; margin: 0 auto; padding: 24px;">
            <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C47D5A; margin: 0 0 12px;">New Contact Submission</p>
            <h1 style="font-size: 22px; margin: 0 0 16px;">${esc(data.name)}</h1>
            <table style="font-size: 14px; border-collapse: collapse;">
              <tr><td style="padding: 4px 12px 4px 0; color: #436B52;">Email</td><td style="padding: 4px 0;"><a href="mailto:${esc(data.email)}" style="color: #1F3D2E;">${esc(data.email)}</a></td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color: #436B52;">Inquiry</td><td style="padding: 4px 0;">${esc(data.inquiryType ?? "—")}</td></tr>
              <tr><td style="padding: 4px 12px 4px 0; color: #436B52;">Received</td><td style="padding: 4px 0;">${esc(submittedAt)}</td></tr>
            </table>
            <div style="margin-top: 16px; padding: 14px 16px; background: #FAF7F2; border: 1px solid #F0EDE5; border-radius: 3px; font-size: 14px; white-space: pre-wrap;">${esc(data.message)}</div>
            <p style="margin-top: 16px; font-size: 12px; color: #436B52;">Reply directly to this email to answer the sender.</p>
          </div>`,
      });
    } catch (err) {
      console.error("[contact] notification emails failed:", err);
    }

    return { ok: true as const, id: row.id as string };
  });
