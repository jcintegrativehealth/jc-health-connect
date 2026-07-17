import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, DemoBanner } from "@/components/site/primitives";
import { useState } from "react";
import { Bell, Calendar, FileText, MessageSquare, Activity, User, Lock, Globe, Shield, ClipboardList, Receipt, Folder } from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Patient Portal — JC Integrative Health" },
      { name: "description", content: "Patient portal dashboard (demo)." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/portal" },
    ],
    links: [{ rel: "canonical", href: "/portal" }],
  }),
  component: PortalPage,
});

function PortalPage() {
  const [authed, setAuthed] = useState(false);
  if (!authed) return <PortalLogin onLogin={() => setAuthed(true)} />;
  return <PortalDashboard />;
}

function PortalLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <>
      <DemoBanner />
      <div className="max-w-md mx-auto py-24 px-6">
        <div className="eyebrow text-gold mb-4 text-center">Patient Portal</div>
        <h1 className="font-serif text-4xl text-navy text-center">Sign in</h1>
        <p className="text-center text-navy/55 text-sm mt-3">Demonstration login. Any email/password will work.</p>
        <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="mt-10 space-y-5">
          <label className="block">
            <span className="eyebrow text-navy/50 mb-2 block">Email</span>
            <input type="email" required className="w-full border border-navy/15 p-3 text-sm outline-none focus:border-teal" />
          </label>
          <label className="block">
            <span className="eyebrow text-navy/50 mb-2 block">Password</span>
            <input type="password" required className="w-full border border-navy/15 p-3 text-sm outline-none focus:border-teal" />
          </label>
          <button type="submit" className="w-full py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic">Sign in</button>
          <div className="text-center text-xs text-navy/50">
            <a href="#" className="hover:text-navy">Forgot password?</a>
          </div>
        </form>
      </div>
    </>
  );
}

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: Activity },
  { key: "appointments", label: "Upcoming", icon: Calendar },
  { key: "history", label: "History", icon: ClipboardList },
  { key: "plans", label: "Health Plans", icon: FileText },
  { key: "documents", label: "Documents", icon: Folder },
  { key: "labs", label: "Lab Results", icon: FileText },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "billing", label: "Billing", icon: Receipt },
  { key: "forms", label: "Forms", icon: ClipboardList },
  { key: "profile", label: "Profile", icon: User },
  { key: "language", label: "Language", icon: Globe },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "privacy", label: "Privacy", icon: Shield },
];

function PortalDashboard() {
  const [active, setActive] = useState("dashboard");
  return (
    <>
      <DemoBanner />
      <div className="grid lg:grid-cols-[240px_1fr] min-h-screen">
        <aside className="bg-navy text-paper py-8 px-4">
          <div className="px-4 mb-8">
            <div className="eyebrow text-gold mb-2">Patient Portal</div>
            <div className="font-serif text-xl">Welcome, Alex</div>
          </div>
          <nav className="space-y-1">
            {NAV.map((n) => (
              <button key={n.key} onClick={() => setActive(n.key)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${active === n.key ? "bg-academic text-paper" : "text-paper/70 hover:bg-academic/50"}`}>
                <n.icon size={15} strokeWidth={1.5} />
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-4 border-t border-paper/10 px-4">
            <Link to="/" className="text-xs text-paper/50 hover:text-paper flex items-center gap-2"><Lock size={12} /> Sign out</Link>
          </div>
        </aside>

        <Container className="py-12">
          {active === "dashboard" && <DashboardHome />}
          {active !== "dashboard" && <StubPanel title={NAV.find(n => n.key === active)?.label || ""} />}
        </Container>
      </div>
    </>
  );
}

function DashboardHome() {
  return (
    <div>
      <div className="eyebrow text-gold mb-3">Overview</div>
      <h1 className="font-serif text-4xl text-navy">Good afternoon, Alex</h1>
      <p className="text-navy/60 mt-2 text-sm">Here is your care summary.</p>

      <div className="grid md:grid-cols-3 gap-5 mt-10">
        <Card title="Next appointment" mono="TUE · SEP 24 · 10:30 AM">
          <div className="text-navy">Follow-up Visit · Telehealth</div>
          <div className="text-xs text-navy/50 mt-1">Dr. Jason Chen · 30 min</div>
          <button className="mt-4 w-full py-2 bg-teal text-paper text-xs font-semibold uppercase tracking-widest">Join / Manage</button>
        </Card>
        <Card title="Care plan progress" mono="ACTIVE · CYCLE 2">
          <div className="w-full h-1.5 bg-mist rounded-full overflow-hidden"><div className="h-full w-3/5 bg-teal" /></div>
          <div className="text-xs text-navy/55 mt-3">6 of 10 milestones complete</div>
        </Card>
        <Card title="Pending forms" mono="2 REQUIRED">
          <ul className="text-sm text-navy/70 space-y-1.5">
            <li>· Sleep and Recovery intake</li>
            <li>· Metabolic history update</li>
          </ul>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-6">
        <Card title="Recent documents" mono="LAST 30 DAYS">
          <ul className="text-sm text-navy/70 divide-y divide-navy/10">
            {["Metabolic panel — Aug 12", "Care plan — Aug 05", "Sleep summary — Jul 28"].map((d) => (
              <li key={d} className="py-2 flex justify-between"><span>{d}</span><a className="text-teal font-mono text-xs uppercase" href="#">Open</a></li>
            ))}
          </ul>
        </Card>
        <Card title="Messages" mono="1 UNREAD">
          <div className="text-sm">
            <div className="p-3 border-l-2 border-teal bg-teal/5">
              <div className="text-navy font-medium text-sm">Dr. Jason Chen · 2 hours ago</div>
              <div className="text-navy/70 mt-1">Your recent labs look good overall — let's discuss at Tuesday's follow-up.</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Health reminders" mono="AS OF TODAY">
          <ul className="text-sm text-navy/70 grid sm:grid-cols-2 gap-y-2">
            <li>· Continuous glucose monitor: replace sensor in 3 days</li>
            <li>· Preventive screening: annual visit due in 6 weeks</li>
            <li>· Sleep tracking: 4 nights logged this week</li>
            <li>· Weekly reflection: due Sunday</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, mono, children }: { title: string; mono: string; children: React.ReactNode }) {
  return (
    <div className="bg-card p-6 border border-navy/10">
      <div className="flex justify-between items-baseline mb-4">
        <span className="eyebrow text-navy/50">{title}</span>
        <span className="font-mono text-[10px] text-navy/40">{mono}</span>
      </div>
      {children}
    </div>
  );
}

function StubPanel({ title }: { title: string }) {
  return (
    <div>
      <div className="eyebrow text-gold mb-3">Portal</div>
      <h1 className="font-serif text-4xl text-navy">{title}</h1>
      <p className="text-navy/60 mt-2 text-sm">This section is part of the portal mockup. All data is illustrative.</p>
      <div className="mt-10 grid md:grid-cols-2 gap-5">
        <Card title="Section content" mono="DEMO">
          <p className="text-sm text-navy/65">Structured content for the {title.toLowerCase()} area would appear here — including tables, filters, downloads, and forms as appropriate.</p>
        </Card>
        <Card title="Coming soon" mono="MOCKUP">
          <p className="text-sm text-navy/65">Interaction states, empty states, and error states are prepared in the design system and will be wired to real data during backend integration.</p>
        </Card>
      </div>
    </div>
  );
}
