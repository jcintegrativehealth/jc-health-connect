import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Badge } from "@/components/admin/primitives";
import { carePlans } from "@/data/admin";

export const Route = createFileRoute("/_authenticated/admin/care-plans")({
  head: () => ({ meta: [{ title: "Care Plans — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: CarePlans,
});

function CarePlans() {
  return (
    <div>
      <PageHeader
        eyebrow="Clinical"
        title="Care plans"
        description="Longitudinal plans with goals, protocols, and review milestones."
        actions={<Btn>New care plan</Btn>}
      />
      <div className="grid md:grid-cols-2 gap-4">
        {carePlans.map((c) => (
          <Panel key={c.id} title={c.name} action={<Badge tone={c.status}>{c.status}</Badge>}>
            <div className="text-sm text-navy">{c.patient}</div>
            <div className="text-xs text-navy/55 mt-0.5">Primary goal · {c.goal}</div>
            <div className="mt-4">
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-navy/45 mb-1.5"><span>Progress</span><span>{c.progress}%</span></div>
              <div className="h-1 bg-mist"><div className="h-full bg-teal" style={{ width: `${c.progress}%` }} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5 text-xs">
              <div><div className="eyebrow text-navy/45">Start</div><div className="text-navy mt-1">{c.start}</div></div>
              <div><div className="eyebrow text-navy/45">Next review</div><div className="text-navy mt-1">{c.review}</div></div>
              <div><div className="eyebrow text-navy/45">Ref</div><div className="text-navy mt-1 font-mono">{c.id}</div></div>
            </div>
            <div className="mt-4 flex gap-2"><Btn variant="outline" size="sm">Open plan</Btn><Btn size="sm">Add follow-up</Btn></div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
