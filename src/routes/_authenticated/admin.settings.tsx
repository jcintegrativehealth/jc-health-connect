import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Btn, Chip } from "@/components/admin/primitives";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Settings,
});

const SECTIONS = ["Clinic profile", "Team", "Services", "States", "Languages", "Integrations", "Notifications", "Templates", "Security", "Billing config"];

function Settings() {
  const [tab, setTab] = useState("Clinic profile");
  return (
    <div>
      <PageHeader eyebrow="Operations" title="Settings" description="Configure clinic, integrations, security and communication defaults." actions={<Btn>Save changes</Btn>} />

      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        <Panel>
          <ul className="-m-4 divide-y divide-navy/10">
            {SECTIONS.map((s) => (
              <li key={s}><button onClick={() => setTab(s)} className={`w-full text-left px-4 py-2.5 text-sm ${tab === s ? "text-navy bg-mist/50" : "text-navy/60 hover:text-navy"}`}>{s}</button></li>
            ))}
          </ul>
        </Panel>

        <Panel title={tab}>
          {tab === "Clinic profile" && (
            <div className="grid md:grid-cols-2 gap-4">
              {["Clinic name", "Founder & Medical Director", "NPI", "Tax ID", "Public email", "Phone", "Website", "Time zone"].map((f) => (
                <label key={f} className="block">
                  <span className="text-[11px] uppercase tracking-widest text-navy/55">{f}</span>
                  <input className="mt-1.5 w-full h-10 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" defaultValue={f === "Clinic name" ? "JC Integrative Health" : f === "Founder & Medical Director" ? "Dr. Jason Chen" : ""} />
                </label>
              ))}
            </div>
          )}
          {tab === "States" && (
            <>
              <div className="eyebrow text-navy/50 mb-3">Licensed states</div>
              <div className="flex flex-wrap gap-2">{["Virginia", "Maryland", "Colorado"].map((s) => <Chip key={s} active>{s}</Chip>)}</div>
            </>
          )}
          {tab === "Languages" && (
            <>
              <div className="eyebrow text-navy/50 mb-3">Supported languages</div>
              <div className="flex flex-wrap gap-2">{["English", "Spanish", "Portuguese", "Mandarin"].map((l) => <Chip key={l} active>{l}</Chip>)}</div>
            </>
          )}
          {tab === "Integrations" && (
            <ul className="divide-y divide-navy/10 -m-4">
              {[["Quest Diagnostics", "Connected"], ["LabCorp", "Connected"], ["Function Health", "Connected"], ["Stripe", "Connected"], ["Twilio", "Not connected"], ["Zoom Telehealth", "Connected"], ["Google Calendar", "Connected"]].map(([n, s]) => (
                <li key={n} className="flex items-center justify-between px-4 py-3">
                  <div className="text-sm text-navy">{n}</div>
                  <span className={`text-[10px] uppercase tracking-widest ${s === "Connected" ? "text-teal" : "text-navy/40"}`}>{s}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === "Security" && (
            <div className="space-y-4 text-sm text-navy/75">
              <div className="flex items-center justify-between border-b border-navy/10 pb-3"><span>Two-factor authentication</span><span className="text-teal text-[10px] uppercase tracking-widest">Enabled</span></div>
              <div className="flex items-center justify-between border-b border-navy/10 pb-3"><span>Session timeout</span><span>30 min</span></div>
              <div className="flex items-center justify-between border-b border-navy/10 pb-3"><span>PHI access logging</span><span className="text-teal text-[10px] uppercase tracking-widest">Active</span></div>
              <div className="flex items-center justify-between border-b border-navy/10 pb-3"><span>Data export encryption</span><span>AES-256</span></div>
              <div className="flex items-center justify-between"><span>HIPAA Business Associate Agreements</span><span className="text-teal text-[10px] uppercase tracking-widest">Signed · 7</span></div>
            </div>
          )}
          {!["Clinic profile", "States", "Languages", "Integrations", "Security"].includes(tab) && (
            <div className="p-8 text-center text-sm text-navy/55">Settings for <span className="text-navy">{tab}</span> · configure once backend is enabled.</div>
          )}
        </Panel>
      </div>
    </div>
  );
}
