import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";

export const Route = createFileRoute("/dr-chen")({
  head: () => ({
    meta: [
      { title: "Dr. Jason Chen — JC Integrative Health" },
      { name: "description", content: "Dr. Jason Chen — physician in integrative medicine, university lecturer, and clinic director. Practicing in Colorado and Washington." },
      { property: "og:title", content: "Dr. Jason Chen" },
      { property: "og:url", content: "/dr-chen" },
    ],
    links: [{ rel: "canonical", href: "/dr-chen" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Physician",
        name: "Jason Chen, MD",
        medicalSpecialty: ["IntegrativeMedicine", "PreventiveMedicine"],
        areaServed: ["Colorado", "Washington"],
        knowsLanguage: ["English", "Spanish", "Portuguese", "Mandarin Chinese"],
      }),
    }],
  }),
  component: DrChenPage,
});

function DrChenPage() {
  return (
    <div>
      <PageHeader eyebrow="Physician" title="Dr. Jason Chen" lede="Physician in integrative medicine, university lecturer, and clinic director." />
      <Container className="pb-24">
        <div className="grid lg:grid-cols-[400px_1fr] gap-16 items-start border-t border-navy/10 pt-16">
          <div className="aspect-[4/5] bg-linear-to-b from-navy/10 to-navy/5 ring-1 ring-navy/10 grid place-items-center">
            <span className="font-serif italic text-navy/25 text-sm">Portrait placeholder</span>
          </div>
          <div className="space-y-10">
            <Section title="Professional introduction">
              Dr. Jason Chen is a physician focused on integrative medicine, longevity, and preventive care. His clinical practice combines a careful medical evaluation with attention to nutrition, sleep, movement, and the responsible integration of medical technology into everyday care.
            </Section>
            <Section title="Clinical philosophy">
              Care that begins with listening, is guided by evidence, and remains responsive to the individual. Interventions are chosen for the person in front of the physician, not for a category of patients.
            </Section>
            <Section title="Academic role & university teaching">
              Active involvement in graduate and postgraduate medical education, with lecture and mentorship activity across integrative medicine and longevity topics.
            </Section>
            <Section title="Clinical leadership">
              Direction of clinical practices with an emphasis on protocol design, quality of care, and multidisciplinary collaboration.
            </Section>
            <Section title="Areas of medical interest">
              <ul className="grid grid-cols-2 gap-y-2 text-sm text-navy/65">
                {["Integrative medicine", "Longevity", "Preventive medicine", "Medical technology", "Clinical research", "Nutrition & lifestyle", "Metabolic health", "Personalized medicine"].map((x) => (<li key={x}>· {x}</li>))}
              </ul>
            </Section>
            <Section title="Languages">English · Spanish · Portuguese · Mandarin</Section>
            <Section title="States served">Colorado · Washington · Telehealth in supported states.</Section>

            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <Link to="/contact" className="border border-navy/10 p-6 hover:border-teal transition-colors block">
                <div className="eyebrow text-teal mb-2">Professional Inquiries</div>
                <div className="font-serif text-2xl text-navy">Collaborations & research</div>
                <p className="text-sm text-navy/55 mt-2">For clinical partnerships, research, or physician contributions.</p>
              </Link>
              <Link to="/contact" className="border border-navy/10 p-6 hover:border-teal transition-colors block">
                <div className="eyebrow text-teal mb-2">Speaking & Education</div>
                <div className="font-serif text-2xl text-navy">Lectures & interviews</div>
                <p className="text-sm text-navy/55 mt-2">For educational events, media, or teaching engagements.</p>
              </Link>
            </div>

            <Disclaimer>Content on this page is professional and educational in nature. Specific credentials, publications, and institutional affiliations are maintained in the clinic's administrative records.</Disclaimer>
          </div>
        </div>
      </Container>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-navy mb-3">{title}</h2>
      <div className="text-sm text-navy/65 leading-relaxed">{children}</div>
    </div>
  );
}
