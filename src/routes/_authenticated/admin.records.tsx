import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Btn, Chip, Badge } from "@/components/admin/primitives";
import { documents, patients } from "@/data/admin";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/records")({
  head: () => ({ meta: [{ title: "Health Records — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Records,
});

function Records() {
  const [cat, setCat] = useState("All");
  const cats = ["All", "Vitals", "Conditions", "Medications", "Allergies", "Family History", "Immunizations", "Documents"];
  return (
    <div>
      <PageHeader
        eyebrow="Clinical"
        title="Health records"
        description="Longitudinal patient records — vitals, medications, conditions, allergies, and clinical documents."
        actions={<Btn>New entry</Btn>}
      />
      <div className="flex flex-wrap gap-2 mb-4">{cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Latest vitals" className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Blood pressure", "118 / 76", "Aug 12"],
              ["Resting HR", "62 bpm", "Aug 12"],
              ["HRV", "58 ms", "Aug 12"],
              ["Weight", "154 lb", "Aug 12"],
              ["BMI", "22.4", "Aug 12"],
              ["Waist", "31 in", "Aug 12"],
              ["Body fat", "18.2%", "Aug 12"],
              ["SpO₂", "98%", "Aug 12"],
            ].map(([k, v, d]) => (
              <div key={k} className="border border-navy/10 p-3">
                <div className="eyebrow text-navy/45">{k}</div>
                <div className="font-serif text-2xl text-navy mt-1">{v}</div>
                <div className="text-[10px] uppercase tracking-widest text-navy/40 mt-1">{d}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Active conditions">
          <ul className="text-sm divide-y divide-navy/10 -m-4">
            {[
              ["Prediabetes", "ICD-10 R73.03", "Active"],
              ["Hypothyroidism", "ICD-10 E03.9", "Managed"],
              ["Vitamin D deficiency", "ICD-10 E55.9", "Resolved"],
            ].map(([n, c, s], i) => (
              <li key={i} className="px-4 py-3">
                <div className="flex justify-between"><span className="text-navy">{n}</span><Badge tone={s === "Active" ? "Follow-Up" : s === "Managed" ? "Active" : "Completed"}>{s}</Badge></div>
                <div className="text-xs text-navy/50 mt-0.5">{c}</div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Medications">
          <ul className="text-sm divide-y divide-navy/10 -m-4">
            {[["Levothyroxine 50 mcg", "Once daily · morning"], ["Metformin 500 mg", "Twice daily · with meals"], ["Vitamin D3 5000 IU", "Once daily"]].map(([n, d], i) => (
              <li key={i} className="px-4 py-3"><div className="text-navy">{n}</div><div className="text-xs text-navy/50">{d}</div></li>
            ))}
          </ul>
        </Panel>

        <Panel title="Allergies">
          <ul className="text-sm divide-y divide-navy/10 -m-4">
            <li className="px-4 py-3"><div className="text-navy">Penicillin</div><div className="text-xs text-navy/50">Rash · moderate</div></li>
            <li className="px-4 py-3"><div className="text-navy">Shellfish</div><div className="text-xs text-navy/50">Anaphylaxis · severe</div></li>
          </ul>
        </Panel>

        <Panel title="Documents on file">
          <ul className="text-sm divide-y divide-navy/10 -m-4">
            {documents.map((d) => (
              <li key={d.id} className="px-4 py-3"><div className="text-navy truncate">{d.name}</div><div className="text-xs text-navy/50">{d.cat} · {d.date} · {d.version}</div></li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
