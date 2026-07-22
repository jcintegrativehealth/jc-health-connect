import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader, Btn, Panel } from "@/components/admin/primitives";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/patients/new")({
  head: () => ({ meta: [{ title: "New patient — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: NewPatient,
});

const Field = ({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-widest text-navy/55">{label}</span>
    <input {...rest} className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal" />
  </label>
);

const Area = ({ label, ...rest }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-widest text-navy/55">{label}</span>
    <textarea {...rest} rows={3} className="mt-1.5 w-full border border-navy/15 bg-card p-3 text-sm text-navy outline-none focus:border-teal" />
  </label>
);

function NewPatient() {
  const nav = useNavigate();
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="New patient"
        description="Create a patient profile. All fields except personal information can be edited later."
        crumbs={[{ label: "Patients", to: "/admin/patients" }, { label: "New" }]}
        actions={<>
          <Btn variant="outline" onClick={() => nav({ to: "/admin/patients" })}>Cancel</Btn>
          <Btn onClick={() => setSaved(true)}>Save patient</Btn>
        </>}
      />

      {saved && (
        <div className="mb-6 border border-teal/40 bg-mist/40 p-4 flex items-center justify-between">
          <div>
            <div className="eyebrow text-teal">Saved</div>
            <div className="text-sm text-navy mt-1">Patient created — demo only. No data persisted.</div>
          </div>
          <Btn variant="outline" size="sm" onClick={() => nav({ to: "/admin/patients" })}>Return to list</Btn>
        </div>
      )}

      <form className="grid lg:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
        <Panel title="Personal information" className="lg:col-span-2">
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="First name" />
            <Field label="Last name" />
            <Field label="Preferred name" />
            <Field label="Date of birth" type="date" />
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-navy/55">Gender</span>
              <select className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                <option>Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Other</option>
              </select>
            </label>
            <Field label="Pronouns" placeholder="she/her, he/him, they/them" />
          </div>
        </Panel>

        <Panel title="Contact information">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Email" type="email" />
            <Field label="Phone" type="tel" />
            <Field label="Preferred contact" placeholder="Email, phone, portal" />
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-navy/55">Preferred language</span>
              <select className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                <option>English</option><option>Spanish</option><option>Portuguese</option><option>Mandarin</option>
              </select>
            </label>
          </div>
        </Panel>

        <Panel title="Address">
          <div className="grid gap-4">
            <Field label="Street" />
            <div className="grid grid-cols-3 gap-4">
              <Field label="City" />
              <label className="block">
                <span className="text-[11px] uppercase tracking-widest text-navy/55">State</span>
                <select className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                  <option>California</option><option>New York</option><option>Texas</option><option>Florida</option><option>Washington</option>
                </select>
              </label>
              <Field label="ZIP" />
            </div>
          </div>
        </Panel>

        <Panel title="Emergency contact">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name" />
            <Field label="Relationship" />
            <Field label="Phone" type="tel" />
            <Field label="Email" type="email" />
          </div>
        </Panel>

        <Panel title="Clinical intake">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-navy/55">Primary service</span>
              <select className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                <option>Longevity</option><option>Metabolic</option><option>Preventive</option><option>Cardio-metabolic</option><option>Weight</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-widest text-navy/55">Referral source</span>
              <select className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                <option>Website</option><option>Physician referral</option><option>Patient referral</option><option>Search</option><option>Social</option><option>Other</option>
              </select>
            </label>
          </div>
          <div className="mt-4">
            <Area label="Primary health goals" placeholder="Longevity, metabolic optimization, energy, sleep, weight, cardiovascular…" />
          </div>
        </Panel>

        <Panel title="Communication & consent" className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 text-sm text-navy/75">
              <input type="checkbox" className="mt-1 accent-teal" />
              <span>Consents to email reminders and portal notifications</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-navy/75">
              <input type="checkbox" className="mt-1 accent-teal" />
              <span>Consents to telehealth in state of residence</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-navy/75">
              <input type="checkbox" className="mt-1 accent-teal" />
              <span>Received HIPAA Notice of Privacy Practices</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-navy/75">
              <input type="checkbox" className="mt-1 accent-teal" />
              <span>Insurance information on file (out-of-network reimbursement)</span>
            </label>
          </div>
          <div className="mt-4">
            <Area label="Internal notes (staff only)" placeholder="Not visible to patient" />
          </div>
        </Panel>

        <div className="lg:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <Btn variant="outline" type="button" onClick={() => nav({ to: "/admin/patients" })}>Cancel</Btn>
          <Btn type="submit">Save patient</Btn>
        </div>
      </form>
    </div>
  );
}
