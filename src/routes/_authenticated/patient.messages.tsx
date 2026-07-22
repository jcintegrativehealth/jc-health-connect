import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, Disclaim, BtnPrimary } from "./patient";
import { listMyThreadFn, sendMyMessageFn, markMyThreadReadFn, type Message } from "@/lib/messages.functions";
import { formatTimestamp } from "@/lib/datetime";
import { Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/messages")({
  head: () => ({ meta: [{ title: "Messages — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function load(markRead: boolean) {
    try {
      const rows = await listMyThreadFn();
      setMessages(rows);
      setError(null);
      if (markRead && rows.some((m) => m.senderRole === "staff" && !m.readAt)) {
        markMyThreadReadFn().catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your messages.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(true);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send() {
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const msg = await sendMyMessageFn({ data: { body: text } });
      setMessages((prev) => [...prev, msg]);
      setBody("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <PortalPageHeader eyebrow="Communication" title="Messages" lede="Secure messaging with your care team." />

      <PortalCard className="!p-0 overflow-hidden">
        <div className="flex flex-col h-[560px]">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {loading ? (
              <div className="h-full grid place-items-center text-sm text-navy/50">
                <span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Loading…</span>
              </div>
            ) : error ? (
              <div className="h-full grid place-items-center text-sm text-navy/60">{error}</div>
            ) : messages.length === 0 ? (
              <div className="h-full grid place-items-center text-center">
                <div>
                  <div className="eyebrow text-navy/50 mb-2">No messages yet</div>
                  <p className="text-sm text-navy/55 max-w-xs">Send a message below and your care team will respond during business hours.</p>
                </div>
              </div>
            ) : (
              messages.map((m) => <Bubble key={m.id} m={m} />)
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-navy/10 p-4 bg-card">
            <Disclaim>Do not use messaging for emergencies or urgent medical situations. Messages are reviewed during business hours and do not replace a visit.</Disclaim>
            <div className="mt-3 flex items-end gap-2">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void send(); } }}
                rows={2}
                placeholder="Write a message…"
                className="flex-1 border border-navy/15 rounded-sm p-3 text-sm outline-none focus:border-teal resize-none"
              />
              <BtnPrimary disabled={sending || !body.trim()} onClick={send}>
                {sending ? <Loader2 size={13} className="animate-spin" /> : <><Send size={13} /> Send</>}
              </BtnPrimary>
            </div>
          </div>
        </div>
      </PortalCard>
    </div>
  );
}

function Bubble({ m }: { m: Message }) {
  const mine = m.senderRole === "patient";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] rounded-sm px-4 py-2.5 ${mine ? "bg-navy text-paper" : "bg-mist text-navy border border-navy/10"}`}>
        <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${mine ? "text-paper/55" : "text-navy/45"}`}>
          {mine ? "You" : "Care team"} · {formatTimestamp(m.createdAt)}
        </div>
        <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.body}</div>
      </div>
    </div>
  );
}
