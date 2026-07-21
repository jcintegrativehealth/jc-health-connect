import { createFileRoute } from "@tanstack/react-router";
import { medications } from "@/data/site";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";

export const Route = createFileRoute("/medications")({
  head: () => ({
    meta: [
      { title: "Medication Updates — JC Integrative Health" },
      { name: "description", content: "Educational summaries of new medications, FDA updates, and research pipelines." },
      { property: "og:title", content: 'Medication Updates — JC Integrative Health' },
      { property: "og:description", content: 'Educational summaries of new medications, FDA updates, and research pipelines.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Medication Updates — JC Integrative Health' },
      { name: "twitter:description", content: 'Educational summaries of new medications, FDA updates, and research pipelines.' },
      { property: "og:url", content: "/medications" },
    ],
    links: [{ rel: "canonical", href: "/medications" }],
  }),
  component: () => (
    <div>
      <PageHeader eyebrow="Medication Updates" title="Educational summaries on new medications and research pipelines." lede="Structured, plainly written updates for patients and clinicians alike." />
      <Container className="pb-24">
        <div className="divide-y divide-navy/10 border-y border-navy/10">
          {medications.map((m, i) => (
            <div key={m.slug} className="py-8 grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-1 font-mono text-[10px] text-navy/40 tracking-widest">{String(i + 1).padStart(2, "0")}</div>
              <div className="col-span-12 md:col-span-7">
                <h2 className="font-serif text-2xl text-navy">{m.name}</h2>
                <div className="text-xs uppercase tracking-widest text-teal mt-2">{m.classLabel} · {m.status}</div>
                <p className="text-sm text-navy/70 mt-4">{m.use}</p>
                <p className="text-sm text-navy/55 mt-2 italic">{m.note}</p>
              </div>
              <div className="col-span-12 md:col-span-4 text-xs text-navy/55 md:text-right">
                <div className="eyebrow text-navy/40 mb-2">Educational Summary</div>
                <p>Non-exhaustive summary intended for educational context. See references for underlying literature.</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 max-w-3xl">
          <Disclaimer>This content is for educational purposes only and is not medical advice. Individual decisions about medications should be made with a qualified clinician.</Disclaimer>
        </div>
      </Container>
    </div>
  ),
});
