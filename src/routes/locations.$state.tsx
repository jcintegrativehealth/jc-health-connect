import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/site/primitives";

const LOCATIONS: Record<string, { name: string; short: string; description: string }> = {
  colorado: { name: "Colorado", short: "CO", description: "In-person and telehealth care in Colorado." },
  washington: { name: "Washington", short: "WA", description: "In-person and telehealth care in Washington." },
  telehealth: { name: "Telehealth", short: "Virtual", description: "Virtual care for eligible patients in supported states." },
};

export const Route = createFileRoute("/locations/$state")({
  loader: ({ params }) => {
    const loc = LOCATIONS[params.state];
    if (!loc) throw notFound();
    return { loc };
  },
  head: ({ loaderData, params }) => loaderData ? ({
    meta: [
      { title: `${loaderData.loc.name} — JC Integrative Health` },
      { name: "description", content: loaderData.loc.description },
      { property: "og:url", content: `/locations/${params.state}` },
    ],
    links: [{ rel: "canonical", href: `/locations/${params.state}` }],
  }) : ({ meta: [{ title: "Location" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { loc } = Route.useLoaderData();
    return (
      <div>
        <PageHeader eyebrow={`Location · ${loc.short}`} title={loc.name} lede={loc.description} />
        <Container className="pb-24">
          <div className="grid md:grid-cols-2 gap-12 border-t border-navy/10 pt-12">
            <div className="space-y-6">
              <Row label="Care availability" value="In-person consultations and telehealth for eligible patients." />
              <Row label="Services" value="Integrative Medicine · Longevity · Preventive · Metabolic · Sleep · Nutrition" />
              <Row label="Languages" value="English · Spanish · Portuguese · Mandarin" />
              <Row label="Telehealth information" value="Available for follow-up and select initial visits." />
              <Row label="Address" value="Address placeholder — to be published." />
              <Row label="Contact" value="Available through the Contact page." />
              <div className="flex gap-3 pt-4">
                <Link to="/book" className="px-5 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic">Book Appointment</Link>
                <Link to="/contact" className="px-5 py-3 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.18em] hover:bg-navy/5">Contact</Link>
              </div>
            </div>
            <div className="aspect-square bg-linear-to-br from-mist to-navy/10 grid place-items-center">
              <span className="font-serif italic text-navy/25 text-sm">Location imagery</span>
            </div>
          </div>
        </Container>
      </div>
    );
  },
  notFoundComponent: () => <Container className="py-24"><h1 className="font-serif text-4xl">Location not found</h1></Container>,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-navy/10 pb-4">
      <div className="eyebrow text-navy/40 mb-1">{label}</div>
      <div className="text-navy">{value}</div>
    </div>
  );
}
