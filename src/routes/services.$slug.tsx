import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { services, articles } from "@/data/site";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Service — JC Integrative Health" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.service.name} — JC Integrative Health` },
        { name: "description", content: loaderData.service.summary },
        { property: "og:title", content: loaderData.service.name },
        { property: "og:url", content: `/services/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params.slug}` }],
    };
  },
  component: ServiceDetail,
  notFoundComponent: () => (
    <Container className="py-24 text-center">
      <h1 className="font-serif text-4xl text-navy">Service not found</h1>
      <Link to="/services" className="mt-6 inline-block text-sm font-semibold border-b border-navy pb-1">Back to services</Link>
    </Container>
  ),
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const related = articles.filter((a) => service.related.includes(a.slug));

  return (
    <div>
      <div className="pt-20 pb-8">
        <Container>
          <div className="flex items-center gap-4 text-xs text-navy/50 mb-6 eyebrow">
            <Link to="/services" className="hover:text-navy">Services</Link>
            <span>/</span>
            <span>{service.name}</span>
          </div>
        </Container>
      </div>
      <PageHeader eyebrow={service.short} title={service.name} lede={service.summary} />

      <Container className="pb-24">
        <div className="grid lg:grid-cols-[1fr_320px] gap-16 border-t border-navy/10 pt-16">
          <div className="space-y-14">
            <Block title="Overview"><p className="text-navy/70 leading-relaxed">{service.overview}</p></Block>
            <Block title="Who this service may help"><Bullets items={service.helps} /></Block>
            <Block title="Common concerns"><Bullets items={service.concerns} /></Block>
            <Block title="Our approach"><Bullets items={service.approach} numbered /></Block>
            <Block title="What to expect"><Bullets items={service.expect} numbered /></Block>
            {service.faqs.length > 0 && (
              <Block title="Frequently asked questions">
                <div className="divide-y divide-navy/10 border-y border-navy/10">
                  {service.faqs.map((f: { q: string; a: string }) => (
                    <details key={f.q} className="py-5 group">
                      <summary className="cursor-pointer text-navy font-medium flex justify-between items-center list-none">
                        <span>{f.q}</span>
                        <span className="text-teal">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-navy/65">{f.a}</p>
                    </details>
                  ))}
                </div>
              </Block>
            )}
            <Disclaimer>Content on this page is educational and does not replace individual medical evaluation. Recommendations depend on each person's clinical context.</Disclaimer>
          </div>

          <aside className="space-y-10 lg:sticky lg:top-32 h-fit">
            <div className="bg-navy text-paper p-8">
              <div className="eyebrow text-gold mb-3">Get Started</div>
              <h3 className="font-serif text-2xl mb-4">Book a consultation</h3>
              <p className="text-sm text-paper/60 mb-6">Initial visits typically last 60–90 minutes and include a written care plan.</p>
              <Link to="/book" className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 bg-teal text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-gold transition-colors">Book Appointment</Link>
            </div>

            {related.length > 0 && (
              <div>
                <div className="eyebrow text-navy/50 mb-4">Related research</div>
                <ul className="space-y-4">
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link to="/insights/$slug" params={{ slug: a.slug }} className="text-sm font-medium text-navy hover:text-teal">
                        {a.title}
                      </Link>
                      <div className="text-[11px] text-navy/45 mt-1 font-mono uppercase">{a.category}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-navy mb-5">{title}</h2>
      {children}
    </section>
  );
}
function Bullets({ items, numbered }: { items: string[]; numbered?: boolean }) {
  return (
    <ol className="space-y-3">
      {items.map((x, i) => (
        <li key={x} className="flex gap-4 text-navy/70">
          <span className="font-mono text-[10px] text-teal shrink-0 pt-1.5 w-6">{numbered ? String(i + 1).padStart(2, "0") : "·"}</span>
          <span className="leading-relaxed">{x}</span>
        </li>
      ))}
    </ol>
  );
}
