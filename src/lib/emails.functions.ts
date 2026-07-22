// HANDOFF §5 — internal email helper. Renders a template by name and sends it.
// Server-only: import this module ONLY via `await import()` inside a server fn
// handler or server route, never at the top level of client-reachable code.
//
// Delivery goes through Resend's REST API (connector already available).
// If RESEND_API_KEY is not set the send is skipped with a console warning so
// booking/contact flows never fail because of email issues.
import * as React from "react";
import { render } from "@react-email/render";

import type { AppointmentRequestReceivedProps } from "@/lib/email-templates/appointment-request-received";
import type { NewAppointmentRequestAdminProps } from "@/lib/email-templates/new-appointment-request-admin";
import type { AppointmentConfirmedProps } from "@/lib/email-templates/appointment-confirmed";
import type { AppointmentReminderProps } from "@/lib/email-templates/appointment-reminder";
import type { AppointmentCancellationProps } from "@/lib/email-templates/appointment-cancellation";
import type { AppointmentRescheduledProps } from "@/lib/email-templates/appointment-rescheduled";
import type { ContactConfirmationProps } from "@/lib/email-templates/contact-confirmation";
import type { WelcomeEmailProps } from "@/lib/email-templates/welcome";

export type TemplateProps = {
  "welcome": WelcomeEmailProps;
  "appointment-request-received": AppointmentRequestReceivedProps;
  "new-appointment-request-admin": NewAppointmentRequestAdminProps;
  "appointment-confirmed": AppointmentConfirmedProps;
  "appointment-reminder": AppointmentReminderProps;
  "appointment-cancellation": AppointmentCancellationProps;
  "appointment-rescheduled": AppointmentRescheduledProps;
  "contact-confirmation": ContactConfirmationProps;
};

export type TemplateName = keyof TemplateProps;

const loaders: { [K in TemplateName]: () => Promise<{ default: React.ComponentType<TemplateProps[K]> }> } = {
  "welcome": () => import("@/lib/email-templates/welcome"),
  "appointment-request-received": () => import("@/lib/email-templates/appointment-request-received"),
  "new-appointment-request-admin": () => import("@/lib/email-templates/new-appointment-request-admin"),
  "appointment-confirmed": () => import("@/lib/email-templates/appointment-confirmed"),
  "appointment-reminder": () => import("@/lib/email-templates/appointment-reminder"),
  "appointment-cancellation": () => import("@/lib/email-templates/appointment-cancellation"),
  "appointment-rescheduled": () => import("@/lib/email-templates/appointment-rescheduled"),
  "contact-confirmation": () => import("@/lib/email-templates/contact-confirmation"),
};

function fromAddress(): string {
  // Until the clinic domain is verified with Resend, the default sender is
  // Resend's onboarding address (only deliverable to the account owner).
  return process.env.EMAIL_FROM || "JC Integrative Health <onboarding@resend.dev>";
}

/** Clinic inboxes notified on new booking/contact activity. */
export function adminRecipients(): string[] {
  return (process.env.ADMIN_NOTIFY_EMAILS || "drjason@jcintegrativehealth.com,jcintegrativehealth3@gmail.com")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function renderEmailTemplate<K extends TemplateName>(
  template: K,
  props: TemplateProps[K],
): Promise<string> {
  const mod = await loaders[template]();
  return render(React.createElement(mod.default, props));
}

export type SendResult = { ok: boolean; error?: string };

export async function sendRawEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = Array.isArray(input.to) ? input.to : [input.to];

  if (!apiKey) {
    console.warn(`[emails] RESEND_API_KEY not set — skipped "${input.subject}" to ${to.join(", ")}`);
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to,
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[emails] Resend ${res.status} for "${input.subject}": ${detail}`);
      return { ok: false, error: `Resend ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error(`[emails] send failed for "${input.subject}":`, err);
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

/**
 * Render + send one of the §4 templates. Never throws — callers treat email
 * as a side effect that must not break the main flow.
 */
export async function sendTemplateEmail<K extends TemplateName>(input: {
  to: string | string[];
  subject: string;
  template: K;
  props: TemplateProps[K];
  replyTo?: string;
}): Promise<SendResult> {
  try {
    const html = await renderEmailTemplate(input.template, input.props);
    return await sendRawEmail({ to: input.to, subject: input.subject, html, replyTo: input.replyTo });
  } catch (err) {
    console.error(`[emails] render failed for template "${input.template}":`, err);
    return { ok: false, error: err instanceof Error ? err.message : "render failed" };
  }
}
