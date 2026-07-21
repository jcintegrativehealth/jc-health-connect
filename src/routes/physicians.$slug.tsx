import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { physicians, articles } from "@/data/site";
import { Container, PageHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/physicians/$slug")({
  loader: ({ params }) => {
    const p = physicians.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { physician: p };
  },
  head: ({ loaderData, params }) => loaderData ? ({
    meta: [
      { title: `${loaderData.physician.name} — JC Integrative Health` },
      { name: "description", content: loaderData.physician.bio },
      { property: "og:url", content: `/physicians/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/physicians/${params.slug}` }],
  }) : ({ meta: [{ title: "Physician" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { physician } = Route.useLoaderData();
    const written = articles.filter((a) => physician.articles.includes(a.slug));
    return (
      <div>
        <Container className="pt-20 pb-6">
          <div className="eyebrow text-navy/45 mb-4"><Link to="/physicians" className="hover:text-navy">Physicians</Link> / {physician.name}</div>
        </Container>
        <PageHeader eyebrow={physician.specialty} title={physician.name} lede={physician.bio} />
        <Container className="pb-24">
          <div className="grid lg:grid-cols-[320px_1fr] gap-12 border-t border-navy/10 pt-12 items-start">
            <div>
              <div className="aspect-[4/5] bg-linear-to-b from-navy/10 to-navy/5 grid place-items-center">
                <span className="font-serif italic text-navy/25 text-sm">Portrait</span>
              </div>
              <div className="mt-4 inline-flex items-center px-2 py-1 bg-teal/10 text-teal text-[10px] font-semibold uppercase tracking-[0.18em]">Verified Contributor</div>
            </div>
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div><div className="eyebrow text-navy/40 mb-1">Specialty</div><div className="text-navy">{physician.specialty}</div></div>
                <div><div className="eyebrow text-navy/40 mb-1">Institution</div><div className="text-navy">{physician.institution}</div></div>
                <div><div className="eyebrow text-navy/40 mb-1">Location</div><div className="text-navy">{physician.location}</div></div>
                <div><div className="eyebrow text-navy/40 mb-1">Areas of interest</div><div className="text-navy">{physician.interests.join(" · ")}</div></div>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-navy mb-4">Articles & contributions</h2>
                {written.length === 0 ? (
                  <p className="text-sm text-navy/55">No contributions published yet.</p>
                ) : (
                  <ul className="divide-y divide-navy/10">
                    {written.map((a) => (
                      <li key={a.slug}>
                        <Link to="/insights/$slug" params={{ slug: a.slug }} className="block py-4 hover:text-teal">
                          <div className="eyebrow text-teal mb-1">{a.category}</div>
                          <div className="text-navy font-medium">{a.title}</div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex justify-center">
                <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.18em] hover:bg-navy/5 transition-colors">Contact professional inquiries</Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  },
  notFoundComponent: () => (
    <NotFoundInline
      label="Physician unavailable"
      title="This profile is not available"
      description="This physician is no longer listed. Explore our full team of clinicians."
      backTo="/physicians"
      backLabel="View physicians"
    />
  ),
});
