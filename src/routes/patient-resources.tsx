import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/patient-resources")({
  head: () => ({
    meta: [
      { title: "Patient Resources — JC Integrative Health" },
      { name: "description", content: "New patient information, preparing for visits, forms, insurance, and more." },
      { property: "og:title", content: 'Patient Resources — JC Integrative Health' },
      { property: "og:description", content: 'New patient information, preparing for visits, forms, insurance, and more.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Patient Resources — JC Integrative Health' },
      { name: "twitter:description", content: 'New patient information, preparing for visits, forms, insurance, and more.' },
      { property: "og:url", content: "/patient-resources" },
    ],
    links: [{ rel: "canonical", href: "/patient-resources" }],
  }),
  component: () => (
    <div>
      <PageHeader eyebrow="Patient Resources" title="Resources for a clear, unhurried experience of care." />
      <Container className="pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-navy/10 pt-12">
          {[
            ["New Patients", "How to become a patient and what to expect."],
            ["Existing Patients", "Ongoing care, portals, and follow-ups."],
            ["Preparing for Your Visit", "Practical guidance for a productive consultation."],
            ["Insurance and Payment", "How billing works at JC Integrative Health."],
            ["Telehealth Guide", "Technology, preparation, and consent."],
            ["Forms", "Intake and consent forms."],
            ["Frequently Asked Questions", "Answers to common patient questions."],
            ["Patient Education", "Curated educational resources."],
            ["Downloads", "PDF summaries and reference sheets."],
            ["Privacy", "How we handle patient information."],
            ["Medical Records Request", "Requesting your records."],
            ["Prescription Refill Info", "Refill process and timing."],
            ["Urgent & Emergency Info", "What to do in an emergency."],
          ].map(([t, d]) => (
            <Link key={t} to="/faq" className="p-6 border border-navy/10 hover:border-teal transition-colors block">
              <div className="eyebrow text-teal mb-2">Resource</div>
              <div className="font-serif text-xl text-navy">{t}</div>
              <p className="text-sm text-navy/55 mt-2">{d}</p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  ),
});
