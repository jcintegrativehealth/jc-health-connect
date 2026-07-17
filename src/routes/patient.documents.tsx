import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, BtnGhost, BtnPrimary } from "./patient";
import { documents } from "@/data/patient";
import { FileText, Grid2x2, List, Search, Upload, X } from "lucide-react";

export const Route = createFileRoute("/patient/documents")({
  head: () => ({ meta: [{ title: "Documents — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: DocsPage,
});

const CATEGORIES = ["All", "Lab Reports", "Visit Summaries", "Care Plans", "Consent Documents", "Receipts", "Educational Materials"];

function DocsPage() {
  const [cat, setCat] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = documents.filter((d) => (cat === "All" || d.category === cat) && (!q || d.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PortalPageHeader eyebrow="Records" title="Documents" lede="Lab reports, visit summaries, consents, receipts and educational materials." actions={<BtnPrimary onClick={() => toast("Upload placeholder (demo)")}><Upload size={13} /> Upload</BtnPrimary>} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 border border-navy/15 rounded-sm bg-card">
          <Search size={14} className="text-navy/50" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents" className="flex-1 py-2.5 bg-transparent text-sm outline-none" />
        </div>
        <div className="flex gap-1">
          <button onClick={() => setView("grid")} className={`p-2.5 border rounded-sm ${view === "grid" ? "border-navy bg-navy text-paper" : "border-navy/15 text-navy/60"}`} aria-label="Grid"><Grid2x2 size={14} /></button>
          <button onClick={() => setView("list")} className={`p-2.5 border rounded-sm ${view === "list" ? "border-navy bg-navy text-paper" : "border-navy/15 text-navy/60"}`} aria-label="List"><List size={14} /></button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-sm border ${cat === c ? "border-gold bg-gold/10 text-navy" : "border-navy/15 text-navy/60 hover:text-navy"}`}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <PortalCard><div className="py-10 text-center text-sm text-navy/55">No documents match your filters.</div></PortalCard>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <button key={d.name} onClick={() => setPreview(d.name)} className="text-left bg-card border border-navy/10 rounded-sm p-5 hover:border-navy/25">
              <div className="h-24 bg-mist rounded-sm grid place-items-center text-navy/40 mb-4"><FileText size={28} strokeWidth={1.3} /></div>
              <div className="eyebrow text-navy/50 text-[10px]">{d.category}</div>
              <div className="font-serif text-navy mt-1">{d.name}</div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50 mt-2">{d.date} · {d.type} · {d.size}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-navy/10 rounded-sm overflow-hidden">
          <ul className="divide-y divide-navy/10">
            {filtered.map((d) => (
              <li key={d.name} className="px-5 py-3 flex items-center gap-3 hover:bg-mist/60">
                <FileText size={16} className="text-academic shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-navy truncate">{d.name}</div>
                  <div className="text-[11px] text-navy/50">{d.category} · {d.date} · {d.size}</div>
                </div>
                <button onClick={() => setPreview(d.name)} className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy">Preview</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm grid place-items-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-paper border border-navy/15 rounded-sm max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl text-navy">{preview}</h3>
              <button onClick={() => setPreview(null)}><X size={18} /></button>
            </div>
            <div className="h-64 bg-mist rounded-sm grid place-items-center text-navy/40 mb-4"><FileText size={40} strokeWidth={1.3} /></div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <BtnGhost onClick={() => toast("Share link copied (demo)")}>Share</BtnGhost>
              <BtnPrimary onClick={() => toast.success("Download started (demo)")}>Download</BtnPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
