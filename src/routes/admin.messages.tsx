import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Btn, Chip, Badge } from "@/components/admin/primitives";
import { messages } from "@/data/admin";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Messages,
});

function Messages() {
  const [folder, setFolder] = useState("Inbox");
  const folders = ["Inbox", "Appointment Requests", "Billing", "Research", "Sent", "Archive"];
  const [selected, setSelected] = useState(messages[0]);
  const filtered = messages.filter((m) => folder === "Sent" ? m.from.startsWith("Dr.") : folder === "Archive" ? false : (folder === "Inbox" ? true : m.folder === folder));

  return (
    <div>
      <PageHeader eyebrow="Relations" title="Messages" description="Portal, email and internal messages — HIPAA-compliant channel." actions={<Btn>Compose</Btn>} />

      <div className="grid grid-cols-1 lg:grid-cols-[200px_360px_1fr] gap-4">
        <Panel title="Folders">
          <ul className="-m-4 divide-y divide-navy/10">
            {folders.map((f) => (
              <li key={f}>
                <button onClick={() => setFolder(f)} className={`w-full flex justify-between px-4 py-2.5 text-sm ${folder === f ? "text-navy bg-mist/50" : "text-navy/60 hover:text-navy hover:bg-mist/30"}`}>
                  <span>{f}</span>
                  <span className="text-[10px] text-navy/40">{messages.filter((m) => m.folder === f).length || (f === "Inbox" ? messages.length : 0)}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={folder}>
          <ul className="-m-4 divide-y divide-navy/10">
            {filtered.map((m) => (
              <li key={m.id}>
                <button onClick={() => setSelected(m)} className={`w-full text-left px-4 py-3 ${selected?.id === m.id ? "bg-mist/50" : "hover:bg-mist/30"}`}>
                  <div className="flex justify-between text-xs">
                    <span className={m.unread ? "text-navy font-medium" : "text-navy/70"}>{m.from}</span>
                    <span className="text-navy/40">{m.date}</span>
                  </div>
                  <div className={`text-sm mt-0.5 truncate ${m.unread ? "text-navy" : "text-navy/70"}`}>{m.subject}</div>
                  {m.priority === "High" && <div className="text-[10px] uppercase tracking-widest text-gold mt-1">Priority</div>}
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          {selected ? (
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="eyebrow text-navy/45">{selected.folder} · {selected.date}</div>
                  <h2 className="font-serif text-2xl text-navy mt-1">{selected.subject}</h2>
                  <div className="text-sm text-navy/60 mt-2">From <span className="text-navy">{selected.from}</span> · Patient <span className="text-navy">{selected.patient}</span></div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Btn variant="outline" size="sm">Archive</Btn>
                  <Btn size="sm">Reply</Btn>
                </div>
              </div>
              <div className="border-t border-navy/10 pt-4 text-sm text-navy/75 leading-relaxed space-y-3">
                <p>Hi Dr. Chen,</p>
                <p>Thank you for the follow-up. I wanted to confirm the timing for the new supplement protocol — should I take the magnesium in the evening as we discussed, or move it to the morning with breakfast?</p>
                <p>Also, my latest CGM values look stable. I've attached the export from the last two weeks for your review.</p>
                <p>Best,<br/>{selected.from}</p>
              </div>
              <div className="mt-6 border-t border-navy/10 pt-4">
                <div className="eyebrow text-navy/45 mb-2">Quick reply</div>
                <textarea rows={4} placeholder="Type your reply…" className="w-full border border-navy/15 bg-card p-3 text-sm outline-none focus:border-teal" />
                <div className="mt-3 flex flex-wrap gap-2 justify-end">
                  <Btn variant="outline" size="sm">Save draft</Btn>
                  <Btn size="sm">Send reply</Btn>
                </div>
              </div>
            </div>
          ) : <div className="p-8 text-center text-sm text-navy/50">Select a message.</div>}
        </Panel>
      </div>
    </div>
  );
}
