import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { PortalPageHeader, PortalCard, StatusPill, Sparkline, Disclaim, BtnPrimary } from "./patient";
import { labs } from "@/data/patient";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/patient/labs/$id")({
  head: ({ params }) => ({ meta: [{ title: `Lab ${params.id} — Patient Portal` }, { name: "robots", content: "noindex" }] }),
  component: LabDetail,
  notFoundComponent: () => (
    <div className="py-16 text-center">
      <h1 className="font-serif text-3xl text-navy">Lab result unavailable</h1>
      <Link to="/patient/labs" className="inline-block mt-6"><BtnPrimary>Back to Labs</BtnPrimary></Link>
    </div>
  ),
});

function LabDetail() {
  const { id } = useParams({ from: "/patient/labs/$id" });
  const lab = labs.find((l) => l.id === id);
  if (!lab) throw notFound();

  return (
    <div>
      <Link to="/patient/labs" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-navy/50 hover:text-navy mb-4"><ArrowLeft size={12} /> All labs</Link>

      <PortalPageHeader
        eyebrow={`${lab.category} · ${lab.lab}`}
        title={lab.panel}
        lede={`Collected ${new Date(lab.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
        actions={<StatusPill tone={lab.reviewStatus === "Reviewed" ? "success" : "warn"}>{lab.reviewStatus}</StatusPill>}
      />

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="space-y-5">
          <PortalCard title="Biomarkers" meta={`${lab.results.length} results`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-[10px] font-mono uppercase tracking-widest text-navy/50 border-b border-navy/10">
                  <tr><th className="py-2 pr-4">Test</th><th className="pr-4">Result</th><th className="pr-4">Reference range</th><th className="pr-4">Previous</th><th>Status</th></tr>
                </thead>
                <tbody className="divide-y divide-navy/8">
                  {lab.results.map((r) => (
                    <tr key={r.name}>
                      <td className="py-3 pr-4 text-navy">{r.name}</td>
                      <td className="pr-4 text-navy font-serif text-lg">{r.value} <span className="text-[11px] text-navy/40 font-sans">{r.unit}</span></td>
                      <td className="pr-4 text-navy/60">{r.range}</td>
                      <td className="pr-4 text-navy/60">{r.prev} {r.unit}</td>
                      <td><StatusPill tone={r.status === "Within Reference Range" ? "success" : "warn"}>{r.status.split(" ")[0]}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PortalCard>

          <PortalCard title="Trend · illustrative">
            <div className="text-academic h-24"><Sparkline data={[132, 128, 122, 118, 115, 112, 110]} className="h-24" /></div>
            <div className="mt-2 text-[11px] font-mono uppercase tracking-widest text-navy/50">Trend improving over 6 months</div>
          </PortalCard>

          {lab.physicianComment && (
            <PortalCard title="Physician comment" meta="Dr. Jason Chen">
              <p className="text-sm text-navy/75 leading-relaxed">Your trend is moving in the right direction. Let's discuss ApoB and hs-CRP at our next visit and consider small adjustments to the lipid strategy in your care plan.</p>
            </PortalCard>
          )}

          <Disclaim>Laboratory results should be interpreted together with your medical history, symptoms and clinical evaluation. Please do not adjust treatment based on results alone.</Disclaim>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24 h-fit">
          <PortalCard title="Next action">
            <p className="text-sm text-navy/70">Review at your <Link to="/patient/appointments" className="text-gold hover:text-navy underline underline-offset-2">upcoming follow-up</Link> on Jul 24.</p>
          </PortalCard>
          <PortalCard title="Related">
            <ul className="text-sm space-y-2">
              <li><Link to="/patient/care-plan" className="text-navy hover:text-gold">View related care plan</Link></li>
              <li><Link to="/patient/education" className="text-navy hover:text-gold">Understanding your metabolic panel</Link></li>
              <li><Link to="/patient/documents" className="text-navy hover:text-gold">Download report (demo)</Link></li>
            </ul>
          </PortalCard>
        </aside>
      </div>
    </div>
  );
}
