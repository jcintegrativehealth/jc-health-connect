import { createFileRoute } from "@tanstack/react-router";
import { PortalPageHeader, PortalCard, BtnGhost } from "./patient";
import { programs } from "@/data/patient";

export const Route = createFileRoute("/_authenticated/patient/programs")({
  head: () => ({ meta: [{ title: "Health Programs — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <div>
      <PortalPageHeader eyebrow="Care" title="Health programs" lede="Structured programs designed around specific goals and health priorities." />

      <div className="grid md:grid-cols-2 gap-5">
        {programs.map((p) => (
          <div key={p.slug} className="bg-card border border-navy/10 rounded-sm p-6">
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-serif text-2xl text-navy">{p.name}</div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold">{p.phase}</span>
            </div>
            <p className="text-sm text-navy/70 mt-2">{p.goal}</p>

            <dl className="grid grid-cols-2 gap-y-2 mt-4 text-[12px]">
              <dt className="text-navy/50">Duration</dt><dd className="text-navy">{p.duration}</dd>
              <dt className="text-navy/50">Started</dt><dd className="text-navy">{p.start}</dd>
              <dt className="text-navy/50">Next action</dt><dd className="text-navy">{p.next}</dd>
            </dl>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-navy/50 mb-1">
                <span>Progress</span><span>{p.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-mist rounded-full overflow-hidden"><div className="h-full bg-teal" style={{ width: `${p.progress}%` }} /></div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <BtnGhost>View program</BtnGhost>
              <BtnGhost>Care plan</BtnGhost>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <PortalCard title="Included resources">
          <ul className="text-sm text-navy/70 space-y-1.5">
            <li>· Educational library</li>
            <li>· Direct care team messaging</li>
            <li>· Quarterly biomarker review</li>
          </ul>
        </PortalCard>
        <PortalCard title="Milestones">
          <ol className="relative border-l border-navy/10 pl-4 space-y-2 text-sm">
            <li className="text-navy/70"><span className="absolute -left-[6px] top-1.5 h-2 w-2 rounded-full bg-teal" />Foundation established</li>
            <li className="text-navy/70"><span className="absolute -left-[6px] top-1.5 h-2 w-2 rounded-full bg-gold" />Stabilization phase</li>
            <li className="text-navy/40"><span className="absolute -left-[6px] top-1.5 h-2 w-2 rounded-full bg-mist border border-navy/20" />Optimization phase</li>
          </ol>
        </PortalCard>
        <PortalCard title="Progress">
          <p className="text-sm text-navy/70">Overall progress is reviewed with Dr. Chen at each visit and reflected in your care plan.</p>
        </PortalCard>
      </div>
    </div>
  );
}
