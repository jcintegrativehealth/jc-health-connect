import { createFileRoute } from "@tanstack/react-router";
import { innovations } from "@/data/site";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";
import { StatusBadge } from "./index";
import { useState } from "react";

export const Route = createFileRoute("/innovation")({
  head: () => ({
    meta: [
      { title: "Medical Innovation — JC Integrative Health" },
      { name: "description", content: "Innovation Radar: medical devices, wearables, AI, digital health, medications, clinical trials." },
      { property: "og:url", content: "/innovation" },
    ],
    links: [{ rel: "canonical", href: "/innovation" }],
  }),
  component: InnovationPage,
});

const STATUSES = ["All", "Available Now", "Emerging", "In Clinical Trials", "Experimental"] as const;

function InnovationPage() {
  const [active, setActive] = useState<(typeof STATUSES)[number]>("All");
  const list = active === "All" ? innovations : innovations.filter((i) => i.status === active);

  return (
    <div>
      <PageHeader eyebrow="Medical Innovation" title="Innovation Radar" lede="Tracking new devices, wearables, AI, digital health, and medications with careful attention to evidence and limitations." />

      <Container className="pb-24">
        <div className="border-y border-navy/10 py-6 flex flex-wrap gap-3 items-center">
          <span className="eyebrow text-navy/50">Status:</span>
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setActive(s)} className={`text-xs font-semibold uppercase tracking-[0.15em] px-3 py-1.5 border transition-colors ${active === s ? "bg-navy text-paper border-navy" : "border-navy/15 text-navy/60 hover:border-navy"}`}>{s}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-navy/10 ring-1 ring-navy/10 mt-12">
          {list.map((it) => (
            <div key={it.slug} className="p-8 bg-paper">
              <div className="flex items-center justify-between mb-5">
                <StatusBadge status={it.status} />
                <span className="font-mono text-[10px] text-navy/40 uppercase">Evidence: {it.evidence}</span>
              </div>
              <h2 className="font-serif text-2xl text-navy mb-2">{it.name}</h2>
              <p className="text-xs uppercase tracking-widest text-navy/40 mb-4">{it.category}</p>
              <p className="text-sm text-navy/65 mb-5 leading-relaxed">{it.summary}</p>
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="eyebrow text-navy/40 mb-1">Potential use</dt>
                  <dd className="text-navy/70">{it.potential}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-navy/40 mb-1">Limitations</dt>
                  <dd className="text-navy/70">{it.limitations}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl">
          <Disclaimer>The status and evidence levels shown reflect editorial assessment. This content is educational and not a validation, endorsement, or recommendation for any specific product or intervention.</Disclaimer>
        </div>

        <div className="mt-16 grid md:grid-cols-4 gap-6">
          {["Medical Devices", "Wearables", "AI in Medicine", "Digital Health", "New Medications", "Clinical Trials", "Precision Medicine", "Future of Health"].map((c) => (
            <div key={c} className="p-6 border border-navy/10">
              <div className="eyebrow text-teal mb-3">Focus Area</div>
              <div className="font-serif text-xl text-navy">{c}</div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
