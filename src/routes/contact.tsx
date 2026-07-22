import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";
import { SubmitCta } from "@/components/site/cta";
import { useState } from "react";
import { submitContactFn } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JC Integrative Health" },
      { name: "description", content: "Contact JC Integrative Health for patient, professional, media, and research inquiries." },
      { property: "og:title", content: 'Contact — JC Integrative Health' },
      { property: "og:description", content: 'Contact JC Integrative Health for patient, professional, media, and research inquiries.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Contact — JC Integrative Health' },
      { name: "twitter:description", content: 'Contact JC Integrative Health for patient, professional, media, and research inquiries.' },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const ASIDE_KEYS = ["patient", "professional", "media", "education", "research"] as const;
const INQUIRY_KEYS = ["patient", "appointment", "professional", "research", "speaking", "media", "general"] as const;

function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    language: "",
    state: "",
    inquiry: "",
    message: "",
  });

  const set = (k: keyof typeof f) => (v: string) => setF((d) => ({ ...d, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setError(null);
    setSending(true);
    try {
      // Only §2.5 fields persist as columns; the extra form context travels
      // inside the message body so nothing the sender typed is lost.
      const extras = [
        f.phone && `Phone: ${f.phone}`,
        f.language && `Preferred language: ${f.language}`,
        f.state && `State: ${f.state}`,
      ]
        .filter(Boolean)
        .join(" · ");
      await submitContactFn({
        data: {
          name: f.name,
          email: f.email,
          inquiryType: f.inquiry || undefined,
          message: extras ? `${f.message}\n\n—\n${extras}` : f.message,
        },
      });
      setSent(true);
      setF({ name: "", email: "", phone: "", language: "", state: "", inquiry: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow={t("contact.eyebrow")} title={t("contact.title")} lede={t("contact.lede")} />
      <Container className="pb-24">
        <div className="grid lg:grid-cols-[1fr_360px] gap-16 border-t border-navy/10 pt-12">
          <form onSubmit={onSubmit} className="space-y-6">
            {sent && (
              <div className="p-5 border-l-2 border-teal bg-teal/5 text-navy text-sm">
                {t("contact.success")}
              </div>
            )}
            {error && (
              <div className="p-5 border-l-2 border-gold bg-gold/5 text-navy text-sm">
                {error}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <Field label={t("contact.fields.name")}>
                <input required className="input" value={f.name} onChange={(e) => set("name")(e.target.value)} />
              </Field>
              <Field label={t("contact.fields.email")}>
                <input required type="email" className="input" value={f.email} onChange={(e) => set("email")(e.target.value)} />
              </Field>
              <Field label={t("contact.fields.phone")}>
                <input className="input" value={f.phone} onChange={(e) => set("phone")(e.target.value)} />
              </Field>
              <Field label={t("contact.fields.language")}>
                <select className="input" value={f.language} onChange={(e) => set("language")(e.target.value)}>
                  <option>{t("contact.languages.en")}</option>
                  <option>{t("contact.languages.es")}</option>
                  <option>{t("contact.languages.pt")}</option>
                  <option>{t("contact.languages.zh")}</option>
                </select>
              </Field>
              <Field label={t("contact.fields.state")}>
                <select className="input" value={f.state} onChange={(e) => set("state")(e.target.value)}>
                  <option>{t("contact.states.va")}</option>
                  <option>{t("contact.states.md")}</option>
                  <option>{t("contact.states.co")}</option>
                  <option>{t("contact.states.other")}</option>
                </select>
              </Field>
              <Field label={t("contact.fields.inquiry")}>
                <select className="input" value={f.inquiry} onChange={(e) => set("inquiry")(e.target.value)}>
                  {INQUIRY_KEYS.map((k) => (
                    <option key={k}>{t(`contact.inquiries.${k}`)}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label={t("contact.fields.message")}>
              <textarea required rows={5} className="input" value={f.message} onChange={(e) => set("message")(e.target.value)} />
            </Field>
            <label className="flex items-start gap-3 text-xs text-navy/65">
              <input type="checkbox" required className="mt-0.5" /> {t("contact.consent")}
            </label>
            <Disclaimer>{t("contact.disclaimer")}</Disclaimer>
            <div className="flex flex-col sm:flex-row justify-center pt-2">
              <SubmitCta disabled={sending}>{sending ? "…" : t("contact.submit")}</SubmitCta>
            </div>
          </form>

          <aside className="space-y-4">
            {ASIDE_KEYS.map((k) => (
              <div key={k} className="p-5 border border-navy/10">
                <div className="eyebrow text-teal mb-2">{t(`contact.aside.${k}.t`)}</div>
                <p className="text-sm text-navy/60">{t(`contact.aside.${k}.d`)}</p>
              </div>
            ))}
          </aside>
        </div>
      </Container>

      <style>{`
        .input { display: block; width: 100%; background: transparent; border: 1px solid oklch(0.88 0.008 260); padding: 0.75rem 0.875rem; font-size: 0.875rem; color: oklch(0.22 0.037 258); outline: none; }
        .input:focus { border-color: var(--teal); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-navy/50 mb-2 block">{label}</span>
      {children}
    </label>
  );
}
