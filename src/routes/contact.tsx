import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — JC Integrative Health" },
      { name: "description", content: "Contact JC Integrative Health for patient, professional, media, and research inquiries." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <PageHeader eyebrow="Contact" title="How can we help?" lede="Choose the inquiry type that best matches your request. We do not monitor this form for medical emergencies." />
      <Container className="pb-24">
        <div className="grid lg:grid-cols-[1fr_360px] gap-16 border-t border-navy/10 pt-12">
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6">
            {sent && (
              <div className="p-5 border-l-2 border-teal bg-teal/5 text-navy text-sm">
                Thank you. Your message has been received (demo). We reply to legitimate inquiries within a few business days.
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Name"><input required className="input" /></Field>
              <Field label="Email"><input required type="email" className="input" /></Field>
              <Field label="Phone"><input className="input" /></Field>
              <Field label="Preferred Language">
                <select className="input"><option>English</option><option>Spanish</option><option>Portuguese</option><option>Mandarin</option></select>
              </Field>
              <Field label="State">
                <select className="input"><option>Colorado</option><option>Washington</option><option>Other / Not Applicable</option></select>
              </Field>
              <Field label="Inquiry Type">
                <select className="input">
                  <option>Patient Inquiry</option>
                  <option>Appointment Question</option>
                  <option>Professional Collaboration</option>
                  <option>Research</option>
                  <option>Speaking Engagement</option>
                  <option>Media Inquiry</option>
                  <option>General Contact</option>
                </select>
              </Field>
            </div>
            <Field label="Message"><textarea rows={5} className="input" /></Field>
            <label className="flex items-start gap-3 text-xs text-navy/65">
              <input type="checkbox" required className="mt-0.5" /> I consent to being contacted about my inquiry and understand this form is not monitored for emergencies.
            </label>
            <Disclaimer>Do not submit sensitive medical information through this form. For medical emergencies, call 911 or your local emergency service.</Disclaimer>
            <div className="flex flex-col sm:flex-row justify-center pt-2">
              <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic transition-colors">Send Message</button>
            </div>
          </form>

          <aside className="space-y-4">
            {[
              ["Patient Support", "Questions about visits, portal, and billing."],
              ["Professional Inquiries", "Clinical collaborations and physician contributors."],
              ["Media", "Interviews and press."],
              ["Education & Speaking", "Lectures, teaching, and events."],
              ["Research Collaboration", "Academic and clinical research partnerships."],
            ].map(([t, d]) => (
              <div key={t} className="p-5 border border-navy/10">
                <div className="eyebrow text-teal mb-2">{t}</div>
                <p className="text-sm text-navy/60">{d}</p>
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
