import { createFileRoute, Link } from "@tanstack/react-router";
import { services, states, visitTypes } from "@/data/site";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { createAppointment } from "@/lib/appointmentStore";
import { toast } from "sonner";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an Appointment — JC Integrative Health" },
      { name: "description", content: "Schedule an initial or follow-up visit — in-person or via telehealth." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

type FormState = {
  visitType: string;
  mode: "in-person" | "telehealth" | "";
  state: string;
  language: string;
  service: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

const STEPS = ["Visit type", "Format", "State", "Language", "Service", "Date", "Time", "Patient info", "Review", "Confirmation"];
const TIMES = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

function BookPage() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState<FormState>({
    visitType: "", mode: "", state: "", language: "English", service: "", date: "", time: "",
    firstName: "", lastName: "", email: "", phone: "", notes: "",
  });

  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1); return d;
  }), []);

  const canNext = (() => {
    switch (step) {
      case 0: return !!f.visitType;
      case 1: return !!f.mode;
      case 2: return !!f.state;
      case 3: return !!f.language;
      case 4: return !!f.service;
      case 5: return !!f.date;
      case 6: return !!f.time;
      case 7: return !!f.firstName && !!f.email;
      default: return true;
    }
  })();

  return (
    <div>
      <DemoBanner />
      <PageHeader eyebrow="Appointments" title="Book an appointment" lede="A ten-step flow to schedule an in-person or telehealth visit. Demonstration only — no data is stored." />

      <Container className="pb-24">
        <div className="grid lg:grid-cols-[220px_1fr] gap-12 border-t border-navy/10 pt-10">
          <ol className="space-y-1 text-sm">
            {STEPS.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 py-2 ${i === step ? "text-navy font-medium" : "text-navy/40"}`}>
                <span className={`w-6 h-6 grid place-items-center text-[10px] font-mono ${i < step ? "bg-teal text-paper" : i === step ? "bg-navy text-paper" : "bg-mist text-navy/50"}`}>
                  {i < step ? <Check size={12} /> : String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs uppercase tracking-widest">{s}</span>
              </li>
            ))}
          </ol>

          <div className="min-h-[420px]">
            {step === 0 && (
              <StepGrid>
                {visitTypes.map((v) => (
                  <Choice key={v.slug} active={f.visitType === v.slug} onClick={() => setF({ ...f, visitType: v.slug })} title={v.name} sub={v.duration} />
                ))}
              </StepGrid>
            )}
            {step === 1 && (
              <StepGrid cols={2}>
                <Choice active={f.mode === "in-person"} onClick={() => setF({ ...f, mode: "in-person" })} title="In-Person" sub="Colorado and Washington" />
                <Choice active={f.mode === "telehealth"} onClick={() => setF({ ...f, mode: "telehealth" })} title="Telehealth" sub="Available in supported states" />
              </StepGrid>
            )}
            {step === 2 && (
              <StepGrid cols={2}>
                {states.map((s) => (
                  <Choice key={s.slug} active={f.state === s.slug} onClick={() => setF({ ...f, state: s.slug })} title={s.name} sub={s.short} />
                ))}
              </StepGrid>
            )}
            {step === 3 && (
              <StepGrid cols={2}>
                {["English", "Spanish", "Portuguese", "Mandarin"].map((l) => (
                  <Choice key={l} active={f.language === l} onClick={() => setF({ ...f, language: l })} title={l} sub="Available" />
                ))}
              </StepGrid>
            )}
            {step === 4 && (
              <StepGrid>
                {services.slice(0, 9).map((s) => (
                  <Choice key={s.slug} active={f.service === s.slug} onClick={() => setF({ ...f, service: s.slug })} title={s.name} sub={s.short} />
                ))}
              </StepGrid>
            )}
            {step === 5 && (
              <div className="grid grid-cols-7 gap-2">
                {days.map((d) => {
                  const iso = d.toISOString().slice(0, 10);
                  const active = f.date === iso;
                  return (
                    <button key={iso} onClick={() => setF({ ...f, date: iso })}
                      className={`p-4 text-left border transition-colors ${active ? "border-navy bg-navy text-paper" : "border-navy/10 hover:border-teal"}`}>
                      <div className="text-[10px] uppercase tracking-widest opacity-70">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      <div className="text-2xl font-serif mt-1">{d.getDate()}</div>
                      <div className="text-[10px] uppercase opacity-70">{d.toLocaleDateString("en-US", { month: "short" })}</div>
                    </button>
                  );
                })}
              </div>
            )}
            {step === 6 && (
              <StepGrid cols={3}>
                {TIMES.map((t) => (<Choice key={t} active={f.time === t} onClick={() => setF({ ...f, time: t })} title={t} sub="Available" />))}
              </StepGrid>
            )}
            {step === 7 && (
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
                <TextField label="First name" value={f.firstName} onChange={(v) => setF({ ...f, firstName: v })} required />
                <TextField label="Last name" value={f.lastName} onChange={(v) => setF({ ...f, lastName: v })} />
                <TextField label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} required type="email" />
                <TextField label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
                <div className="md:col-span-2">
                  <label className="eyebrow text-navy/50 mb-2 block">Notes</label>
                  <textarea rows={4} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className="w-full border border-navy/15 p-3 text-sm outline-none focus:border-teal" />
                </div>
              </div>
            )}
            {step === 8 && (
              <div>
                <h2 className="font-serif text-2xl text-navy mb-6">Review appointment</h2>
                <dl className="divide-y divide-navy/10 border-y border-navy/10">
                  {[
                    ["Visit", visitTypes.find(v => v.slug === f.visitType)?.name],
                    ["Format", f.mode],
                    ["State", states.find(s => s.slug === f.state)?.name],
                    ["Language", f.language],
                    ["Service", services.find(s => s.slug === f.service)?.name],
                    ["Date", f.date],
                    ["Time", f.time],
                    ["Patient", `${f.firstName} ${f.lastName}`.trim()],
                    ["Email", f.email],
                  ].map(([k, v]) => (
                    <div key={k as string} className="grid grid-cols-3 py-4 text-sm">
                      <dt className="eyebrow text-navy/45">{k}</dt>
                      <dd className="col-span-2 text-navy">{v || "—"}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6"><Disclaimer>Demonstration flow only — no appointment is created and no personal data is stored.</Disclaimer></div>
              </div>
            )}
            {step === 9 && (
              <div className="max-w-xl">
                <div className="w-14 h-14 rounded-full bg-teal/10 grid place-items-center mb-6"><Check className="text-teal" /></div>
                <h2 className="font-serif text-3xl text-navy">Request received</h2>
                <p className="mt-3 text-navy/65">Your appointment request has been recorded (demo). In production, a confirmation email would be sent and the visit would appear in your Patient Portal.</p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/portal" className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic transition-colors">Open Patient Portal</Link>
                  <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.18em] hover:bg-navy/5 transition-colors">Return home</Link>
                </div>
              </div>
            )}

            {step < 9 && (
              <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between gap-3 border-t border-navy/10 pt-6">
                <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="w-full sm:w-auto px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-navy/60 disabled:opacity-30 hover:text-navy transition-colors">← Back</button>
                <button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext} className="w-full sm:w-auto px-6 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] disabled:opacity-30 hover:bg-academic transition-colors">
                  {step === 8 ? "Confirm" : "Continue →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

function StepGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return <div className={`grid gap-3 ${cols === 3 ? "sm:grid-cols-3" : cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>{children}</div>;
}
function Choice({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button onClick={onClick} className={`text-left p-5 border transition-colors ${active ? "border-navy bg-navy text-paper" : "border-navy/10 hover:border-teal"}`}>
      <div className="text-base font-medium">{title}</div>
      <div className={`text-xs mt-1 ${active ? "text-paper/60" : "text-navy/50"}`}>{sub}</div>
    </button>
  );
}
function TextField({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <label>
      <span className="eyebrow text-navy/50 mb-2 block">{label}{required && " *"}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-navy/15 p-3 text-sm outline-none focus:border-teal" />
    </label>
  );
}
