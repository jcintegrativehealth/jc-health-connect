import { createFileRoute, Link } from "@tanstack/react-router";
import { articles } from "@/data/site";
import { Container, PageHeader } from "@/components/site/primitives";
import { useState } from "react";

export const Route = createFileRoute("/research/")({
  head: () => ({
    meta: [
      { title: "Research Hub — JC Integrative Health" },
      { name: "description", content: "Research library, reviews, and evidence summaries." },
      { property: "og:url", content: "/research" },
    ],
    links: [{ rel: "canonical", href: "/research" }],
  }),
  component: ResearchIndex,
});

const TYPES = ["All", "Research Review", "Clinical Commentary", "Evidence Summary", "New Study", "Medication Update", "Technology Review", "Expert Perspective"];

function ResearchIndex() {
  const [active, setActive] = useState("All");
  const list = active === "All" ? articles : articles.filter((a) => a.type === active);

  return (
    <div>
      <PageHeader eyebrow="Research Hub" title="A curated library of research reviews and evidence summaries." lede="Structured writing on studies, medications, and technology — with attention to evidence quality and limitations." />

      <Container className="pb-24">
        <div className="border-y border-navy/10 py-6 flex flex-wrap gap-4 items-center">
          <span className="eyebrow text-navy/50">Filter by type:</span>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`text-xs uppercase tracking-[0.15em] font-semibold px-3 py-1.5 border transition-colors ${active === t ? "border-navy bg-navy text-paper" : "border-navy/15 text-navy/60 hover:border-navy"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <ul className="divide-y divide-navy/10">
          {list.map((a) => (
            <li key={a.slug}>
              <Link to="/insights/$slug" params={{ slug: a.slug }} className="grid grid-cols-12 py-8 gap-4 hover:bg-mist/40 transition-colors group px-2 -mx-2">
                <div className="col-span-12 md:col-span-2 font-mono text-[10px] text-navy/45 uppercase tracking-widest">
                  {new Date(a.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
                <div className="col-span-12 md:col-span-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal">{a.type}</span>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <h2 className="font-serif text-xl md:text-2xl text-navy group-hover:text-teal transition-colors">{a.title}</h2>
                  <p className="text-sm text-navy/55 mt-2 line-clamp-2">{a.summary}</p>
                </div>
                <div className="col-span-12 md:col-span-2 text-right text-xs text-navy/50">
                  <div>{a.author}</div>
                  <div className="font-mono uppercase mt-1">{a.evidence}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
