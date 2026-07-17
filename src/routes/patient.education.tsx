import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PortalPageHeader, PortalCard } from "./patient";
import { education } from "@/data/patient";
import { Search, BookOpen, Video, FileText } from "lucide-react";

export const Route = createFileRoute("/patient/education")({
  head: () => ({ meta: [{ title: "Education — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: EducationPage,
});

const TABS = ["Recommended", "From Care Team", "Saved", "Recently viewed"];
const CATS = ["All", "Labs", "Nutrition", "Exercise", "Sleep", "Longevity", "Technology"];

const iconFor = (t: string) => t === "Video" ? <Video size={13} /> : t === "Article" ? <FileText size={13} /> : <BookOpen size={13} />;

function EducationPage() {
  const [tab, setTab] = useState(TABS[0]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const filtered = education.filter((e) => (cat === "All" || e.category === cat) && (!q || e.title.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PortalPageHeader eyebrow="Learning" title="Education" lede="Content curated by Dr. Chen and your care team." />

      <div className="flex flex-wrap gap-1 border-b border-navy/10 mb-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest border-b-2 -mb-px ${tab === t ? "border-gold text-navy" : "border-transparent text-navy/50 hover:text-navy"}`}>{t}</button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 border border-navy/15 rounded-sm bg-card">
          <Search size={14} className="text-navy/50" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles, guides, videos…" className="flex-1 py-2.5 bg-transparent text-sm outline-none" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-sm border ${cat === c ? "border-gold bg-gold/10 text-navy" : "border-navy/15 text-navy/60 hover:text-navy"}`}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <PortalCard><div className="py-10 text-center text-sm text-navy/55">No content matches your filters.</div></PortalCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <article key={e.title} className="bg-card border border-navy/10 rounded-sm p-5 hover:border-navy/25">
              <div className="flex items-center gap-2 text-navy/50 text-[10px] font-mono uppercase tracking-widest">{iconFor(e.type)} {e.type} · {e.time}</div>
              <h3 className="font-serif text-lg text-navy mt-2 leading-snug">{e.title}</h3>
              <p className="text-[11px] text-navy/50 mt-1">{e.category} · {e.author}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold">{e.reason}</span>
                <button className="text-[11px] font-mono uppercase tracking-widest text-navy/70 hover:text-navy">Save</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
