import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, BtnPrimary, BtnGhost, Disclaim } from "./patient";
import { patient } from "@/data/patient";

export const Route = createFileRoute("/_authenticated/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

const TABS = ["Personal", "Contact", "Emergency", "Communication", "Language", "Insurance", "Privacy", "Consents", "Devices"] as const;

function ProfilePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Personal");

  return (
    <div>
      <PortalPageHeader eyebrow="Account" title="Profile" lede="Manage your personal information, communication and privacy preferences." />

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="lg:border-r lg:border-navy/10 lg:pr-4">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <li key={t}>
                <button onClick={() => setTab(t)} className={`w-full text-left px-3 py-2 text-sm rounded-sm whitespace-nowrap ${tab === t ? "bg-mist text-navy" : "text-navy/65 hover:bg-mist/60"}`}>{t}</button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-5">
          {tab === "Personal" && (
            <PortalCard title="Personal information">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" value={patient.fullName} />
                <Field label="Preferred name" value={patient.preferredName} />
                <Field label="Date of birth" value={new Date(patient.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                <Field label="Gender" value={patient.gender} />
                <Field label="Address" value={patient.address} full />
                <Field label="State" value={patient.state} />
              </div>
              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <BtnPrimary onClick={() => toast.success("Saved (demo)")}>Save changes</BtnPrimary>
              </div>
            </PortalCard>
          )}
          {tab === "Contact" && (
            <PortalCard title="Contact information">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email" value={patient.email} />
                <Field label="Phone" value={patient.phone} />
              </div>
            </PortalCard>
          )}
          {tab === "Emergency" && (
            <PortalCard title="Emergency contact">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" value={patient.emergencyContact.name} />
                <Field label="Relationship" value={patient.emergencyContact.relationship} />
                <Field label="Phone" value={patient.emergencyContact.phone} />
                <Field label="Email" value={patient.emergencyContact.email} />
              </div>
            </PortalCard>
          )}
          {tab === "Communication" && (
            <PortalCard title="Communication preferences">
              {["Email", "SMS", "Phone", "Portal Messages"].map((c) => (
                <label key={c} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-navy" /> <span className="text-sm text-navy">{c}</span>
                </label>
              ))}
            </PortalCard>
          )}
          {tab === "Language" && (
            <PortalCard title="Preferred language">
              <div className="grid sm:grid-cols-2 gap-2">
                {["English", "Spanish", "Portuguese", "Mandarin Chinese"].map((l, i) => (
                  <label key={l} className="flex items-center gap-3 border border-navy/15 rounded-sm px-3 py-2.5 text-sm text-navy/80 hover:border-navy/30 cursor-pointer">
                    <input type="radio" name="lang" defaultChecked={i === 0} className="h-4 w-4 accent-navy" /> {l}
                  </label>
                ))}
              </div>
            </PortalCard>
          )}
          {tab === "Insurance" && (
            <PortalCard title="Insurance information">
              <p className="text-sm text-navy/70">Insurance details and reimbursement documentation appear here.</p>
              <div className="mt-3"><BtnGhost onClick={() => toast("Upload placeholder (demo)")}>Upload insurance card</BtnGhost></div>
            </PortalCard>
          )}
          {tab === "Privacy" && (
            <>
              <PortalCard title="Privacy & security">
                <div className="space-y-3">
                  <PlaceholderRow label="Password" note="Will be available once authentication is enabled." />
                  <PlaceholderRow label="Active sessions" note="Session management placeholder." />
                  <PlaceholderRow label="Download health records" note="Export your data (placeholder)." />
                  <PlaceholderRow label="Request correction" note="Request a correction to your record (placeholder)." />
                </div>
              </PortalCard>
              <Disclaim>Privacy features shown here are placeholders. No real authentication or record modifications occur in this demonstration.</Disclaim>
            </>
          )}
          {tab === "Consents" && (
            <PortalCard title="Consents">
              {["Telehealth consent", "Privacy notice acknowledgment", "Data sharing preferences"].map((c) => (
                <label key={c} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-navy" /> <span className="text-sm text-navy">{c}</span>
                </label>
              ))}
            </PortalCard>
          )}
          {tab === "Devices" && (
            <PortalCard title="Connected devices (placeholder)">
              <p className="text-sm text-navy/70">Wearable and device integrations will appear here in a future release.</p>
            </PortalCard>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="eyebrow text-navy/50 text-[10px] mb-1 block">{label}</span>
      <input defaultValue={value} className="w-full border border-navy/15 rounded-sm p-2.5 text-sm text-navy outline-none focus:border-teal" />
    </label>
  );
}
function PlaceholderRow({ label, note }: { label: string; note: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-navy/10 rounded-sm p-3">
      <div>
        <div className="text-sm text-navy">{label}</div>
        <div className="text-[11px] text-navy/50">{note}</div>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-navy/40 border border-navy/15 rounded-sm px-2 py-0.5">Coming soon</span>
    </div>
  );
}
