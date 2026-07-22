import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatCard, Btn, Badge } from "@/components/admin/primitives";
import { patients, labs, carePlans } from "@/data/admin";

export const Route = createFileRoute("/_authenticated/admin/clinical")({
  head: () => ({ meta: [{ title: "Clinical — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Clinical,
});

function Clinical() {
  return (
    <div>
      <PageHeader
        eyebrow="Clinical"
        title="Clinical workspace"
        description="Notes, orders and clinical activity across all active patients."
        actions={<Btn>New clinical note</Btn>}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pending notes" value="4" tone="gold" />
        <StatCard label="Signed today" value="7" tone="teal" />
        <StatCard label="Open orders" value="3" />
        <StatCard label="Pending Rx" value="3" tone="gold" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Recent clinical notes" className="lg:col-span-2">
          <ul className="divide-y divide-navy/10 -m-4">
            {patients.slice(0, 6).map((p, i) => (
              <li key={p.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3">
                <div>
                  <div className="text-sm text-navy">{["Longevity consult", "Metabolic follow-up", "Care plan review", "Lab review", "Preventive review", "Initial consultation"][i]}</div>
                  <div className="text-xs text-navy/50">{p.name} · Aug {12 - i}, 2026 · {i % 2 === 0 ? "Telehealth" : "In-person"}</div>
                </div>
                <Badge tone={i < 2 ? "Draft" : "Approved"}>{i < 2 ? "Draft" : "Signed"}</Badge>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Active protocols">
          <ul className="text-sm divide-y divide-navy/10 -m-4">
            {carePlans.map((c) => (
              <li key={c.id} className="px-4 py-3">
                <div className="text-navy">{c.name}</div>
                <div className="text-xs text-navy/50">{c.patient}</div>
                <div className="h-1 bg-mist mt-2"><div className="h-full bg-teal" style={{ width: `${c.progress}%` }} /></div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent labs" className="lg:col-span-3">
          <ul className="divide-y divide-navy/10 -m-4">
            {labs.map((l) => (
              <li key={l.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3">
                <div><div className="text-sm text-navy">{l.test}</div><div className="text-xs text-navy/50">{l.patient} · {l.lab} · {l.date}</div></div>
                {l.flag && <span className="text-[10px] uppercase tracking-widest text-gold">Flag</span>}
                <Badge tone={l.status}>{l.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
