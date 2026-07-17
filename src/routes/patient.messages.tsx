import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, Disclaim, BtnPrimary, BtnGhost } from "./patient";
import { messages } from "@/data/patient";
import { Paperclip, Archive, Inbox, Send } from "lucide-react";

export const Route = createFileRoute("/patient/messages")({
  head: () => ({ meta: [{ title: "Messages — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: MessagesPage,
});

const FOLDERS = ["Inbox", "Care Team", "Appointments", "Billing", "Archived"] as const;

function MessagesPage() {
  const [folder, setFolder] = useState<(typeof FOLDERS)[number]>("Inbox");
  const [active, setActive] = useState(messages[0].id);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const conv = messages.find((m) => m.id === active);

  const send = () => {
    if (!reply.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setReply("");
      toast.success("Message sent (demo)");
    }, 700);
  };

  return (
    <div>
      <PortalPageHeader eyebrow="Communication" title="Messages" lede="Secure messaging with your care team." />

      <div className="grid lg:grid-cols-[220px_320px_1fr] gap-4 bg-card border border-navy/10 rounded-sm overflow-hidden min-h-[560px]">
        {/* Folders */}
        <aside className="border-b lg:border-b-0 lg:border-r border-navy/10 p-3">
          <div className="eyebrow text-navy/50 px-2 pb-2 text-[10px]">Folders</div>
          <ul className="space-y-0.5">
            {FOLDERS.map((f) => (
              <li key={f}>
                <button onClick={() => setFolder(f)} className={`w-full text-left px-3 py-2 text-sm rounded-sm flex items-center gap-2 ${folder === f ? "bg-mist text-navy" : "text-navy/65 hover:bg-mist/60"}`}>
                  {f === "Inbox" ? <Inbox size={13} /> : f === "Archived" ? <Archive size={13} /> : <span className="w-3" />}
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* List */}
        <div className="border-b lg:border-b-0 lg:border-r border-navy/10 overflow-y-auto">
          {messages.map((m) => (
            <button key={m.id} onClick={() => setActive(m.id)} className={`w-full text-left px-4 py-3 border-b border-navy/8 hover:bg-mist/40 ${active === m.id ? "bg-mist/60" : ""}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm ${m.unread ? "font-medium text-navy" : "text-navy/75"}`}>{m.from}</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-navy/50">{m.date}</span>
              </div>
              <div className={`text-sm mt-0.5 truncate ${m.unread ? "text-navy" : "text-navy/70"}`}>{m.subject}</div>
              <div className="text-xs text-navy/55 truncate">{m.preview}</div>
            </button>
          ))}
        </div>

        {/* Thread */}
        <div className="p-5 flex flex-col">
          {conv && (
            <>
              <div className="pb-4 border-b border-navy/10">
                <div className="font-serif text-xl text-navy">{conv.subject}</div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50 mt-1">{conv.from} · {conv.dept} · {conv.date}</div>
              </div>
              <div className="flex-1 py-4 text-sm text-navy/80 whitespace-pre-wrap leading-relaxed">{conv.body}</div>

              <div className="border-t border-navy/10 pt-4">
                <Disclaim>Do not use portal messaging for emergencies or urgent medical situations. Messages may not be reviewed immediately and do not replace a medical appointment.</Disclaim>
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} placeholder="Write a reply…" className="mt-3 w-full border border-navy/15 rounded-sm p-3 text-sm outline-none focus:border-teal" />
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <BtnGhost className="!py-2"><Paperclip size={13} /> Attach</BtnGhost>
                  <BtnGhost className="!py-2" onClick={() => toast("Marked unread (demo)")}>Mark unread</BtnGhost>
                  <BtnGhost className="!py-2" onClick={() => toast("Archived (demo)")}>Archive</BtnGhost>
                  <BtnPrimary className="ml-auto" disabled={sending || !reply.trim()} onClick={send}>
                    {sending ? "Sending…" : <><Send size={13} /> Send reply</>}
                  </BtnPrimary>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
