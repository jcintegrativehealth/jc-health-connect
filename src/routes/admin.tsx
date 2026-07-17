import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, DemoBanner } from "@/components/site/primitives";
import { useState } from "react";
import { LayoutDashboard, FileText, Users, MessageSquare, Calendar, Mail, Image as ImageIcon, Settings, BarChart3, Search, Shield, Activity, Beaker } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — JC Integrative Health" },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "/admin" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "articles", label: "Articles", icon: FileText },
  { key: "research", label: "Research", icon: Beaker },
  { key: "physicians", label: "Physicians", icon: Users },
  { key: "guests", label: "Guest Contributors", icon: Users },
  { key: "comments", label: "Comments & Moderation", icon: MessageSquare },
  { key: "appointments", label: "Appointment Requests", icon: Calendar },
  { key: "messages", label: "Contact Messages", icon: Mail },
  { key: "newsletter", label: "Newsletter", icon: Mail },
  { key: "media", label: "Media Library", icon: ImageIcon },
  { key: "services", label: "Services", icon: FileText },
  { key: "conditions", label: "Conditions", icon: FileText },
  { key: "innovation", label: "Innovation Radar", icon: Activity },
  { key: "medications", label: "Medication Updates", icon: FileText },
  { key: "users", label: "Users & Roles", icon: Shield },
  { key: "seo", label: "SEO", icon: Search },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

function AdminPage() {
  const [active, setActive] = useState("dashboard");
  return (
    <>
      <DemoBanner />
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="bg-navy text-paper py-8 px-4">
          <div className="px-4 mb-8">
            <div className="eyebrow text-gold mb-2">Admin</div>
            <div className="font-serif text-xl">JC Integrative Health</div>
          </div>
          <nav className="space-y-1 max-h-[70vh] overflow-y-auto">
            {NAV.map((n) => (
              <button key={n.key} onClick={() => setActive(n.key)} className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${active === n.key ? "bg-academic text-paper" : "text-paper/70 hover:bg-academic/50"}`}>
                <n.icon size={14} strokeWidth={1.5} />
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-4 border-t border-paper/10 px-4">
            <Link to="/" className="text-xs text-paper/50 hover:text-paper">← Back to site</Link>
          </div>
        </aside>

        <Container className="py-12">
          {active === "dashboard" && <AdminDashboard onOpen={setActive} />}
          {active === "comments" && <CommentModeration />}
          {active !== "dashboard" && active !== "comments" && <AdminStub label={NAV.find((n) => n.key === active)?.label || ""} />}
        </Container>
      </div>
    </>
  );
}

function AdminDashboard() {
  return (
    <div>
      <div className="eyebrow text-gold mb-3">Overview</div>
      <h1 className="font-serif text-4xl text-navy">Editorial dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4 mt-10">
        {[
          ["Pending articles", "3", "Awaiting review"],
          ["Comments to moderate", "12", "In queue"],
          ["Appointment requests", "8", "This week"],
          ["Contact messages", "5", "Unassigned"],
        ].map(([l, v, s]) => (
          <div key={l} className="bg-card p-6 border border-navy/10">
            <div className="eyebrow text-navy/45">{l}</div>
            <div className="font-serif text-4xl text-navy mt-3">{v}</div>
            <div className="text-xs text-navy/50 mt-1">{s}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <div className="bg-card p-6 border border-navy/10">
          <div className="eyebrow text-navy/45 mb-4">Recent editorial activity</div>
          <ul className="text-sm text-navy/70 divide-y divide-navy/10">
            <li className="py-2 flex justify-between"><span>Article published · mTOR review</span><span className="text-xs text-navy/40">2h</span></li>
            <li className="py-2 flex justify-between"><span>Guest physician approved · Dr. Amelia Park</span><span className="text-xs text-navy/40">1d</span></li>
            <li className="py-2 flex justify-between"><span>Innovation radar updated · CGM</span><span className="text-xs text-navy/40">3d</span></li>
          </ul>
        </div>
        <div className="bg-card p-6 border border-navy/10">
          <div className="eyebrow text-navy/45 mb-4">Traffic (preview)</div>
          <div className="text-xs text-navy/50 mb-3">Illustrative — real analytics wire up during backend integration.</div>
          <div className="h-32 flex items-end gap-1">
            {[20, 35, 24, 48, 60, 55, 72, 68, 82, 76, 90, 88].map((h, i) => (
              <div key={i} className="flex-1 bg-teal/70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStub({ label }: { label: string }) {
  return (
    <div>
      <div className="eyebrow text-gold mb-3">Admin</div>
      <h1 className="font-serif text-4xl text-navy">{label}</h1>
      <p className="text-navy/60 mt-2">Structured management interface for {label.toLowerCase()}.</p>
      <div className="mt-10 border border-navy/10">
        <div className="flex items-center justify-between p-4 border-b border-navy/10 bg-mist/40">
          <div className="flex items-center gap-3">
            <div className="w-64 h-9 border border-navy/15 bg-paper px-3 flex items-center gap-2 text-xs text-navy/50"><Search size={12} /> Search {label.toLowerCase()}</div>
            <select className="h-9 border border-navy/15 bg-paper px-2 text-xs text-navy/70"><option>All</option><option>Recent</option></select>
          </div>
          <button className="px-4 py-2 bg-navy text-paper text-xs font-semibold uppercase tracking-widest hover:bg-academic transition-colors">New</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left">
            <tr className="border-b border-navy/10 text-navy/50">
              <th className="p-4 eyebrow font-normal">Title</th>
              <th className="p-4 eyebrow font-normal">Status</th>
              <th className="p-4 eyebrow font-normal">Updated</th>
              <th className="p-4 eyebrow font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-navy/5 hover:bg-mist/40">
                <td className="p-4 text-navy">Example {label} record #{i}</td>
                <td className="p-4"><span className="text-[10px] font-semibold uppercase tracking-widest text-teal">Published</span></td>
                <td className="p-4 text-navy/55 text-xs">Aug {10 + i}, 2026</td>
                <td className="p-4 text-right"><button className="text-xs text-navy/55 hover:text-navy">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
