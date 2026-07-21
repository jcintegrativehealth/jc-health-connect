import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";
import { SubmitCta } from "@/components/site/cta";
import { useState } from "react";

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
  return (
    <div>
      <PageHeader eyebrow={t("contact.eyebrow")} title={t("contact.title")} lede={t("contact.lede")} />
      <Container className="pb-24">
        <div className="grid lg:grid-cols-[1fr_360px] gap-16 border-t border-navy/10 pt-12">
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6">
            {sent && (
              <div className="p-5 border-l-2 border-teal bg-teal/5 text-navy text-sm">
                {t("contact.success")}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <Field label={t("contact.fields.name")}><input required className="input" /></Field>
              <Field label={t("contact.fields.email")}><input required type="email" className="input" /></Field>
              <Field label={t("contact.fields.phone")}><input className="input" /></Field>
              <Field label={t("contact.fields.language")}>
                <select className="input">
                  <option>{t("contact.languages.en")}</option>
                  <option>{t("contact.languages.es")}</option>
                  <option>{t("contact.languages.pt")}</option>
                  <option>{t("contact.languages.zh")}</option>
                </select>
              </Field>
              <Field label={t("contact.fields.state")}>
                <select className="input">
                  <option>{t("contact.states.co")}</option>
                  <option>{t("contact.states.wa")}</option>
                  <option>{t("contact.states.other")}</option>
                </select>
              </Field>
              <Field label={t("contact.fields.inquiry")}>
                <select className="input">
                  {INQUIRY_KEYS.map((k) => (
                    <option key={k}>{t(`contact.inquiries.${k}`)}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label={t("contact.fields.message")}><textarea rows={5} className="input" /></Field>
            <label className="flex items-start gap-3 text-xs text-navy/65">
              <input type="checkbox" required className="mt-0.5" /> {t("contact.consent")}
            </label>
            <Disclaimer>{t("contact.disclaimer")}</Disclaimer>
            <div className="flex flex-col sm:flex-row justify-center pt-2">
              <SubmitCta>{t("contact.submit")}</SubmitCta>
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
