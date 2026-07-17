import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalPageHeader, PortalCard, Disclaim } from "./patient";
import { HelpCircle } from "lucide-react";

export const Route = createFileRoute("/patient/help")({
  head: () => ({ meta: [{ title: "Help & Support — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: HelpPage,
});

const FAQS = [
  { q: "How do I join my telehealth visit?", a: "Enter the waiting room 15 minutes before your visit. Once your care team is ready, the Join Visit button will be enabled." },
  { q: "How do I message my care team?", a: "Use the Messages area of the portal. Do not use messaging for emergencies." },
  { q: "How can I request a refill?", a: "Open Medications and use Request refill on the medication card." },
  { q: "How do I download a receipt?", a: "Open Billing and select Download on the paid invoice." },
];

function HelpPage() {
  return (
    <div>
      <PortalPageHeader eyebrow="Support" title="Help & support" lede="Get answers, contact our team, or learn how to use the portal." />

      <div className="grid md:grid-cols-2 gap-5">
        <PortalCard title="Frequently asked questions">
          <div className="divide-y divide-navy/10">
            {FAQS.map((f) => (
              <details key={f.q} className="py-3 group">
                <summary className="cursor-pointer flex justify-between items-center list-none text-sm text-navy"><span>{f.q}</span><HelpCircle size={14} className="text-gold group-open:rotate-180 transition-transform" /></summary>
                <p className="mt-2 text-sm text-navy/65">{f.a}</p>
              </details>
            ))}
          </div>
        </PortalCard>

        <PortalCard title="Contact">
          <ul className="space-y-3 text-sm">
            <li><span className="eyebrow text-navy/50 text-[10px] block mb-0.5">Patient support</span><a href="mailto:care@jcintegrative.example" className="text-navy hover:text-gold">care@jcintegrative.example</a></li>
            <li><span className="eyebrow text-navy/50 text-[10px] block mb-0.5">Billing</span><a href="mailto:billing@jcintegrative.example" className="text-navy hover:text-gold">billing@jcintegrative.example</a></li>
            <li><span className="eyebrow text-navy/50 text-[10px] block mb-0.5">Telehealth support</span><Link to="/patient/telehealth" className="text-navy hover:text-gold">Visit telehealth help center</Link></li>
            <li><span className="eyebrow text-navy/50 text-[10px] block mb-0.5">Privacy questions</span><a href="mailto:privacy@jcintegrative.example" className="text-navy hover:text-gold">privacy@jcintegrative.example</a></li>
          </ul>
        </PortalCard>

        <div className="md:col-span-2 border border-destructive/25 bg-destructive/5 text-destructive px-5 py-4 rounded-sm">
          <div className="font-mono uppercase tracking-widest text-[10px] mb-1">Emergency</div>
          <p className="text-sm text-navy/75">This portal is not for emergencies. Call 911 or your local emergency services if you are experiencing a medical emergency.</p>
        </div>

        <div className="md:col-span-2"><Disclaim>Support hours: Monday to Friday, 8 AM – 6 PM MST. Responses may take one business day.</Disclaim></div>
      </div>
    </div>
  );
}
