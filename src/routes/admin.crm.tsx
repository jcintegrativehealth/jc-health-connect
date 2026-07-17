import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Badge } from "@/components/admin/primitives";
import { leads } from "@/data/admin";

export const Route = createFileRoute("/admin/crm")({
  head: () => ({ meta: [{ title: "CRM — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: CRM,
});

const stages = ["New Inquiry", "Contacted", "Consultation Requested", "Appointment Scheduled", "Became Patient", "Follow-Up Later"];

function CRM() {
  return (
    <div>
      <PageHeader eyebrow="Relations" title="Patient CRM" description="Track prospective patients from first inquiry through onboarding." actions={<Btn>New lead</Btn>} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stages.map((s) => {
          const items = leads.filter((l) => l.stage === s);
          return (
            <Panel key={s} title={`${s} · ${items.length}`}>
              <ul className="space-y-2 -m-1">
                {items.length === 0 && <li className="text-xs text-navy/45 text-center py-6">No leads in this stage.</li>}
                {items.map((l, i) => (
                  <li key={i} className="border border-navy/10 p-3 hover:border-navy/30">
                    <div className="flex justify-between">
                      <div className="text-sm text-navy">{l.name}</div>
                      <span className={`text-[10px] uppercase tracking-widest ${l.priority === "High" ? "text-gold" : l.priority === "Medium" ? "text-navy/70" : "text-navy/40"}`}>{l.priority}</span>
                    </div>
                    <div className="text-xs text-navy/55 mt-0.5">{l.inquiry} · {l.state} · {l.lang}</div>
                    <div className="text-[10px] uppercase tracking-widest text-navy/40 mt-1.5">Source · {l.source}</div>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
