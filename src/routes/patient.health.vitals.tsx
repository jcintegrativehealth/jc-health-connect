import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PortalPageHeader, PortalCard, StatusPill, Sparkline, Disclaim, BtnGhost } from "./patient";
import { vitals } from "@/data/patient";

export const Route = createFileRoute("/patient/health/vitals")({
  head: () => ({ meta: [{ title: "Vitals — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: VitalsPage,
});

function VitalsPage() {
  const [selected, setSelected] = useState(vitals[0].key);
  const active = vitals.find((v) => v.key === selected)!;

  return (
    <div>
      <PortalPageHeader eyebrow="My Health · Vitals" title="Vitals & biometrics" lede="Trends across the last 7 readings. Illustrative data." actions={<BtnGhost>Add reading (demo)</BtnGhost>} />

      <div className="flex gap-1 mb-6 border-b border-navy/10 overflow-x-auto">
        <Link to="/patient/health" className="px-4 py-2.5 text-xs font-mono uppercase tracking-widest text-navy/50 hover:text-navy whitespace-nowrap">Summary</Link>
        <span className="px-4 py-2.5 text-xs font-mono uppercase tracking-widest border-b-2 border-gold text-navy -mb-px whitespace-nowrap">Vitals</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-5">
        <PortalCard title="Metrics">
          <ul className="divide-y divide-navy/10">
            {vitals.map((v) => (
              <li key={v.key}>
                <button onClick={() => setSelected(v.key)} className={`w-full py-3 flex items-center justify-between gap-3 text-left ${selected === v.key ? "text-navy" : "text-navy/75 hover:text-navy"}`}>
                  <div>
                    <div className="text-sm">{v.label}</div>
                    <div className="text-[11px] text-navy/50 font-mono uppercase tracking-widest">{v.status}</div>
                  </div>
                  <div className="font-serif text-lg text-navy">{v.value}</div>
                </button>
              </li>
            ))}
          </ul>
        </PortalCard>

        <div className="space-y-5">
          <PortalCard title={active.label} meta="Last 7 readings" action={<StatusPill tone={active.status.includes("Follow") ? "warn" : "success"}>{active.status}</StatusPill>}>
            <div className="font-serif text-4xl text-navy">{active.value}</div>
            {active.unit && <div className="text-[11px] font-mono uppercase text-navy/40">{active.unit}</div>}
            <div className="text-academic mt-4 h-24"><Sparkline data={active.trend} className="h-24" /></div>
            <table className="w-full mt-6 text-sm">
              <thead className="text-left text-[11px] font-mono uppercase tracking-widest text-navy/50 border-b border-navy/10">
                <tr><th className="py-2">Reading</th><th>Value</th><th>Change</th></tr>
              </thead>
              <tbody className="divide-y divide-navy/8">
                {active.trend.map((v, i) => {
                  const prev = active.trend[i - 1];
                  const delta = prev ? v - prev : 0;
                  return (
                    <tr key={i}>
                      <td className="py-2 text-navy/60">Day {i + 1}</td>
                      <td className="text-navy">{v}</td>
                      <td className={delta === 0 ? "text-navy/40" : delta > 0 ? "text-academic" : "text-teal"}>{delta === 0 ? "—" : delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </PortalCard>

          <Disclaim>Vital signs are one component of your care. Interpret alongside your medical history, symptoms and clinical evaluation.</Disclaim>
        </div>
      </div>
    </div>
  );
}
