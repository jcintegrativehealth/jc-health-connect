import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, StatCard, Badge, Btn } from "@/components/admin/primitives";
import { patients, appointments, labs, carePlans, messages, invoices, activity } from "@/data/admin";
import { Calendar, MessageSquare, FileText, DollarSign } from "lucide-react";

export const Route = createFileRoute("/admin/patients/$id")({
  loader: ({ params }) => {
    const p = patients.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { patient: p };
  },
  head: ({ loaderData }) => loaderData
    ? { meta: [{ title: `${loaderData.patient.name} — JC Admin` }, { name: "robots", content: "noindex" }] }
    : { meta: [{ title: "Patient — JC Admin" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: NotFound,
  component: PatientProfile,
});

function NotFound() {
  return (
    <div className="text-center py-24">
      <div className="eyebrow text-gold">404</div>
      <h1 className="font-serif text-3xl text-navy mt-2">Patient not found</h1>
      <p className="text-navy/60 mt-2">This ID does not exist in the demo dataset.</p>
      <div className="mt-6"><Link to="/admin/patients" className="text-xs uppercase tracking-widest text-navy/70 hover:text-navy">← Back to patients</Link></div>
    </div>
  );
}

const TABS = ["Overview", "Appointments", "Clinical Notes", "Health Records", "Lab Results", "Care Plans", "Medications", "Documents", "Messages", "Billing", "Tasks", "Activity"];

function PatientProfile() {
  const { patient } = Route.useLoaderData();
  const [tab, setTab] = useState("Overview");
  const pAppointments = appointments.filter((a) => a.patient === patient.name);
  const pLabs = labs.filter((l) => l.patient === patient.name);
  const pPlan = carePlans.find((c) => c.patient === patient.name);
  const pMsgs = messages.filter((m) => m.patient === patient.name);
  const pInv = invoices.filter((i) => i.patient === patient.name);

  return (
    <div>
      {/* Profile header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6 mb-8">
        <div className="flex items-start gap-5 min-w-0">
          <div className="h-16 w-16 rounded-full border border-navy/20 grid place-items-center text-lg font-serif text-navy shrink-0">
            {patient.name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <div className="eyebrow text-gold mb-1">Patient · <span className="font-mono">{patient.id}</span></div>
            <h1 className="font-serif text-3xl md:text-4xl text-navy leading-tight truncate">{patient.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy/60 mt-2">
              <span>Age {patient.age}</span>
              <span>{patient.state}</span>
              <span>{patient.lang}</span>
              <span>{patient.service}</span>
              <Badge tone={patient.status}>{patient.status}</Badge>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Btn variant="outline" size="sm"><MessageSquare size={12} /> Message</Btn>
          <Btn variant="outline" size="sm"><Calendar size={12} /> Schedule</Btn>
          <Btn size="sm">Open visit</Btn>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active conditions" value="2" sub="Prediabetes · Hypothyroid" />
        <StatCard label="Current medications" value="3" sub="+ 4 supplements" />
        <StatCard label="Recent labs" value={pLabs.length} sub={pLabs.some((l) => l.flag) ? "1 flagged" : "All within range"} tone={pLabs.some((l) => l.flag) ? "gold" : "teal"} />
        <StatCard label="Open balance" value={`$${patient.balance}`} sub={patient.balance > 0 ? "Send reminder" : "No open balance"} tone={patient.balance > 0 ? "gold" : "teal"} />
      </div>

      {/* Tabs */}
      <div className="border-b border-navy/10 mb-6 flex flex-wrap gap-x-2 -mx-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-xs uppercase tracking-widest transition-colors ${tab === t ? "text-navy border-b-2 border-gold -mb-px" : "text-navy/50 hover:text-navy"}`}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "Overview" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <Panel title="Contact" className="lg:col-span-1">
            <ul className="text-sm divide-y divide-navy/10 -m-4">
              <li className="flex justify-between px-4 py-3"><span className="text-navy/50">Email</span><span className="text-navy">{patient.name.split(" ")[0].toLowerCase()}@example.com</span></li>
              <li className="flex justify-between px-4 py-3"><span className="text-navy/50">Phone</span><span className="text-navy">+1 555 010 {patient.id.slice(-4)}</span></li>
              <li className="flex justify-between px-4 py-3"><span className="text-navy/50">State</span><span className="text-navy">{patient.state}</span></li>
              <li className="flex justify-between px-4 py-3"><span className="text-navy/50">Language</span><span className="text-navy">{patient.lang}</span></li>
              <li className="flex justify-between px-4 py-3"><span className="text-navy/50">Emergency</span><span className="text-navy">Family contact on file</span></li>
            </ul>
          </Panel>
          <Panel title="Care plan" className="lg:col-span-2">
            {pPlan ? (
              <>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="font-serif text-xl text-navy">{pPlan.name}</div>
                    <div className="text-xs text-navy/55 mt-0.5">Primary goal · {pPlan.goal}</div>
                  </div>
                  <Badge tone={pPlan.status}>{pPlan.status}</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-navy/45 mb-2"><span>Progress</span><span>{pPlan.progress}%</span></div>
                  <div className="h-1 bg-mist"><div className="h-full bg-teal" style={{ width: `${pPlan.progress}%` }} /></div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6 text-xs">
                  <div><div className="eyebrow text-navy/45">Start</div><div className="text-navy mt-1">{pPlan.start}</div></div>
                  <div><div className="eyebrow text-navy/45">Review</div><div className="text-navy mt-1">{pPlan.review}</div></div>
                  <div><div className="eyebrow text-navy/45">Next action</div><div className="text-navy mt-1">Schedule follow-up labs</div></div>
                </div>
              </>
            ) : <div className="text-sm text-navy/50">No care plan yet.</div>}
          </Panel>

          <Panel title="Timeline" className="lg:col-span-3">
            <ul className="space-y-4 -m-1">
              {activity.map((a, i) => (
                <li key={i} className="grid grid-cols-[80px_1fr] gap-4 items-start">
                  <span className="text-[11px] uppercase tracking-widest text-navy/45 pt-0.5">{a.time}</span>
                  <div className="border-l border-navy/10 pl-4 pb-1">
                    <div className="text-sm text-navy">{a.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {tab === "Appointments" && (
        <Panel>
          <ul className="divide-y divide-navy/10 -m-4">
            {pAppointments.length === 0 && <li className="p-8 text-center text-sm text-navy/50">No appointments yet.</li>}
            {pAppointments.map((a) => (
              <li key={a.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 px-4 py-3">
                <div className="font-mono text-sm text-navy">{a.time}</div>
                <div><div className="text-sm text-navy">{a.type}</div><div className="text-xs text-navy/50">{a.format} · {a.state} · {a.lang}</div></div>
                <Badge tone={a.status}>{a.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {tab === "Lab Results" && (
        <Panel>
          <ul className="divide-y divide-navy/10 -m-4">
            {pLabs.length === 0 && <li className="p-8 text-center text-sm text-navy/50">No lab results yet.</li>}
            {pLabs.map((l) => (
              <li key={l.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3">
                <div><div className="text-sm text-navy">{l.test}</div><div className="text-xs text-navy/50">{l.lab} · {l.date} · {l.cat}</div></div>
                {l.flag && <span className="text-[10px] uppercase tracking-widest text-gold">Flag</span>}
                <Badge tone={l.status}>{l.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {tab === "Messages" && (
        <Panel>
          <ul className="divide-y divide-navy/10 -m-4">
            {pMsgs.length === 0 && <li className="p-8 text-center text-sm text-navy/50">No messages yet.</li>}
            {pMsgs.map((m) => (
              <li key={m.id} className="px-4 py-3">
                <div className="flex justify-between text-xs"><span className="text-navy">{m.from}</span><span className="text-navy/45">{m.date}</span></div>
                <div className="text-sm text-navy mt-1">{m.subject}</div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {tab === "Billing" && (
        <Panel>
          <ul className="divide-y divide-navy/10 -m-4">
            {pInv.length === 0 && <li className="p-8 text-center text-sm text-navy/50">No invoices yet.</li>}
            {pInv.map((i) => (
              <li key={i.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-4 py-3">
                <div><div className="text-sm text-navy font-mono">{i.id}</div><div className="text-xs text-navy/50">{i.service} · Due {i.due}</div></div>
                <div className="text-sm text-navy">${i.balance} / ${i.amount}</div>
                <Badge tone={i.status}>{i.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {["Clinical Notes", "Health Records", "Care Plans", "Medications", "Documents", "Tasks", "Activity"].includes(tab) && (
        <Panel>
          <div className="p-8 text-center">
            <div className="mx-auto h-10 w-10 border border-navy/15 grid place-items-center text-navy/40 mb-4"><FileText size={16} strokeWidth={1.5} /></div>
            <div className="font-serif text-lg text-navy">{tab}</div>
            <p className="text-sm text-navy/55 mt-2 max-w-sm mx-auto">Section prepared for future backend integration. Records, versioning and PDF export will wire up once persistence is enabled.</p>
            <div className="mt-5 flex flex-col-reverse sm:flex-row justify-center gap-2"><Btn variant="outline" size="sm">Add record</Btn><Btn size="sm"><DollarSign size={12} /> Configure</Btn></div>
          </div>
        </Panel>
      )}
    </div>
  );
}
