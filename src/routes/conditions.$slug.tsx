import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { conditions } from "@/data/site";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";

export const Route = createFileRoute("/conditions/$slug")({
  loader: ({ params }) => {
    const c = conditions.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return { condition: c };
  },
  head: ({ loaderData, params }) => loaderData ? ({
    meta: [
      { title: `${loaderData.condition.name} — JC Integrative Health` },
      { name: "description", content: loaderData.condition.summary },
      { property: "og:url", content: `/conditions/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/conditions/${params.slug}` }],
  }) : ({ meta: [{ title: "Condition" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { condition } = Route.useLoaderData();
    return (
      <div>
        <Container className="pt-20 pb-6">
          <div className="eyebrow mb-4 text-navy/50"><Link to="/conditions" className="hover:text-navy">Conditions</Link> / {condition.name}</div>
        </Container>
        <PageHeader eyebrow="Condition" title={condition.name} lede={condition.summary} />
        <Container className="pb-24">
          <div className="max-w-3xl border-t border-navy/10 pt-12 space-y-8">
            <p className="text-navy/70 leading-relaxed text-lg">{condition.body}</p>
            <Disclaimer>This content is educational and does not replace evaluation by a qualified clinician.</Disclaimer>
            <div className="flex justify-center">
              <Link to="/book" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic transition-colors">Book a Consultation</Link>
            </div>
          </div>
        </Container>
      </div>
    );
  },
  notFoundComponent: () => <Container className="py-24"><h1 className="font-serif text-4xl">Not found</h1></Container>,
});
