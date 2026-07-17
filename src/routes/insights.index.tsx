import { createFileRoute, Link } from "@tanstack/react-router";
import { articles, insightsCategories } from "@/data/site";
import { Container, PageHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Medical Insights — JC Integrative Health" },
      { name: "description", content: "Editorial reviews, clinical commentary, and evidence summaries." },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: InsightsIndex,
});

function InsightsIndex() {
  const [featured, ...rest] = articles;
  return (
    <div>
      <PageHeader eyebrow="Medical Insights" title="Editorial writing on integrative medicine, longevity, and medical innovation." lede="Reviews and commentary informed by clinical practice and evidence." />

      <Container className="pb-8">
        <div className="flex flex-wrap gap-x-6 gap-y-3 border-y border-navy/10 py-5">
          <span className="eyebrow text-navy/50">Categories:</span>
          {insightsCategories.map((c) => (
            <span key={c} className="text-xs text-navy/60 hover:text-navy cursor-default">{c}</span>
          ))}
        </div>
      </Container>

      <Container className="pb-24">
        {/* Featured */}
        <Link to="/insights/$slug" params={{ slug: featured.slug }} className="group block py-16 border-b border-navy/10">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-center">
            <div className="aspect-[4/3] bg-linear-to-br from-navy/10 to-navy/5 grid place-items-center">
              <span className="font-serif italic text-navy/25 text-sm">Featured image</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px] font-mono uppercase tracking-widest text-navy/45">
                <span className="px-2 py-0.5 bg-navy text-paper">Editor's Selection</span>
                <span>{featured.category}</span>
                <span>{featured.readMinutes} min read</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight text-navy group-hover:text-teal transition-colors">{featured.title}</h2>
              <p className="mt-4 text-navy/65 max-w-2xl">{featured.summary}</p>
              <div className="mt-6 text-xs text-navy/50">{featured.author} · {new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
            </div>
          </div>
        </Link>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 pt-16">
          {rest.map((a) => (
            <Link key={a.slug} to="/insights/$slug" params={{ slug: a.slug }} className="group block">
              <div className="aspect-[4/3] bg-linear-to-br from-navy/10 to-navy/5 mb-6 grid place-items-center">
                <span className="font-serif italic text-navy/25 text-xs">Cover image</span>
              </div>
              <div className="eyebrow text-teal mb-3">{a.category}</div>
              <h3 className="font-serif text-2xl leading-tight text-navy group-hover:text-teal transition-colors">{a.title}</h3>
              <p className="mt-3 text-sm text-navy/60 line-clamp-3">{a.summary}</p>
              <div className="mt-5 flex items-center justify-between text-[11px] text-navy/45">
                <span>{a.author}</span>
                <span>{a.readMinutes} min</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
