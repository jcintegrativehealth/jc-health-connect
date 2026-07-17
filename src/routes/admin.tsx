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

function AdminDashboard({ onOpen }: { onOpen: (key: string) => void }) {
  return (
    <div>
      <div className="eyebrow text-gold mb-3">Overview</div>
      <h1 className="font-serif text-4xl text-navy">Editorial dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4 mt-10">
        {[
          ["Pending articles", "3", "Awaiting review", "articles"],
          ["Comments to moderate", "12", "Awaiting Dr. Chen", "comments"],
          ["Appointment requests", "8", "This week", "appointments"],
          ["Contact messages", "5", "Unassigned", "messages"],
        ].map(([l, v, s, key]) => (
          <button key={l} onClick={() => onOpen(key)} className="text-left bg-card p-6 border border-navy/10 hover:border-gold/50 transition-colors">
            <div className="eyebrow text-navy/45">{l}</div>
            <div className="font-serif text-4xl text-navy mt-3">{v}</div>
            <div className="text-xs text-navy/50 mt-1">{s}</div>
          </button>
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

type PendingComment = {
  id: string;
  author: string;
  email: string;
  article: string;
  submitted: string;
  body: string;
  status: "pending" | "approved" | "rejected";
};

const INITIAL_COMMENTS: PendingComment[] = [
  { id: "c1", author: "Marta Alves", email: "m.alves@example.com", article: "Rethinking mTOR in longevity practice", submitted: "2h ago", status: "pending", body: "Curious how you weigh rapalogs against lifestyle-based mTOR modulation in early-stage patients — any framework you follow in clinic?" },
  { id: "c2", author: "David Chen", email: "d.chen@example.com", article: "Continuous glucose monitoring beyond diabetes", submitted: "5h ago", status: "pending", body: "Great overview. Would love a follow-up on interpreting nocturnal variability in metabolically healthy adults." },
  { id: "c3", author: "Anon.", email: "hidden@example.com", article: "Integrative approaches to chronic fatigue", submitted: "1d ago", status: "pending", body: "Removed — includes personal medical detail. Flag for privacy." },
  { id: "c4", author: "Priya Nair", email: "p.nair@example.com", article: "The evidence base for adaptogens", submitted: "2d ago", status: "pending", body: "Appreciate the balanced tone. Any thoughts on standardization variability between suppliers?" },
];

function CommentModeration() {
  const [comments, setComments] = useState<PendingComment[]>(INITIAL_COMMENTS);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  const act = (id: string, status: PendingComment["status"]) =>
    setComments((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));

  const visible = comments.filter((c) => c.status === filter);
  const counts = {
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  };

  return (
    <div>
      <div className="eyebrow text-gold mb-3">Moderation</div>
      <h1 className="font-serif text-4xl text-navy">Comments & Moderation</h1>
      <p className="text-navy/60 mt-2 max-w-2xl">
        Every reader comment on Insights is held for review. Approve, reject, or archive before it appears publicly on the article page.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-navy/10">
        {(["pending", "approved", "rejected"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${filter === k ? "text-navy border-b-2 border-gold -mb-px" : "text-navy/50 hover:text-navy"}`}
          >
            {k} <span className="ml-1 text-navy/40">({counts[k]})</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {visible.length === 0 && (
          <div className="p-8 border border-navy/10 bg-mist/40 text-center text-sm text-navy/55">
            No {filter} comments.
          </div>
        )}
        {visible.map((c) => (
          <article key={c.id} className="border border-navy/10 bg-paper p-5">
            <header className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-navy/10">
              <div>
                <div className="text-sm font-medium text-navy">{c.author}</div>
                <div className="text-xs text-navy/50">{c.email} · {c.submitted}</div>
              </div>
              <div className="text-xs text-navy/55">
                on <span className="text-navy">{c.article}</span>
              </div>
            </header>
            <p className="mt-3 text-sm text-navy/80 leading-relaxed">{c.body}</p>
            {c.status === "pending" ? (
              <div className="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  onClick={() => act(c.id, "rejected")}
                  className="w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-widest text-navy/60 border border-navy/15 hover:text-navy hover:border-navy/40 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => act(c.id, "approved")}
                  className="w-full sm:w-auto px-5 py-2 bg-navy text-paper text-xs font-semibold uppercase tracking-widest hover:bg-academic transition-colors"
                >
                  Approve & publish
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className={`uppercase tracking-widest font-semibold ${c.status === "approved" ? "text-teal" : "text-gold"}`}>
                  {c.status === "approved" ? "Approved" : "Rejected"}
                </span>
                <button
                  onClick={() => act(c.id, "pending")}
                  className="text-navy/55 hover:text-navy uppercase tracking-widest"
                >
                  Return to queue
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <p className="mt-8 text-xs text-navy/45">
        Moderation actions are illustrative — persistence will be wired to Dr. Chen's dashboard when the backend is enabled.
      </p>
    </div>
  );
}
