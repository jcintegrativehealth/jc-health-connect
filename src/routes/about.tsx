import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — JC Integrative Health" },
      { name: "description", content: "About JC Integrative Health: mission, philosophy, and commitment to evidence-based, personalized care." },
      { property: "og:title", content: "About — JC Integrative Health" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const SECTIONS = [
  { t: "Mission", d: "To provide personalized, evidence-based care that supports long-term health, prevention, and quality of life." },
  { t: "Vision", d: "A model of care in which integrative medicine, longevity science, and medical innovation converge into practical, thoughtful clinical practice." },
  { t: "Clinical Philosophy", d: "Care that begins with careful listening, is guided by evidence, and remains responsive to the individual — not to trends." },
  { t: "Evidence-Based Integrative Care", d: "Integrative approaches held to the same standards of evidence and accountability as any other area of medicine." },
  { t: "Personalized Health", d: "Recognition that each person's biology, context, and priorities are different, and that care should reflect that." },
  { t: "Prevention and Longevity", d: "A long view of health — measuring what matters, acting early, and prioritizing sustained function." },
  { t: "Medical Innovation", d: "Considered use of new diagnostics, therapies, and technologies as they mature into responsible clinical tools." },
  { t: "Multilingual Care", d: "Clinical communication in English, Spanish, Portuguese, and Mandarin so that language does not stand between patients and care." },
  { t: "Locations and States Served", d: "In-person visits in Colorado and Washington; telehealth for eligible patients across supported states." },
  { t: "Commitment to Education", d: "Active involvement in teaching and public health literacy through university lectures and clinical mentorship." },
  { t: "Commitment to Research", d: "Continuous engagement with published research, clinical trials, and evidence review." },
  { t: "Patient-Centered Experience", d: "A calm, respectful clinical environment that values time, clarity, and dignity." },
];

function AboutPage() {
  return (
    <div>
      <PageHeader eyebrow="About the Clinic" title="An institute of integrative medicine, longevity, and medical innovation." lede="JC Integrative Health is a clinical practice grounded in evidence, informed by research, and organized around the long-term health of each patient." />
      <Container className="pb-24">
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 border-t border-navy/10 pt-16">
          {SECTIONS.map((s, i) => (
            <div key={s.t}>
              <div className="font-mono text-[10px] text-navy/40 mb-3">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="font-serif text-2xl text-navy mb-3">{s.t}</h2>
              <p className="text-sm text-navy/65 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
