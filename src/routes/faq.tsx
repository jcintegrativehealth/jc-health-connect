import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/site/primitives";

const FAQ: { cat: string; items: { q: string; a: string }[] }[] = [
  { cat: "Appointments", items: [
    { q: "How do I book an appointment?", a: "Use the Book Appointment page to select visit type, state, and preferred language." },
    { q: "How long is an initial visit?", a: "Typically 60–90 minutes for a comprehensive initial consultation." },
  ] },
  { cat: "Telehealth", items: [
    { q: "Which states can I have a telehealth visit in?", a: "Currently Colorado and Washington." },
    { q: "What do I need for a telehealth visit?", a: "A modern browser, camera, microphone, and stable internet." },
  ] },
  { cat: "Languages", items: [{ q: "Which languages are supported?", a: "English, Spanish, Portuguese, and Mandarin." }] },
  { cat: "Insurance", items: [{ q: "Do you accept insurance?", a: "Coverage varies by plan and state — see the Insurance page for detail." }] },
  { cat: "First Visit", items: [{ q: "What should I bring to my first visit?", a: "Recent labs, medications, and any prior clinical documents relevant to your concerns." }] },
  { cat: "Medical Records", items: [{ q: "How do I request records?", a: "Submit a records request through the Patient Portal or Contact page." }] },
  { cat: "Prescriptions", items: [{ q: "How do refills work?", a: "Message your physician through the Patient Portal ahead of running out." }] },
  { cat: "Privacy", items: [{ q: "Is my information protected?", a: "Yes — HIPAA-aligned processes and platforms are used throughout care." }] },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — JC Integrative Health" },
      { name: "description", content: "Frequently asked questions about appointments, telehealth, languages, insurance, and more." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ.flatMap((s) => s.items).map((i) => ({
          "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }),
    }],
  }),
  component: () => (
    <div>
      <PageHeader eyebrow="FAQ" title="Frequently asked questions." />
      <Container className="pb-24">
        <div className="grid lg:grid-cols-[200px_1fr] gap-12 border-t border-navy/10 pt-12">
          <nav className="text-sm text-navy/60 space-y-2 lg:sticky lg:top-32 h-fit">
            {FAQ.map((s) => <a key={s.cat} href={`#${s.cat}`} className="block hover:text-navy">{s.cat}</a>)}
          </nav>
          <div className="space-y-12">
            {FAQ.map((section) => (
              <section id={section.cat} key={section.cat}>
                <h2 className="font-serif text-3xl text-navy mb-4">{section.cat}</h2>
                <div className="divide-y divide-navy/10 border-y border-navy/10">
                  {section.items.map((i) => (
                    <details key={i.q} className="py-5">
                      <summary className="cursor-pointer text-navy font-medium flex justify-between items-center list-none">
                        <span>{i.q}</span><span className="text-teal">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-navy/65 leading-relaxed">{i.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  ),
});
