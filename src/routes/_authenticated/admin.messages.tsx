import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel, Btn } from "@/components/admin/primitives";
import {
  listMessageThreadsFn,
  listThreadFn,
  sendStaffMessageFn,
  markThreadReadFn,
  type Message,
  type MessageThread,
} from "@/lib/messages.functions";
import { formatTimestamp } from "@/lib/datetime";
import { Loader2, Send, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Messages,
});

function Messages() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  async function loadThreads() {
    setLoading(true);
    try {
      const rows = await listMessageThreadsFn();
      setThreads(rows);
      setError(null);
      setActiveId((cur) => cur ?? rows[0]?.patientId ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load messages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadThreads();
  }, []);

  const active = threads.find((t) => t.patientId === activeId) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Relations"
        title="Messages"
        description="Secure in-platform messaging with patients. Patients are notified by email when you reply."
        actions={<Btn variant="outline" onClick={loadThreads}><RefreshCw size={13} /> Refresh</Btn>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
        <Panel title={`Conversations${threads.length ? ` · ${threads.length}` : ""}`}>
          <div className="-m-4">
            {loading ? (
              <div className="p-8 text-center text-sm text-navy/50"><Loader2 size={14} className="inline animate-spin mr-2" /> Loading…</div>
            ) : error ? (
              <div className="p-8 text-center text-sm text-navy/60">{error}</div>
            ) : threads.length === 0 ? (
              <div className="p-8 text-center text-sm text-navy/50">No conversations yet.</div>
            ) : (
              <ul className="divide-y divide-navy/10">
                {threads.map((t) => (
                  <li key={t.patientId}>
                    <button
                      onClick={() => setActiveId(t.patientId)}
                      className={`w-full text-left px-4 py-3 ${activeId === t.patientId ? "bg-mist/50" : "hover:bg-mist/30"}`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-sm ${t.unreadCount ? "font-semibold text-navy" : "text-navy/75"}`}>{t.patientName}</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-navy/40">{formatTimestamp(t.lastAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs truncate flex-1 ${t.unreadCount ? "text-navy" : "text-navy/55"}`}>
                          {t.lastSenderRole === "staff" ? "You: " : ""}{t.lastBody}
                        </span>
                        {t.unreadCount > 0 && (
                          <span className="shrink-0 text-[10px] font-semibold text-paper bg-gold rounded-full px-1.5 py-0.5 leading-none">{t.unreadCount}</span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>

        {active ? (
          <Conversation
            key={active.patientId}
            thread={active}
            onSent={loadThreads}
            onRead={loadThreads}
          />
        ) : (
          <Panel><div className="p-8 text-center text-sm text-navy/50">Select a conversation.</div></Panel>
        )}
      </div>
    </div>
  );
}

function Conversation({ thread, onSent, onRead }: { thread: MessageThread; onSent: () => void; onRead: () => void }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setMessages(null);
    listThreadFn({ data: { patientId: thread.patientId } })
      .then((rows) => {
        if (cancelled) return;
        setMessages(rows);
        if (thread.unreadCount > 0) {
          markThreadReadFn({ data: { patientId: thread.patientId } }).then(onRead).catch(() => {});
        }
      })
      .catch(() => { if (!cancelled) setMessages([]); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.patientId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  async function send() {
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const msg = await sendStaffMessageFn({ data: { patientId: thread.patientId, body: text } });
      setMessages((prev) => [...(prev ?? []), msg]);
      setBody("");
      onSent();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send the message");
    } finally {
      setSending(false);
    }
  }

  return (
    <Panel>
      <div className="-m-4 flex flex-col h-[600px]">
        <div className="px-4 py-3 border-b border-navy/10">
          <div className="font-serif text-lg text-navy">{thread.patientName}</div>
          {thread.patientEmail && <div className="text-[11px] font-mono uppercase tracking-widest text-navy/45">{thread.patientEmail}</div>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages === null ? (
            <div className="h-full grid place-items-center text-sm text-navy/50"><Loader2 size={14} className="animate-spin" /></div>
          ) : messages.length === 0 ? (
            <div className="h-full grid place-items-center text-sm text-navy/50">No messages in this conversation.</div>
          ) : (
            messages.map((m) => <Bubble key={m.id} m={m} />)
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-navy/10 p-3 flex items-end gap-2 bg-card">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void send(); } }}
            rows={2}
            placeholder="Type your reply… (⌘/Ctrl+Enter to send)"
            className="flex-1 border border-navy/15 bg-card p-3 text-sm outline-none focus:border-teal resize-none"
          />
          <Btn disabled={sending || !body.trim()} onClick={send}>
            {sending ? <Loader2 size={13} className="animate-spin" /> : <><Send size={13} /> Send</>}
          </Btn>
        </div>
      </div>
    </Panel>
  );
}

function Bubble({ m }: { m: Message }) {
  const staff = m.senderRole === "staff";
  return (
    <div className={`flex ${staff ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-sm px-4 py-2.5 ${staff ? "bg-navy text-paper" : "bg-mist text-navy border border-navy/10"}`}>
        <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${staff ? "text-paper/55" : "text-navy/45"}`}>
          {staff ? "Clinic" : "Patient"} · {formatTimestamp(m.createdAt)}
        </div>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.body}</div>
      </div>
    </div>
  );
}
