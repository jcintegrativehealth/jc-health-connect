import { createFileRoute, Link } from "@tanstack/react-router";
import { physicians } from "@/data/site";
import { Container, PageHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/physicians/")({
  head: () => ({
    meta: [
      { title: "Guest Physicians — JC Integrative Health" },
      { name: "description", content: "A curated group of physician contributors and editorial collaborators." },
      { property: "og:url", content: "/physicians" },
    ],
    links: [{ rel: "canonical", href: "/physicians" }],
  }),
  component: () => (
    <div>
      <PageHeader eyebrow="Physicians" title="Guest physicians & editorial contributors." lede="A curated group of clinicians from academic and clinical settings who contribute reviews and commentary." />
      <Container className="pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-navy/10 pt-12">
          {physicians.map((p) => (
            <Link key={p.slug} to="/physicians/$slug" params={{ slug: p.slug }} className="group block">
              <div className="aspect-[4/5] bg-linear-to-b from-navy/10 to-navy/5 mb-5 grid place-items-center">
                <span className="font-serif italic text-navy/25 text-sm">Portrait</span>
              </div>
              <div className="eyebrow text-teal mb-2">{p.specialty}</div>
              <h2 className="font-serif text-2xl text-navy group-hover:text-teal transition-colors">{p.name}</h2>
              <p className="text-xs text-navy/50 mt-2">{p.institution}</p>
              <p className="text-xs text-navy/50">{p.location}</p>
              <p className="text-sm text-navy/60 mt-4 line-clamp-2">{p.bio}</p>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="pb-24">
        <div className="bg-mist/40 p-10 border border-navy/10">
          <div className="eyebrow text-gold mb-3">Editorial Process</div>
          <h2 className="font-serif text-3xl text-navy mb-6">Curated by invitation</h2>
          <ol className="grid md:grid-cols-4 gap-6 text-sm">
            {["Invitation received", "Profile setup", "Article submission", "Editorial review", "Revisions", "Approval", "Publication"].map((s, i) => (
              <li key={s} className="flex items-start gap-3">
                <span className="font-mono text-[10px] text-teal shrink-0 pt-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-navy/75">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Link to="/contact" className="inline-flex items-center px-5 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic">Request an invitation</Link>
          </div>
        </div>
      </Container>
    </div>
  ),
});
