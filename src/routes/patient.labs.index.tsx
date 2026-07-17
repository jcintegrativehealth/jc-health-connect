import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PortalPageHeader, PortalCard, StatusPill } from "./patient";
import { labs } from "@/data/patient";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/patient/labs/")({
  head: () => ({ meta: [{ title: "Lab Results — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: LabsPage,
});

const CATEGORIES = ["All", "Metabolic", "Cardiovascular", "Thyroid", "Inflammation", "Longevity"] as const;

function LabsPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const filtered = cat === "All" ? labs : labs.filter((l) => l.category === cat);

  return (
    <div>
      <PortalPageHeader eyebrow="My Health · Labs" title="Lab results" lede="Review recent panels reviewed by your care team." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "New results", value: labs.filter((l) => l.reviewStatus === "Awaiting Review").length, tone: "warn" as const },
          { label: "Awaiting review", value: labs.filter((l) => l.reviewStatus === "Awaiting Review").length, tone: "info" as const },
          { label: "Reviewed", value: labs.filter((l) => l.reviewStatus === "Reviewed").length, tone: "success" as const },
          { label: "Follow-up recommended", value: labs.filter((l) => l.reviewStatus === "Follow-Up Recommended").length, tone: "gold" as const },
        ].map((k) => (
          <div key={k.label} className="border border-navy/10 rounded-sm p-4 bg-card">
            <div className="eyebrow text-navy/50 text-[10px]">{k.label}</div>
            <div className="font-serif text-3xl text-navy mt-1">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-sm border ${cat === c ? "border-gold bg-gold/10 text-navy" : "border-navy/15 text-navy/60 hover:text-navy"}`}>{c}</button>
        ))}
      </div>

      <div className="bg-card border border-navy/10 rounded-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.6fr_1fr_1fr_1fr_auto] px-5 py-3 border-b border-navy/10 text-[10px] font-mono uppercase tracking-widest text-navy/50">
          <span>Panel</span><span>Date</span><span>Laboratory</span><span>Review</span><span></span>
        </div>
        <ul className="divide-y divide-navy/10">
          {filtered.map((l) => (
            <li key={l.id}>
              <Link to="/patient/labs/$id" params={{ id: l.id }} className="grid md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] items-center gap-2 px-5 py-4 hover:bg-mist/60">
                <div>
                  <div className="text-navy">{l.panel}</div>
                  <div className="text-[11px] text-navy/50">{l.category} · {l.biomarkers} biomarkers</div>
                </div>
                <div className="text-sm text-navy/70">{new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                <div className="text-sm text-navy/70">{l.lab}</div>
                <div><StatusPill tone={l.reviewStatus === "Reviewed" ? "success" : l.reviewStatus === "Awaiting Review" ? "warn" : "gold"}>{l.reviewStatus}</StatusPill></div>
                <ChevronRight size={16} className="text-navy/30 justify-self-end" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
