import { createFileRoute, Link } from "@tanstack/react-router";
import { services } from "@/data/site";
import { Container, PageHeader } from "@/components/site/primitives";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — JC Integrative Health" },
      { name: "description", content: "Integrative medicine, longevity, preventive health, and personalized care services." },
      { property: "og:description", content: 'Integrative medicine, longevity, preventive health, and personalized care services.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Services — JC Integrative Health' },
      { name: "twitter:description", content: 'Integrative medicine, longevity, preventive health, and personalized care services.' },
      { property: "og:title", content: "Services" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div>
      <PageHeader eyebrow="Services" title="Personalized medical care, organized around long-term health." lede="An integrated view of care spanning integrative medicine, longevity, prevention, and medical technology." />
      <Container className="pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10 ring-1 ring-navy/10 border-t border-navy/10">
          {services.map((s, i) => (
            <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group p-8 bg-paper hover:bg-navy hover:text-paper transition-colors">
              <div className="font-mono text-[10px] text-navy/40 group-hover:text-paper/50 mb-4">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="text-lg font-medium mb-2">{s.name}</h2>
              <p className="text-xs uppercase tracking-widest text-teal group-hover:text-gold mb-4">{s.short}</p>
              <p className="text-sm text-navy/60 group-hover:text-paper/60 line-clamp-3">{s.summary}</p>
              <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal group-hover:text-gold">
                Learn more <ArrowUpRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
