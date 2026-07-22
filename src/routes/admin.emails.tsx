import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { render } from "@react-email/render";
import { PageHeader, Panel, Btn } from "@/components/admin/primitives";
import { Mail, Monitor, Smartphone, Code2, Eye, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { WelcomeEmail } from "@/lib/email-templates/welcome";
import { AppointmentRequestReceived } from "@/lib/email-templates/appointment-request-received";
import { AppointmentConfirmed } from "@/lib/email-templates/appointment-confirmed";
import { AppointmentReminder } from "@/lib/email-templates/appointment-reminder";
import { AppointmentCancellation } from "@/lib/email-templates/appointment-cancellation";
import { AppointmentRescheduled } from "@/lib/email-templates/appointment-rescheduled";
import { ContactConfirmation } from "@/lib/email-templates/contact-confirmation";
import { PasswordReset } from "@/lib/email-templates/password-reset";

export const Route = createFileRoute("/admin/emails")({
  head: () => ({
    meta: [
      { title: "Email Previews — JC Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EmailPreview,
});

type TemplateDef = {
  id: string;
  name: string;
  description: string;
  subject: string;
  audience: string;
  sample: Record<string, unknown>;
  render: (props: any) => React.ReactElement;
};

const TEMPLATES: TemplateDef[] = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Sent after a patient completes portal registration.",
    subject: "Welcome to JC Integrative Health",
    audience: "New patient",
    sample: {
      firstName: "Emily",
      portalUrl: "https://jc-health-connect.lovable.app/portal",
      completeProfileUrl: "https://jc-health-connect.lovable.app/portal/forms",
    },
    render: (p) => <WelcomeEmail {...p} />,
  },
  {
    id: "appointment-request-received",
    name: "Appointment Request Received",
    description: "Confirms a booking submission before clinical review.",
    subject: "We received your appointment request",
    audience: "Prospective patient",
    sample: {
      firstName: "Emily",
      requestedDate: "Thursday, August 6, 2026",
      requestedTime: "10:30 AM ET",
      format: "Telehealth",
      service: "Integrative Consultation",
      referenceCode: "JC-2026-08421",
    },
    render: (p) => <AppointmentRequestReceived {...p} />,
  },
  {
    id: "appointment-confirmed",
    name: "Appointment Confirmed",
    description: "Sent once the clinical team schedules the visit.",
    subject: "Your appointment is confirmed",
    audience: "Patient",
    sample: {
      firstName: "Emily",
      date: "Thursday, August 6, 2026",
      time: "10:30 AM ET",
      format: "Telehealth",
      provider: "Dr. Jason Chen, DO",
      service: "Integrative Consultation",
      duration: "50 minutes",
      joinUrl: "https://jc-health-connect.lovable.app/join/demo-room",
      rescheduleUrl: "https://jc-health-connect.lovable.app/portal/appointments",
      preparationNotes:
        "Please have a recent list of medications and supplements ready. Find a quiet, well-lit space for the visit.",
    },
    render: (p) => <AppointmentConfirmed {...p} />,
  },
  {
    id: "appointment-reminder",
    name: "Appointment Reminder",
    description: "Sent approximately 24 hours before the scheduled visit.",
    subject: "Reminder — your visit tomorrow",
    audience: "Patient",
    sample: {
      firstName: "Emily",
      date: "Thursday, August 6, 2026",
      time: "10:30 AM ET",
      format: "Telehealth",
      provider: "Dr. Jason Chen, DO",
      joinUrl: "https://jc-health-connect.lovable.app/join/demo-room",
      rescheduleUrl: "https://jc-health-connect.lovable.app/portal/appointments",
    },
    render: (p) => <AppointmentReminder {...p} />,
  },
  {
    id: "contact-confirmation",
    name: "Contact Confirmation",
    description: "Auto-reply after the /contact form submission.",
    subject: "We received your message",
    audience: "Website visitor",
    sample: {
      firstName: "Emily",
      inquiryType: "Professional Inquiry",
      messagePreview:
        "Hello Dr. Chen — I would like to discuss a potential collaboration on integrative approaches to metabolic health…",
      submittedAt: "July 22, 2026 · 3:14 PM ET",
    },
    render: (p) => <ContactConfirmation {...p} />,
  },
  {
    id: "password-reset-patient",
    name: "Password Reset — Patient",
    description: "Reset link for patient portal accounts.",
    subject: "Reset your JC portal password",
    audience: "Patient",
    sample: {
      firstName: "Emily",
      resetUrl: "https://jc-health-connect.lovable.app/portal/reset?token=demo",
      expiresInMinutes: 60,
      audience: "patient",
    },
    render: (p) => <PasswordReset {...p} />,
  },
  {
    id: "password-reset-admin",
    name: "Password Reset — Admin",
    description: "Reset link for administrator accounts.",
    subject: "Reset your JC admin password",
    audience: "Administrator",
    sample: {
      firstName: "Jason",
      resetUrl: "https://jc-health-connect.lovable.app/admin/reset?token=demo",
      expiresInMinutes: 30,
      audience: "admin",
    },
    render: (p) => <PasswordReset {...p} />,
  },
];

function EmailPreview() {
  const [activeId, setActiveId] = useState(TEMPLATES[0].id);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [mode, setMode] = useState<"preview" | "html">("preview");
  const [html, setHtml] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const active = useMemo(
    () => TEMPLATES.find((t) => t.id === activeId) ?? TEMPLATES[0],
    [activeId],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const el = active.render(active.sample);
    Promise.all([render(el), render(el, { plainText: true })])
      .then(([h, t]) => {
        if (cancelled) return;
        setHtml(h);
        setText(t);
      })
      .catch(() => {
        if (cancelled) return;
        setHtml("<pre style='padding:24px;font-family:monospace;color:#8a2b1f'>Failed to render template.</pre>");
        setText("");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      toast.success("HTML copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Unable to copy HTML");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Communications"
        title="Email Previews"
        description="Render each transactional template with sample data before sending. Read-only — sending is handled server-side."
        actions={
          <Btn variant="outline" onClick={copyHtml}>
            {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
            <span className="ml-1.5">Copy HTML</span>
          </Btn>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Template list */}
        <Panel title="Templates" className="lg:sticky lg:top-4 self-start">
          <ul className="-m-4 divide-y divide-navy/8">
            {TEMPLATES.map((t) => {
              const isActive = t.id === activeId;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveId(t.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      isActive ? "bg-navy/[0.04]" : "hover:bg-navy/[0.02]"
                    }`}
                  >
                    <span
                      className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                        isActive ? "bg-gold" : "bg-navy/20"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-navy font-medium truncate">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-navy/55 mt-0.5 leading-snug">
                        {t.description}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-navy/40 mt-1.5">
                        {t.audience}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* Preview column */}
        <div className="space-y-4 min-w-0">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] text-navy/45">
                  Subject
                </div>
                <div className="font-serif text-lg text-navy mt-0.5 leading-tight">
                  {active.subject}
                </div>
                <div className="text-[11px] text-navy/55 mt-1">
                  To: <span className="text-navy/75">{active.audience}</span> · From:{" "}
                  <span className="text-navy/75">
                    JC Integrative Health &lt;no-reply@jcintegrativehealth.com&gt;
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-sm border border-navy/15 overflow-hidden">
                  <button
                    onClick={() => setMode("preview")}
                    className={`px-2.5 py-1.5 text-[11px] uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
                      mode === "preview"
                        ? "bg-navy text-paper"
                        : "text-navy/60 hover:text-navy"
                    }`}
                  >
                    <Eye size={12} /> Preview
                  </button>
                  <button
                    onClick={() => setMode("html")}
                    className={`px-2.5 py-1.5 text-[11px] uppercase tracking-widest flex items-center gap-1.5 transition-colors border-l border-navy/15 ${
                      mode === "html"
                        ? "bg-navy text-paper"
                        : "text-navy/60 hover:text-navy"
                    }`}
                  >
                    <Code2 size={12} /> HTML
                  </button>
                </div>
                {mode === "preview" && (
                  <div className="inline-flex rounded-sm border border-navy/15 overflow-hidden">
                    <button
                      onClick={() => setDevice("desktop")}
                      className={`px-2.5 py-1.5 flex items-center transition-colors ${
                        device === "desktop"
                          ? "bg-navy text-paper"
                          : "text-navy/60 hover:text-navy"
                      }`}
                      aria-label="Desktop"
                    >
                      <Monitor size={13} />
                    </button>
                    <button
                      onClick={() => setDevice("mobile")}
                      className={`px-2.5 py-1.5 flex items-center transition-colors border-l border-navy/15 ${
                        device === "mobile"
                          ? "bg-navy text-paper"
                          : "text-navy/60 hover:text-navy"
                      }`}
                      aria-label="Mobile"
                    >
                      <Smartphone size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <Panel>
            {loading ? (
              <div className="h-[560px] grid place-items-center text-[11px] uppercase tracking-widest text-navy/45">
                Rendering…
              </div>
            ) : mode === "preview" ? (
              <div className="flex justify-center bg-navy/[0.03] -m-4 p-4 sm:p-6 rounded-sm min-h-[560px]">
                <iframe
                  key={active.id + device}
                  title={`${active.name} preview`}
                  srcDoc={html}
                  className="bg-white border border-navy/10 rounded-sm shadow-sm"
                  style={{
                    width: device === "desktop" ? "100%" : 390,
                    maxWidth: device === "desktop" ? 720 : 390,
                    height: 720,
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 -m-1">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-navy/45 mb-1.5 flex items-center gap-1.5">
                    <Code2 size={11} /> HTML
                  </div>
                  <pre className="text-[11px] leading-relaxed text-navy/80 bg-navy/[0.04] border border-navy/10 rounded-sm p-3 overflow-auto max-h-[640px] whitespace-pre-wrap break-all">
                    {html}
                  </pre>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-navy/45 mb-1.5 flex items-center gap-1.5">
                    <Mail size={11} /> Plain text
                  </div>
                  <pre className="text-[11px] leading-relaxed text-navy/80 bg-navy/[0.04] border border-navy/10 rounded-sm p-3 overflow-auto max-h-[640px] whitespace-pre-wrap">
                    {text || "—"}
                  </pre>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Sample data">
            <pre className="text-[11px] leading-relaxed text-navy/80 bg-navy/[0.04] border border-navy/10 rounded-sm p-3 overflow-auto max-h-64 -m-1">
              {JSON.stringify(active.sample, null, 2)}
            </pre>
            <div className="text-[11px] text-navy/55 mt-3">
              These are mocked values for visual review only. Real recipient data
              is injected at send time by the server.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
