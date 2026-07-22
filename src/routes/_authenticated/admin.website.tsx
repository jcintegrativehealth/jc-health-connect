import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Badge } from "@/components/admin/primitives";

export const Route = createFileRoute("/_authenticated/admin/website")({
  head: () => ({ meta: [{ title: "Website Content — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Website,
});

const pages = [
  { title: "Home", path: "/", updated: "Aug 15", status: "Published" as const },
  { title: "About", path: "/about", updated: "Aug 10", status: "Published" as const },
  { title: "Services", path: "/services", updated: "Aug 08", status: "Published" as const },
  { title: "Conditions", path: "/conditions", updated: "Aug 07", status: "Published" as const },
  { title: "Contact", path: "/contact", updated: "Aug 12", status: "Published" as const },
  { title: "Innovation Center", path: "/innovation", updated: "Aug 14", status: "Draft" as const },
  { title: "Guest Physicians", path: "/physicians", updated: "Aug 09", status: "Published" as const },
];

function Website() {
  return (
    <div>
      <PageHeader eyebrow="Editorial" title="Website content" description="Edit public pages, services, conditions and homepage sections." actions={<Btn>New page</Btn>} />

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Public pages" className="lg:col-span-2">
          <ul className="divide-y divide-navy/10 -m-4">
            {pages.map((p) => (
              <li key={p.path} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3">
                <div><div className="text-sm text-navy">{p.title}</div><div className="text-xs text-navy/50 font-mono">{p.path}</div></div>
                <div className="text-xs text-navy/50">Updated {p.updated}</div>
                <Badge tone={p.status}>{p.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Site health">
          <ul className="text-sm divide-y divide-navy/10 -m-4">
            <li className="flex justify-between px-4 py-3"><span>Broken links</span><span className="text-teal">0</span></li>
            <li className="flex justify-between px-4 py-3"><span>Missing alt text</span><span className="text-teal">0</span></li>
            <li className="flex justify-between px-4 py-3"><span>Pages without meta description</span><span className="text-gold">2</span></li>
            <li className="flex justify-between px-4 py-3"><span>Average LCP</span><span className="text-teal">1.4s</span></li>
            <li className="flex justify-between px-4 py-3"><span>Accessibility score</span><span className="text-teal">98</span></li>
          </ul>
        </Panel>

        <Panel title="Homepage sections" className="lg:col-span-3">
          <ul className="divide-y divide-navy/10 -m-4">
            {["Masthead / Hero", "At a glance", "Services grid", "Conditions we treat", "Featured research", "Guest physicians", "CTA — Book consultation"].map((s) => (
              <li key={s} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3">
                <div className="text-sm text-navy">{s}</div>
                <Badge tone="Published">Visible</Badge>
                <Btn variant="outline" size="sm">Edit</Btn>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
