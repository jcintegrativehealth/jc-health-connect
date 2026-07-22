import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Btn, Chip } from "@/components/admin/primitives";
import { tasks } from "@/data/admin";

export const Route = createFileRoute("/_authenticated/admin/tasks")({
  head: () => ({ meta: [{ title: "Tasks — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Tasks,
});

function Tasks() {
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const rows = tasks.filter((t) =>
    (status === "All" || t.status === status) && (priority === "All" || t.priority === priority)
  );

  return (
    <div>
      <PageHeader eyebrow="Operations" title="Tasks" description="Personal task list for Dr. Chen and staff." actions={<Btn>New task</Btn>} />

      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "To Do", "In Progress", "Waiting", "In Review"].map((s) => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>)}
        <span className="mx-2 h-4 w-px bg-navy/15" />
        {["All", "Urgent", "High", "Medium", "Low"].map((p) => <Chip key={p} active={priority === p} onClick={() => setPriority(p)}>{p}</Chip>)}
      </div>

      <Panel>
        <ul className="divide-y divide-navy/10 -m-4">
          {rows.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <input type="checkbox" checked={!!done[t.id]} onChange={() => setDone((d) => ({ ...d, [t.id]: !d[t.id] }))} className="h-4 w-4 accent-teal" />
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${done[t.id] ? "text-navy/40 line-through" : "text-navy"} truncate`}>{t.title}</div>
                <div className="text-[10px] uppercase tracking-widest text-navy/45 mt-0.5">{t.cat} · Due {t.due} · {t.status}</div>
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-semibold ${t.priority === "High" ? "text-gold" : t.priority === "Urgent" ? "text-destructive" : "text-navy/45"}`}>{t.priority}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
