import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalPageHeader, PortalCard, StatusPill, Disclaim, Sparkline } from "./patient";
import { conditions, allergies, medications, vitals, healthJourney } from "@/data/patient";

export const Route = createFileRoute("/_authenticated/patient/health/")({
  head: () => ({ meta: [{ title: "My Health — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: HealthPage,
});

const SUB = [
  { label: "Summary", to: "/patient/health" as const },
  { label: "Vitals", to: "/patient/health/vitals" as const },
];

function HealthPage() {
  return (
    <div>
      <PortalPageHeader eyebrow="My Health" title="Health summary" lede="A high-level view of your active care record." />

      <div className="flex gap-1 border-b border-navy/10 mb-6 overflow-x-auto">
        {SUB.map((s, i) => (
          <Link key={s.to} to={s.to} className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest whitespace-nowrap border-b-2 -mb-px ${i === 0 ? "border-gold text-navy" : "border-transparent text-navy/50 hover:text-navy"}`}>{s.label}</Link>
        ))}
        {["Conditions", "Medications", "Supplements", "Allergies", "Vitals", "Biometrics", "Lifestyle", "Goals", "Timeline"].slice(2).map((s) => (
          <span key={s} className="px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-navy/30 whitespace-nowrap">{s}</span>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <PortalCard title="Active conditions" meta={`${conditions.filter(c => c.status !== "Resolved").length} active`}>
          <ul className="divide-y divide-navy/10 text-sm">
            {conditions.map((c) => (
              <li key={c.name} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-navy">{c.name}</div>
                  <div className="text-[11px] text-navy/50 font-mono uppercase tracking-widest">Added {c.added} · reviewed {c.reviewed}</div>
                </div>
                <StatusPill tone={c.status === "Active" ? "warn" : c.status === "Monitoring" ? "info" : "success"}>{c.status}</StatusPill>
              </li>
            ))}
          </ul>
        </PortalCard>

        <PortalCard title="Allergies">
          <ul className="divide-y divide-navy/10 text-sm">
            {allergies.map((a) => (
              <li key={a.allergen} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-navy">{a.allergen}</div>
                  <div className="text-[11px] text-navy/50">{a.reaction} · {a.severity} · {a.date}</div>
                </div>
                <StatusPill tone={a.severity === "Moderate" ? "warn" : "info"}>{a.severity}</StatusPill>
              </li>
            ))}
          </ul>
        </PortalCard>

        <PortalCard title="Current medications">
          <ul className="divide-y divide-navy/10 text-sm">
            {medications.map((m) => (
              <li key={m.name} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-navy">{m.name}</div>
                  <div className="text-[11px] text-navy/50">{m.dose} · {m.freq}</div>
                </div>
                <StatusPill tone="success">{m.status}</StatusPill>
              </li>
            ))}
          </ul>
          <Link to="/patient/medications" className="block mt-3 text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy">View all medications →</Link>
        </PortalCard>

        <PortalCard title="Recent vitals" action={<Link to="/patient/health/vitals" className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy">View all →</Link>}>
          <div className="grid grid-cols-2 gap-3">
            {vitals.slice(0, 4).map((v) => (
              <div key={v.key} className="border border-navy/8 rounded-sm p-3">
                <div className="eyebrow text-navy/50 text-[10px]">{v.label}</div>
                <div className="mt-1 font-serif text-xl text-navy">{v.value}</div>
                <div className="text-academic mt-1"><Sparkline data={v.trend} /></div>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCard title="Primary health goals" className="md:col-span-2">
          <ul className="grid sm:grid-cols-2 gap-3">
            {["Improve insulin sensitivity", "Sleep 7.5h consistently", "Zone 2 cardio 3× / week", "Reduce hs-CRP below 1.0"].map((g) => (
              <li key={g} className="border border-navy/8 rounded-sm p-3 text-sm text-navy/80">{g}</li>
            ))}
          </ul>
        </PortalCard>

        <PortalCard title="Recent health activity" className="md:col-span-2">
          <ol className="relative border-l border-navy/10 pl-5 space-y-3">
            {healthJourney.map((h, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[22px] top-1 h-2 w-2 rounded-full bg-teal border-2 border-paper" />
                <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50">{h.date} · {h.type}</div>
                <div className="text-sm text-navy">{h.label}</div>
              </li>
            ))}
          </ol>
        </PortalCard>

        <div className="md:col-span-2"><Disclaim>This information is a summary of your health record and should not be used for emergency decisions.</Disclaim></div>
      </div>
    </div>
  );
}
