import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn } from "@/components/admin/primitives";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Reports,
});

const reports = [
  { title: "Monthly clinical summary", desc: "Appointments, new patients, notes, prescriptions.", period: "Month" },
  { title: "Financial statement", desc: "Revenue, collected, outstanding, refunds by service.", period: "Month" },
  { title: "Patient outcomes", desc: "Goals achieved, biomarker improvements, plan progress.", period: "Quarter" },
  { title: "Operational efficiency", desc: "Fill rate, no-shows, average visit duration.", period: "Month" },
  { title: "Content performance", desc: "Research, insights, reactions, comments.", period: "Month" },
  { title: "HIPAA access log", desc: "PHI access, exports, admin activity.", period: "Custom" },
];

function Reports() {
  return (
    <div>
      <PageHeader eyebrow="Operations" title="Reports" description="Generate, schedule and export operational and clinical reports." actions={<Btn>Custom report</Btn>} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Panel key={r.title}>
            <FileText size={16} strokeWidth={1.5} className="text-navy/60" />
            <div className="mt-3 font-serif text-lg text-navy">{r.title}</div>
            <p className="text-sm text-navy/60 mt-1.5">{r.desc}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-navy/45">Period · {r.period}</span>
              <div className="flex gap-2">
                <Btn variant="outline" size="sm">Generate</Btn>
                <Btn variant="ghost" size="sm">Schedule</Btn>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
