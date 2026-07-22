import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, StatusPill, Disclaim, BtnGhost } from "./patient";
import { medications, supplements } from "@/data/patient";

export const Route = createFileRoute("/_authenticated/patient/medications")({
  head: () => ({ meta: [{ title: "Medications — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: MedsPage,
});

const TABS = ["Medications", "Supplements", "History", "Refill Requests"] as const;

function MedsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Medications");

  return (
    <div>
      <PortalPageHeader eyebrow="Care" title="Medications & supplements" lede="Your current prescriptions and physician-recommended supplements." />

      <div className="flex flex-wrap gap-1 border-b border-navy/10 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest border-b-2 -mb-px ${tab === t ? "border-gold text-navy" : "border-transparent text-navy/50 hover:text-navy"}`}>{t}</button>
        ))}
      </div>

      {tab === "Medications" && (
        <div className="grid md:grid-cols-2 gap-4">
          {medications.map((m) => (
            <div key={m.name} className="bg-card border border-navy/10 rounded-sm p-5">
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <div className="font-serif text-xl text-navy">{m.name}</div>
                <StatusPill tone="success">{m.status}</StatusPill>
              </div>
              <div className="text-sm text-navy/70">{m.dose} · {m.freq}</div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50 mt-1">{m.time}</div>
              <dl className="grid grid-cols-2 gap-y-2 mt-4 text-[12px]">
                <dt className="text-navy/50">Prescribed by</dt><dd className="text-navy">{m.prescribed}</dd>
                <dt className="text-navy/50">Start date</dt><dd className="text-navy">{m.start}</dd>
                <dt className="text-navy/50">Refill</dt><dd className="text-navy">{m.refill}</dd>
                <dt className="text-navy/50">Condition</dt><dd className="text-navy">{m.condition}</dd>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <BtnGhost className="!py-2" onClick={() => toast.success("Refill request sent (demo)")}>Request refill</BtnGhost>
                <BtnGhost className="!py-2" onClick={() => toast("Question sent to care team (demo)")}>Ask a question</BtnGhost>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Supplements" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supplements.map((s) => (
            <div key={s.name} className="bg-card border border-navy/10 rounded-sm p-5">
              <div className="font-serif text-lg text-navy">{s.name}</div>
              <div className="text-sm text-navy/70 mt-1">{s.dose} · {s.freq}</div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50 mt-1">{s.time}</div>
              <div className="mt-3 text-sm text-navy/75">Purpose: <span className="text-navy">{s.purpose}</span></div>
              <div className="mt-3"><StatusPill tone="success">{s.status}</StatusPill></div>
            </div>
          ))}
        </div>
      )}

      {tab === "History" && (
        <PortalCard title="Historical medications">
          <ul className="divide-y divide-navy/10 text-sm">
            <li className="py-3 flex justify-between"><span>Vitamin D3 5000 IU (loading dose)</span><span className="text-navy/50 font-mono text-[11px] uppercase tracking-widest">Feb 2025 – Jan 2026</span></li>
          </ul>
        </PortalCard>
      )}

      {tab === "Refill Requests" && (
        <PortalCard title="Refill requests">
          <div className="py-8 text-center text-sm text-navy/55">No pending refill requests.</div>
        </PortalCard>
      )}

      <div className="mt-6"><Disclaim>Do not stop or change medications or supplements without guidance from your healthcare professional. For severe reactions or emergencies, call 911.</Disclaim></div>
    </div>
  );
}
