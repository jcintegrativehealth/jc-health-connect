import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, StatusPill, BtnGhost } from "./patient";
import { notifications as seed } from "@/data/patient";

export const Route = createFileRoute("/patient/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState("All");
  const types = ["All", ...Array.from(new Set(items.map((n) => n.type)))];

  const filtered = items.filter((n) => filter === "All" || n.type === filter);
  const markAll = () => { setItems((p) => p.map((n) => ({ ...n, unread: false }))); toast("All notifications marked as read"); };
  const markRead = (id: string) => setItems((p) => p.map((n) => n.id === id ? { ...n, unread: false } : n));

  return (
    <div>
      <PortalPageHeader eyebrow="Alerts" title="Notifications" lede="Recent alerts about your appointments, labs, care plan and account." actions={<BtnGhost onClick={markAll}>Mark all as read</BtnGhost>} />

      <div className="flex flex-wrap gap-2 mb-4">
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-sm border ${filter === t ? "border-gold bg-gold/10 text-navy" : "border-navy/15 text-navy/60 hover:text-navy"}`}>{t}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <PortalCard><div className="py-10 text-center text-sm text-navy/55">No notifications.</div></PortalCard>
      ) : (
        <PortalCard>
          <ul className="divide-y divide-navy/10">
            {filtered.map((n) => (
              <li key={n.id} className="py-3 flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${n.unread ? "bg-gold" : "bg-navy/15"}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm ${n.unread ? "text-navy" : "text-navy/65"}`}>{n.label}</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50">{n.type} · {n.date}</div>
                </div>
                <StatusPill tone={n.unread ? "warn" : "neutral"}>{n.unread ? "New" : "Read"}</StatusPill>
                <button onClick={() => markRead(n.id)} className="text-[11px] font-mono uppercase tracking-widest text-navy/60 hover:text-navy">Mark read</button>
                <Link to="/patient" className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy">Open</Link>
              </li>
            ))}
          </ul>
        </PortalCard>
      )}
    </div>
  );
}
