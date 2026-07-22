import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, StatusPill, BtnPrimary, BtnGhost } from "./patient";
import { forms } from "@/data/patient";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/forms")({
  head: () => ({ meta: [{ title: "Forms — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: FormsPage,
});

function FormsPage() {
  const [openForm, setOpenForm] = useState<string | null>(null);
  const active = forms.find((f) => f.id === openForm);

  return (
    <div>
      <PortalPageHeader eyebrow="Care · Intake" title="Forms" lede="Complete forms before your visits and keep your medical history up to date." />

      {!active ? (
        <div className="grid md:grid-cols-2 gap-4">
          {forms.map((f) => (
            <div key={f.id} className="bg-card border border-navy/10 rounded-sm p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="font-serif text-xl text-navy">{f.title}</div>
                <StatusPill tone={f.status === "Completed" ? "success" : f.status === "In Progress" ? "info" : f.status === "Requires Update" ? "warn" : "neutral"}>{f.status}</StatusPill>
              </div>
              <p className="text-sm text-navy/60">{f.desc}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono uppercase tracking-widest text-navy/50">
                <span>{f.time}</span>
                {f.due !== "—" && <span>Due · {f.due}</span>}
                {f.progress > 0 && <span>{f.progress}% complete</span>}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <BtnPrimary onClick={() => setOpenForm(f.id)}>{f.status === "Completed" ? "Review" : f.status === "In Progress" ? "Continue" : "Start"}</BtnPrimary>
                {f.status === "Completed" && <BtnGhost onClick={() => toast("Download started (demo)")}>Download</BtnGhost>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <FormFlow form={active} onExit={() => setOpenForm(null)} />
      )}
    </div>
  );
}

function FormFlow({ form, onExit }: { form: typeof forms[number]; onExit: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const steps = ["Background", "Habits", "Symptoms", "Review"];

  if (done) {
    return (
      <PortalCard>
        <div className="py-12 text-center max-w-md mx-auto">
          <CheckCircle2 size={40} className="text-teal mx-auto" strokeWidth={1.3} />
          <h2 className="font-serif text-3xl text-navy mt-4">Form submitted</h2>
          <p className="text-sm text-navy/60 mt-2">Thank you. Your responses have been shared with your care team.</p>
          <div className="mt-6 flex justify-center"><BtnPrimary onClick={onExit}>Back to forms</BtnPrimary></div>
        </div>
      </PortalCard>
    );
  }

  return (
    <PortalCard title={form.title} meta={`Step ${step + 1} of ${steps.length}`}>
      <div className="w-full h-1 bg-mist rounded-full overflow-hidden mb-6"><div className="h-full bg-gold transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>

      <div className="min-h-[240px]">
        <div className="eyebrow text-navy/50 mb-4">{steps[step]}</div>
        <div className="space-y-4">
          {step === 0 && <>
            <FieldInput label="How would you describe your typical sleep quality?" placeholder="Restorative, restless, variable…" />
            <FieldInput label="What time do you typically go to bed?" placeholder="e.g., 10:30 PM" />
          </>}
          {step === 1 && <>
            <FieldRadio label="How often do you exercise?" options={["Rarely", "1–2× / week", "3–4× / week", "5+ / week"]} />
            <FieldRadio label="How often do you consume caffeine after noon?" options={["Never", "Occasionally", "Often", "Daily"]} />
          </>}
          {step === 2 && <>
            <FieldRadio label="Do you experience daytime fatigue?" options={["Never", "Sometimes", "Often", "Always"]} />
            <FieldInput label="Any other symptoms your care team should know about?" placeholder="Optional" />
          </>}
          {step === 3 && <div className="text-sm text-navy/70">Please review your responses. You may go back to edit any section before submitting.</div>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 justify-between">
        <BtnGhost onClick={onExit}>Save & exit</BtnGhost>
        <div className="flex gap-2">
          <BtnGhost onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Previous</BtnGhost>
          {step < steps.length - 1 ? (
            <BtnPrimary onClick={() => setStep((s) => s + 1)}>Next</BtnPrimary>
          ) : (
            <BtnPrimary onClick={() => setDone(true)}>Submit form</BtnPrimary>
          )}
        </div>
      </div>
    </PortalCard>
  );
}

function FieldInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="eyebrow text-navy/60 text-[11px] mb-2 block">{label}</span>
      <input placeholder={placeholder} className="w-full border border-navy/15 rounded-sm p-3 text-sm outline-none focus:border-teal" />
    </label>
  );
}
function FieldRadio({ label, options }: { label: string; options: string[] }) {
  const name = label.slice(0, 8);
  return (
    <div>
      <div className="eyebrow text-navy/60 text-[11px] mb-2">{label}</div>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-3 border border-navy/15 rounded-sm px-3 py-2.5 text-sm text-navy/80 hover:border-navy/30 cursor-pointer">
            <input type="radio" name={name} className="h-4 w-4 accent-navy" /> {o}
          </label>
        ))}
      </div>
    </div>
  );
}
