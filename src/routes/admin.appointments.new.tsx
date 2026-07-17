import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Btn, Panel } from "@/components/admin/primitives";
import { patients, services } from "@/data/admin";

export const Route = createFileRoute("/admin/appointments/new")({
  head: () => ({ meta: [{ title: "New appointment — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: NewAppointment,
});

const STEPS = ["Patient", "Visit type", "Service", "Format", "State & language", "Date & time", "Duration", "Notes", "Payment", "Review"];

function NewAppointment() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    patient: "", visitType: "Follow-up", service: "Longevity", format: "Telehealth",
    state: "California", language: "English", date: "", time: "", duration: "30", notes: "", pay: "Card on file",
  });

  const set = (k: keyof typeof data, v: string) => setData((d) => ({ ...d, [k]: v }));

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Schedule appointment"
        description="Create a new visit — the flow mirrors the public booking experience."
        crumbs={[{ label: "Appointments", to: "/admin/appointments" }, { label: "Schedule" }]}
      />

      {/* Stepper */}
      <ol className="mb-6 flex flex-wrap gap-1 text-[10px] uppercase tracking-widest">
        {STEPS.map((s, i) => (
          <li key={s} className={`px-3 h-8 flex items-center border ${i === step ? "border-navy text-navy" : i < step ? "border-teal text-teal" : "border-navy/15 text-navy/40"}`}>
            <span className="mr-2 font-mono">0{i + 1}</span>{s}
          </li>
        ))}
      </ol>

      <Panel>
        {step === 0 && (
          <div>
            <div className="eyebrow text-navy/50 mb-3">Select patient</div>
            <div className="grid md:grid-cols-2 gap-2 max-h-80 overflow-y-auto">
              {patients.map((p) => (
                <button key={p.id} onClick={() => { set("patient", p.name); setStep(1); }} className={`text-left border p-3 hover:border-navy/40 ${data.patient === p.name ? "border-navy" : "border-navy/15"}`}>
                  <div className="text-sm text-navy">{p.name}</div>
                  <div className="text-xs text-navy/50 font-mono">{p.id} · {p.state} · {p.lang}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <StepChoice title="Visit type" value={data.visitType} setValue={(v) => set("visitType", v)}
            options={["Initial consultation", "Follow-up", "Longevity consult", "Metabolic follow-up", "Care plan review", "Lab review", "Preventive review"]} />
        )}
        {step === 2 && <StepChoice title="Service" value={data.service} setValue={(v) => set("service", v)} options={services} />}
        {step === 3 && <StepChoice title="Format" value={data.format} setValue={(v) => set("format", v)} options={["Telehealth", "In-person"]} />}

        {step === 4 && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-navy/55">State</span>
              <select value={data.state} onChange={(e) => set("state", e.target.value)} className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                {["California", "New York", "Texas", "Florida", "Washington"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-navy/55">Language</span>
              <select value={data.language} onChange={(e) => set("language", e.target.value)} className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                {["English", "Spanish", "Portuguese", "Mandarin"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
        )}

        {step === 5 && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-navy/55">Date</span>
              <input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" />
            </label>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-navy/55 mb-1.5">Time slot</div>
              <div className="grid grid-cols-4 gap-1.5">
                {["08:30", "09:15", "10:00", "10:45", "11:30", "13:00", "13:45", "14:30", "15:15", "16:00", "16:45", "17:30"].map((t) => (
                  <button key={t} onClick={() => set("time", t)} className={`h-9 text-xs font-mono border ${data.time === t ? "border-navy text-navy" : "border-navy/15 text-navy/55 hover:border-navy/40"}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <StepChoice title="Duration" value={data.duration} setValue={(v) => set("duration", v)} options={["30", "45", "60", "75", "90"]} suffix=" min" />
        )}

        {step === 7 && (
          <label className="block">
            <span className="text-[11px] uppercase tracking-widest text-navy/55">Internal notes</span>
            <textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} rows={5} placeholder="Chief concern, agenda, follow-up items…" className="mt-1.5 w-full border border-navy/15 bg-card p-3 text-sm outline-none focus:border-teal" />
          </label>
        )}

        {step === 8 && (
          <StepChoice title="Payment" value={data.pay} setValue={(v) => set("pay", v)} options={["Card on file", "Send invoice", "Bill later", "Pre-paid package"]} />
        )}

        {step === 9 && (
          <div>
            <div className="eyebrow text-teal mb-2">Review & confirm</div>
            <ul className="grid md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
              {Object.entries(data).map(([k, v]) => (
                <li key={k} className="flex justify-between border-b border-navy/10 py-2"><span className="text-navy/50 capitalize">{k}</span><span className="text-navy">{v || "—"}</span></li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-2">
        <Btn variant="outline" onClick={() => (step === 0 ? nav({ to: "/admin/appointments" }) : setStep(step - 1))}>{step === 0 ? "Cancel" : "Back"}</Btn>
        {step < STEPS.length - 1
          ? <Btn onClick={() => setStep(step + 1)}>Continue</Btn>
          : <Btn onClick={() => nav({ to: "/admin/appointments" })}>Confirm appointment</Btn>}
      </div>
    </div>
  );
}

function StepChoice({ title, value, setValue, options, suffix = "" }: { title: string; value: string; setValue: (v: string) => void; options: string[]; suffix?: string }) {
  return (
    <div>
      <div className="eyebrow text-navy/50 mb-3">{title}</div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((o) => (
          <button key={o} onClick={() => setValue(o)} className={`text-left border p-3 hover:border-navy/40 ${value === o ? "border-navy" : "border-navy/15"}`}>
            <div className="text-sm text-navy">{o}{suffix}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
