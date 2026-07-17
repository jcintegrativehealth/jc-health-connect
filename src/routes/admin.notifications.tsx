import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Chip, Btn } from "@/components/admin/primitives";
import { notifications } from "@/data/admin";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Notifications,
});

function Notifications() {
  const [filter, setFilter] = useState("All");
  const rows = notifications.filter((n) => filter === "All" || n.type === filter.toLowerCase());
  return (
    <div>
      <PageHeader eyebrow="Operations" title="Notifications" description="All activity from across the clinic — appointments, messages, labs, billing, research." actions={<Btn variant="outline">Mark all read</Btn>} />
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Appointment", "Message", "Lab", "Billing", "Research", "Task"].map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
      </div>
      <Panel>
        <ul className="divide-y divide-navy/10 -m-4">
          {rows.map((n) => (
            <li key={n.id} className="flex items-start gap-3 px-4 py-3">
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${n.read ? "bg-navy/20" : "bg-gold"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-navy">{n.text}</div>
                <div className="text-[10px] uppercase tracking-widest text-navy/45 mt-0.5">{n.type} · {n.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
