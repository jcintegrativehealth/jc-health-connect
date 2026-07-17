import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Btn, Badge } from "@/components/admin/primitives";
import { research } from "@/data/admin";

export const Route = createFileRoute("/admin/research/$id")({
  loader: ({ params }) => {
    const r = research.find((x) => x.id === params.id);
    if (!r) throw notFound();
    return { post: r };
  },
  head: ({ loaderData }) => loaderData
    ? { meta: [{ title: `${loaderData.post.title} — JC Admin` }, { name: "robots", content: "noindex" }] }
    : { meta: [{ title: "Research — JC Admin" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="text-center py-24">
      <div className="eyebrow text-gold">404</div>
      <h1 className="font-serif text-3xl text-navy mt-2">Post not found</h1>
      <div className="mt-6"><Link to="/admin/research" className="text-xs uppercase tracking-widest text-navy/70 hover:text-navy">← Back</Link></div>
    </div>
  ),
  component: ResearchEditor,
});

function ResearchEditor() {
  const { post } = Route.useLoaderData();
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState("## Abstract\n\nEvidence synthesis in progress.\n\n## Methods\n\n…\n\n## Results\n\n…\n\n## Discussion\n\n…");
  const [status, setStatus] = useState(post.status);

  return (
    <div>
      <PageHeader
        eyebrow={`Research · ${post.id}`}
        title="Edit research post"
        crumbs={[{ label: "Research", to: "/admin/research" }, { label: post.id }]}
        actions={<>
          <Btn variant="outline">Preview</Btn>
          <Btn variant="outline">Save draft</Btn>
          <Btn>Submit for review</Btn>
        </>}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <Panel>
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-navy/55">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5 w-full h-11 border border-navy/15 bg-card px-3 text-lg font-serif text-navy outline-none focus:border-teal" />
          </label>
          <label className="block mt-4">
            <span className="text-[11px] uppercase tracking-widest text-navy/55">Body (markdown)</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={22} className="mt-1.5 w-full border border-navy/15 bg-card p-3 text-sm font-mono text-navy outline-none focus:border-teal" />
          </label>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">DOI / Reference</span>
              <input className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" placeholder="10.xxxx/…" /></label>
            <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Reading time (min)</span>
              <input type="number" className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" placeholder="8" /></label>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Publish">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-navy/50">Status</span><Badge tone={status}>{status}</Badge></div>
              <select value={status} onChange={(e) => setStatus(e.target.value as never)} className="w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal">
                {["Draft", "In Review", "Approved", "Scheduled", "Published", "Archived"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Publish date</span>
                <input type="datetime-local" className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" /></label>
              <label className="flex items-center gap-2 text-navy/70"><input type="checkbox" className="accent-teal" /> Featured on homepage</label>
              <label className="flex items-center gap-2 text-navy/70"><input type="checkbox" className="accent-teal" /> Allow public comments</label>
            </div>
          </Panel>

          <Panel title="Metadata">
            <div className="space-y-3 text-sm">
              <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Category</span>
                <select className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal">
                  {["Longevity", "Metabolic", "Cardiovascular", "Integrative", "Preventive"].map((c) => <option key={c}>{c}</option>)}
                </select></label>
              <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Evidence level</span>
                <select className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal">
                  {["Systematic review", "Narrative review", "Clinical commentary", "Case series"].map((c) => <option key={c}>{c}</option>)}
                </select></label>
              <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Tags</span>
                <input className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" placeholder="glp-1, longevity, metabolic" /></label>
              <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Guest physician</span>
                <input defaultValue={post.guest === "—" ? "" : post.guest} className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" placeholder="—" /></label>
            </div>
          </Panel>

          <Panel title="SEO">
            <div className="space-y-3 text-sm">
              <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Meta title</span>
                <input className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" /></label>
              <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Meta description</span>
                <textarea rows={3} className="mt-1.5 w-full border border-navy/15 bg-card p-3 text-sm outline-none focus:border-teal" /></label>
              <label className="block"><span className="text-[11px] uppercase tracking-widest text-navy/55">Canonical URL</span>
                <input className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" /></label>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
