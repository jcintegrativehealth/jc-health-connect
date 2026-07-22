import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalPageHeader, PortalCard, BtnPrimary, Disclaim } from "./patient";
import { Video, MapPin, ShieldCheck, HelpCircle, Wifi, Monitor } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/telehealth/")({
  head: () => ({ meta: [{ title: "Telehealth — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: TelehealthPage,
});

function TelehealthPage() {
  return (
    <div>
      <PortalPageHeader
        eyebrow="Care · Telehealth"
        title="Telehealth visits"
        lede="Meet with Dr. Jason Chen from anywhere in Colorado or Washington. Secure, private, and clinically integrated."
        actions={<Link to="/patient/telehealth/waiting-room"><BtnPrimary>Enter Waiting Room</BtnPrimary></Link>}
      />

      <div className="grid md:grid-cols-2 gap-5">
        <PortalCard title="How telehealth works" meta="4 steps">
          <ol className="space-y-3 text-sm text-navy/75">
            {["Schedule your visit through the portal.", "Complete pre-visit forms up to 24 hours in advance.", "Enter the waiting room 15 minutes before your visit.", "Meet with Dr. Chen through secure video."].map((s, i) => (
              <li key={i} className="flex gap-3"><span className="font-mono text-gold text-[11px] mt-0.5">0{i + 1}</span>{s}</li>
            ))}
          </ol>
        </PortalCard>

        <PortalCard title="Supported states">
          <div className="flex flex-wrap gap-2">
            {["Colorado", "Washington"].map((s) => (
              <span key={s} className="border border-navy/15 rounded-sm px-3 py-1.5 text-xs text-navy inline-flex items-center gap-1.5"><MapPin size={12} className="text-gold" /> {s}</span>
            ))}
          </div>
          <p className="mt-4 text-xs text-navy/55">Additional states can be evaluated during onboarding depending on licensure and clinical criteria.</p>
        </PortalCard>

        <PortalCard title="Technology requirements">
          <ul className="space-y-2 text-sm text-navy/75">
            <li className="flex gap-2 items-center"><Wifi size={13} className="text-academic" /> Stable internet connection</li>
            <li className="flex gap-2 items-center"><Monitor size={13} className="text-academic" /> Modern browser (Chrome, Safari, Edge, Firefox)</li>
            <li className="flex gap-2 items-center"><Video size={13} className="text-academic" /> Working camera and microphone</li>
          </ul>
        </PortalCard>

        <PortalCard title="Privacy & security">
          <p className="text-sm text-navy/75 leading-relaxed"><ShieldCheck size={14} className="inline text-teal mr-1.5" />Sessions are encrypted end-to-end. No recordings are stored without your explicit consent.</p>
        </PortalCard>

        <PortalCard title="How to prepare" className="md:col-span-2">
          <ul className="grid sm:grid-cols-2 gap-y-2 text-sm text-navy/75">
            <li>· Quiet, private, well-lit space</li>
            <li>· Identification available</li>
            <li>· Medication list nearby</li>
            <li>· Recent lab or wearable data</li>
            <li>· Written questions</li>
            <li>· Test camera & microphone in advance</li>
          </ul>
        </PortalCard>

        <PortalCard title="Frequently asked questions" className="md:col-span-2">
          <div className="divide-y divide-navy/10">
            {[
              { q: "What if I need to reschedule?", a: "You may reschedule up to 24 hours before your visit at no charge." },
              { q: "Do you accept insurance for telehealth?", a: "We provide superbills for out-of-network reimbursement where applicable." },
              { q: "What if I have connection issues?", a: "Our care coordinator will reach out and reschedule at no cost." },
            ].map((f) => (
              <details key={f.q} className="py-3 group">
                <summary className="cursor-pointer flex justify-between items-center list-none text-sm text-navy"><span>{f.q}</span><HelpCircle size={14} className="text-gold group-open:rotate-180 transition-transform" /></summary>
                <p className="mt-2 text-sm text-navy/60">{f.a}</p>
              </details>
            ))}
          </div>
        </PortalCard>

        <div className="md:col-span-2"><Disclaim>Telehealth is not appropriate for emergencies. Call 911 or your local emergency services for urgent medical situations.</Disclaim></div>
      </div>
    </div>
  );
}
