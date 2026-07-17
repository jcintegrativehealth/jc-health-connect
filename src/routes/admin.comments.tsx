import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Search, X } from "lucide-react";
import { PageHeader, Panel, Btn, Chip, Badge, Pagination } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/comments")({
  head: () => ({ meta: [{ title: "Comments — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Comments,
});

type Status = "Pending" | "Approved" | "Rejected";
type C = { id: string; author: string; article: string; date: string; ageHours: number; body: string; status: Status };

const seed: C[] = [
  { id: "c1", author: "Julia F.", article: "Rethinking mTOR modulation in longevity practice", date: "2h", ageHours: 2, body: "Thank you for such a clear synthesis — could you comment on the timing of protein intake relative to the discussed protocols?", status: "Pending" },
  { id: "c2", author: "Anthony W.", article: "Adaptogens: an evidence-based framework", date: "5h", ageHours: 5, body: "Would love to see a follow-up on rhodiola dosing in athletic populations.", status: "Pending" },
  { id: "c3", author: "David C.", article: "Rethinking mTOR modulation in longevity practice", date: "1d", ageHours: 24, body: "Great overview. Any thoughts on autophagy markers we can track clinically?", status: "Pending" },
  { id: "c4", author: "Priya N.", article: "Continuous glucose monitoring beyond diabetes", date: "2d", ageHours: 48, body: "Very useful — thank you.", status: "Approved" },
  { id: "c5", author: "Anonymous", article: "Adaptogens: an evidence-based framework", date: "3d", ageHours: 72, body: "Marketing text removed by moderator.", status: "Rejected" },
  { id: "c6", author: "Marcus L.", article: "Continuous glucose monitoring beyond diabetes", date: "6h", ageHours: 6, body: "Do you recommend a specific CGM brand for non-diabetic monitoring?", status: "Pending" },
  { id: "c7", author: "Elena R.", article: "Sleep architecture and metabolic health", date: "12h", ageHours: 12, body: "The section on REM fragmentation was excellent. Any protocols for shift workers?", status: "Pending" },
  { id: "c8", author: "Kenji T.", article: "Sleep architecture and metabolic health", date: "1d", ageHours: 30, body: "Curious about magnesium threonate dosing timing.", status: "Pending" },
  { id: "c9", author: "Sofia B.", article: "Rethinking mTOR modulation in longevity practice", date: "4d", ageHours: 96, body: "Excellent piece — shared with my colleagues.", status: "Approved" },
  { id: "c10", author: "Robert H.", article: "Adaptogens: an evidence-based framework", date: "5d", ageHours: 120, body: "Would appreciate references section expanded.", status: "Approved" },
  { id: "c11", author: "Anonymous", article: "Continuous glucose monitoring beyond diabetes", date: "6d", ageHours: 144, body: "Off-topic promotional content.", status: "Rejected" },
  { id: "c12", author: "Aisha M.", article: "Sleep architecture and metabolic health", date: "8h", ageHours: 8, body: "Is there evidence for weighted blankets in adult populations?", status: "Pending" },
  { id: "c13", author: "Thomas G.", article: "Rethinking mTOR modulation in longevity practice", date: "2d", ageHours: 52, body: "How does rapamycin cycling compare to caloric restriction protocols?", status: "Pending" },
  { id: "c14", author: "Lin Q.", article: "Continuous glucose monitoring beyond diabetes", date: "3d", ageHours: 76, body: "Fascinating data on postprandial variability.", status: "Approved" },
];

function simulate(): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
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

type AgeFilter = "any" | "24h" | "7d";
const PAGE_SIZE = 5;

function Comments() {
  const [comments, setComments] = useState(seed);
  const [tab, setTab] = useState<Status>("Pending");
  const [busy, setBusy] = useState<Record<string, Status | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [query, setQuery] = useState("");
  const [article, setArticle] = useState<string>("all");
  const [age, setAge] = useState<AgeFilter>("any");
  const [page, setPage] = useState(1);

  const articles = useMemo(
    () => Array.from(new Set(comments.map((c) => c.article))).sort(),
    [comments]
  );

  const counts = { Pending: 0, Approved: 0, Rejected: 0 } as Record<Status, number>;
  comments.forEach((c) => counts[c.status]++);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const maxAge = age === "24h" ? 24 : age === "7d" ? 24 * 7 : Infinity;
    return comments.filter((c) => {
      if (c.status !== tab) return false;
      if (article !== "all" && c.article !== article) return false;
      if (c.ageHours > maxAge) return false;
      if (q && !(`${c.author} ${c.article} ${c.body}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [comments, tab, article, age, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);
  const hasFilters = query || article !== "all" || age !== "any";

  const setStatus = (id: string, status: Status) =>
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const runAction = async (comment: C, next: Status) => {
    const prevStatus = comment.status;
    setErrors((e) => ({ ...e, [comment.id]: undefined }));
    setBusy((b) => ({ ...b, [comment.id]: next }));
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
          <Chip key={t} active={tab === t} onClick={() => { setTab(t); resetPage(); }}>{t} · {counts[t]}</Chip>
        ))}
      </div>

      {/* Search + filters */}
      <div className="border border-navy/10 bg-paper mb-4">
        <div className="flex flex-wrap items-center gap-3 p-3 border-b border-navy/10">
          <label className="flex items-center gap-2 h-9 border border-navy/15 bg-card px-3 min-w-0 flex-1 sm:max-w-sm">
            <Search size={13} strokeWidth={1.5} className="text-navy/40 shrink-0" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetPage(); }}
              placeholder="Search author, article, or text…"
              className="bg-transparent w-full text-sm outline-none placeholder:text-navy/40"
            />
            {query && (
              <button onClick={() => { setQuery(""); resetPage(); }} className="text-navy/40 hover:text-navy shrink-0" aria-label="Clear search">
                <X size={13} strokeWidth={1.5} />
              </button>
            )}
          </label>
          {hasFilters && (
            <button
              onClick={() => { setQuery(""); setArticle("all"); setAge("any"); resetPage(); }}
              className="text-[11px] uppercase tracking-widest text-navy/55 hover:text-navy"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 p-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.24em] text-navy/45">Article</span>
            <select
              value={article}
              onChange={(e) => { setArticle(e.target.value); resetPage(); }}
              className="h-8 border border-navy/15 bg-card px-2 text-xs text-navy outline-none focus:border-navy/40 max-w-[240px] truncate"
            >
              <option value="all">All articles</option>
              {articles.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.24em] text-navy/45">Age</span>
            {(["any", "24h", "7d"] as const).map((a) => (
              <Chip key={a} active={age === a} onClick={() => { setAge(a); resetPage(); }}>
                {a === "any" ? "Any time" : a === "24h" ? "Last 24h" : "Last 7 days"}
              </Chip>
            ))}
          </div>
          <div className="ml-auto text-[11px] uppercase tracking-widest text-navy/45">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <Panel>
        <ul className="divide-y divide-navy/10 -m-4">
          {pageRows.length === 0 && (
            <li className="p-12 text-center text-sm text-navy/45">
              {hasFilters ? "No comments match these filters." : "No comments in this queue."}
            </li>
          )}
          {pageRows.map((c) => {
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
                  <div className="mt-3 border border-gold/40 bg-gold/5 px-3 py-2 text-xs text-gold flex flex-wrap items-center justify-between gap-2">
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

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 py-3 border border-t-0 border-navy/10 bg-paper text-xs text-navy/55">
          <span>Page {safePage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              className="h-7 px-3 border border-navy/15 hover:border-navy/40 disabled:opacity-40 disabled:hover:border-navy/15"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >Prev</button>
            <button
              className="h-7 px-3 border border-navy/15 hover:border-navy/40 disabled:opacity-40 disabled:hover:border-navy/15"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
