import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalPageHeader, PortalCard, StatusPill, BtnGhost } from "./patient";
import { carePlan } from "@/data/patient";

export const Route = createFileRoute("/patient/care-plan")({
  head: () => ({ meta: [{ title: "Care Plan — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: CarePlanPage,
});

function CarePlanPage() {
  return (
    <div>
      <PortalPageHeader
        eyebrow={`Care · ${carePlan.phase}`}
        title={carePlan.name}
        lede={carePlan.goal}
        actions={<BtnGhost>Download PDF (demo)</BtnGhost>}
      />

      {/* Progress hero */}
      <div className="bg-card border border-navy/10 rounded-sm p-6 mb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <div className="eyebrow text-navy/50">Progress</div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-navy/50">Next review · {carePlan.nextReview}</div>
        </div>
        <div className="flex items-end gap-4">
          <div className="font-serif text-5xl text-navy leading-none">{carePlan.progress}%</div>
          <div className="flex-1 pb-2">
            <div className="w-full h-2 bg-mist rounded-full overflow-hidden"><div className="h-full bg-teal" style={{ width: `${carePlan.progress}%` }} /></div>
            <div className="mt-1 text-[11px] font-mono uppercase tracking-widest text-navy/50">{carePlan.phase} · Updated {carePlan.updated}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-4 gap-3 mt-6">
          {[{ l: "Goals in progress", v: 4 }, { l: "Completed", v: 6 }, { l: "Upcoming", v: 3 }, { l: "Overdue", v: 1 }].map((k) => (
            <div key={k.l} className="border border-navy/8 rounded-sm p-3">
              <div className="eyebrow text-navy/50 text-[10px]">{k.l}</div>
              <div className="font-serif text-2xl text-navy mt-1">{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {carePlan.sections.map((s) => (
          <PortalCard key={s.title} title={s.title}>
            <ul className="divide-y divide-navy/10">
              {s.items.map((i) => (
                <li key={i.rec} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-navy">{i.rec}</div>
                    <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50">{i.freq}</div>
                  </div>
                  <StatusPill tone={i.status === "In Progress" ? "info" : i.status === "Not Started" ? "neutral" : i.status === "Requires Review" ? "warn" : "success"}>{i.status}</StatusPill>
                </li>
              ))}
            </ul>
          </PortalCard>
        ))}

        <PortalCard title="Care plan history" className="md:col-span-2">
          <ul className="divide-y divide-navy/10 text-sm">
            {[
              { v: "v3", date: "Jul 12, 2026", by: "Dr. Jason Chen", changes: "Added Zone 2 cardio target; adjusted supplement timing" },
              { v: "v2", date: "Jun 20, 2026", by: "Dr. Jason Chen", changes: "Introduced Metformin ER; refined sleep target" },
              { v: "v1", date: "Jun 05, 2026", by: "Dr. Jason Chen", changes: "Initial plan established" },
            ].map((h) => (
              <li key={h.v} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="font-mono text-[11px] uppercase tracking-widest text-gold w-16">{h.v}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-navy">{h.changes}</div>
                  <div className="text-[11px] text-navy/50">{h.date} · {h.by}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-[11px] font-mono uppercase tracking-widest text-navy/60 hover:text-navy">View</button>
                  <button className="text-[11px] font-mono uppercase tracking-widest text-navy/60 hover:text-navy">Compare</button>
                </div>
              </li>
            ))}
          </ul>
        </PortalCard>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/patient/messages" className="w-full sm:w-auto"><BtnGhost className="w-full">Ask about my care plan</BtnGhost></Link>
      </div>
    </div>
  );
}
