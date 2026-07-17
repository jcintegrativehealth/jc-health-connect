import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PageHeader, Panel, Btn, Chip, Badge } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/comments")({
  head: () => ({ meta: [{ title: "Comments — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Comments,
});

type Status = "Pending" | "Approved" | "Rejected";
type C = { id: string; author: string; article: string; date: string; body: string; status: Status };

const seed: C[] = [
  { id: "c1", author: "Julia F.", article: "Rethinking mTOR modulation in longevity practice", date: "2h", body: "Thank you for such a clear synthesis — could you comment on the timing of protein intake relative to the discussed protocols?", status: "Pending" },
  { id: "c2", author: "Anthony W.", article: "Adaptogens: an evidence-based framework", date: "5h", body: "Would love to see a follow-up on rhodiola dosing in athletic populations.", status: "Pending" },
  { id: "c3", author: "David C.", article: "Rethinking mTOR modulation in longevity practice", date: "1d", body: "Great overview. Any thoughts on autophagy markers we can track clinically?", status: "Pending" },
  { id: "c4", author: "Priya N.", article: "Continuous glucose monitoring beyond diabetes", date: "2d", body: "Very useful — thank you.", status: "Approved" },
  { id: "c5", author: "Anonymous", article: "Adaptogens: an evidence-based framework", date: "3d", body: "Marketing text removed by moderator.", status: "Rejected" },
];

// Simulated latency + occasional failure so the loading + error UX is exercisable.
function simulate(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // ~12% failure rate
      if (Math.random() < 0.12) reject(new Error("Network error — could not reach moderation service."));
      else resolve();
    }, 650 + Math.random() * 500);
  });
}

const ACTION_COPY: Record<Status, { verb: string; toast: string; toastDesc: string }> = {
  Approved: { verb: "Approving", toast: "Comment approved & published", toastDesc: "Now visible on the article." },
  Rejected: { verb: "Rejecting", toast: "Comment rejected", toastDesc: "Hidden from the public article." },
  Pending: { verb: "Returning", toast: "Returned to queue", toastDesc: "Awaiting moderation again." },
};

function Comments() {
  const [comments, setComments] = useState(seed);
  const [tab, setTab] = useState<Status>("Pending");
  const [busy, setBusy] = useState<Record<string, Status | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const rows = comments.filter((c) => c.status === tab);
  const counts = { Pending: 0, Approved: 0, Rejected: 0 } as Record<Status, number>;
  comments.forEach((c) => counts[c.status]++);

  const setStatus = (id: string, status: Status) =>
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const runAction = async (comment: C, next: Status) => {
    const prevStatus = comment.status;
    setErrors((e) => ({ ...e, [comment.id]: undefined }));
    setBusy((b) => ({ ...b, [comment.id]: next }));

    // Optimistic loading toast
    const toastId = toast.loading(`${ACTION_COPY[next].verb} comment from ${comment.author}…`);

    try {
      await simulate();
      setStatus(comment.id, next);
      toast.success(ACTION_COPY[next].toast, {
        id: toastId,
        description: ACTION_COPY[next].toastDesc,
        action: {
          label: "Undo",
          onClick: () => {
            setStatus(comment.id, prevStatus);
            toast("Reverted", { description: `Restored to ${prevStatus.toLowerCase()}.` });
          },
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrors((e) => ({ ...e, [comment.id]: msg }));
      toast.error(`${next === "Approved" ? "Approval" : next === "Rejected" ? "Rejection" : "Return"} failed`, {
        id: toastId,
        description: msg,
        action: { label: "Retry", onClick: () => void runAction(comment, next) },
      });
    } finally {
      setBusy((b) => ({ ...b, [comment.id]: undefined }));
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Editorial" title="Comments" description="Moderate patient discussion on research articles. All comments require approval by Dr. Chen before appearing publicly." />

      <div className="flex flex-wrap gap-2 mb-4">
        {(["Pending", "Approved", "Rejected"] as const).map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t} · {counts[t]}</Chip>
        ))}
      </div>

      <Panel>
        <ul className="divide-y divide-navy/10 -m-4">
          {rows.length === 0 && (
            <li className="p-12 text-center text-sm text-navy/45">No comments in this queue.</li>
          )}
          {rows.map((c) => {
            const busyAs = busy[c.id];
            const isBusy = Boolean(busyAs);
            const error = errors[c.id];
            return (
              <li key={c.id} className={`px-4 py-4 transition-opacity ${isBusy ? "opacity-70" : ""}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full border border-navy/15 grid place-items-center text-[10px] font-semibold text-navy">
                      {c.author.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm text-navy">{c.author}</div>
                      <div className="text-[10px] uppercase tracking-widest text-navy/45">{c.date}</div>
                    </div>
                  </div>
                  <Badge tone={c.status === "Pending" ? "In Review" : c.status === "Approved" ? "Approved" : "Cancelled"}>
                    {c.status}
                  </Badge>
                </div>

                <div className="mt-3 text-sm text-navy/80 leading-relaxed border-l-2 border-navy/10 pl-3">{c.body}</div>
                <div className="mt-2 text-[11px] uppercase tracking-widest text-navy/45">On: {c.article}</div>

                {isBusy && (
                  <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-navy/55">
                    <Loader2 size={12} className="animate-spin" />
                    <span>{ACTION_COPY[busyAs!].verb}…</span>
                  </div>
                )}

                {error && !isBusy && (
                  <div className="mt-3 border border-terracotta/40 bg-terracotta/5 px-3 py-2 text-xs text-terracotta flex flex-wrap items-center justify-between gap-2">
                    <span>{error}</span>
                    <button
                      type="button"
                      className="underline underline-offset-2 text-[11px] uppercase tracking-widest"
                      onClick={() => setErrors((e) => ({ ...e, [c.id]: undefined }))}
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {c.status === "Pending" && (
                  <div className="mt-3 flex flex-wrap gap-2 justify-end">
                    <Btn variant="outline" size="sm" disabled={isBusy} onClick={() => runAction(c, "Rejected")}>
                      {busyAs === "Rejected" ? "Rejecting…" : "Reject"}
                    </Btn>
                    <Btn size="sm" disabled={isBusy} onClick={() => runAction(c, "Approved")}>
                      {busyAs === "Approved" ? "Approving…" : "Approve & publish"}
                    </Btn>
                  </div>
                )}
                {c.status !== "Pending" && (
                  <div className="mt-3 flex justify-end">
                    <Btn variant="ghost" size="sm" disabled={isBusy} onClick={() => runAction(c, "Pending")}>
                      {busyAs === "Pending" ? "Returning…" : "Return to queue"}
                    </Btn>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}
