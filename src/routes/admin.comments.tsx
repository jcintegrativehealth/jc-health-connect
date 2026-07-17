import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Btn, Chip, Badge } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/comments")({
  head: () => ({ meta: [{ title: "Comments — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Comments,
});

type C = { id: string; author: string; article: string; date: string; body: string; status: "Pending" | "Approved" | "Rejected" };

const seed: C[] = [
  { id: "c1", author: "Julia F.", article: "Rethinking mTOR modulation in longevity practice", date: "2h", body: "Thank you for such a clear synthesis — could you comment on the timing of protein intake relative to the discussed protocols?", status: "Pending" },
  { id: "c2", author: "Anthony W.", article: "Adaptogens: an evidence-based framework", date: "5h", body: "Would love to see a follow-up on rhodiola dosing in athletic populations.", status: "Pending" },
  { id: "c3", author: "David C.", article: "Rethinking mTOR modulation in longevity practice", date: "1d", body: "Great overview. Any thoughts on autophagy markers we can track clinically?", status: "Pending" },
  { id: "c4", author: "Priya N.", article: "Continuous glucose monitoring beyond diabetes", date: "2d", body: "Very useful — thank you.", status: "Approved" },
  { id: "c5", author: "Anonymous", article: "Adaptogens: an evidence-based framework", date: "3d", body: "Marketing text removed by moderator.", status: "Rejected" },
];

function Comments() {
  const [comments, setComments] = useState(seed);
  const [tab, setTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const rows = comments.filter((c) => c.status === tab);
  const counts = { Pending: 0, Approved: 0, Rejected: 0 } as Record<C["status"], number>;
  comments.forEach((c) => counts[c.status]++);

  const setStatus = (id: string, status: C["status"]) => setComments((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));

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
          {rows.length === 0 && <li className="p-12 text-center text-sm text-navy/45">No comments in this queue.</li>}
          {rows.map((c) => (
            <li key={c.id} className="px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full border border-navy/15 grid place-items-center text-[10px] font-semibold text-navy">{c.author.split(" ").map((s: string) => s[0]).join("")}</div>
                  <div>
                    <div className="text-sm text-navy">{c.author}</div>
                    <div className="text-[10px] uppercase tracking-widest text-navy/45">{c.date}</div>
                  </div>
                </div>
                <Badge tone={c.status === "Pending" ? "In Review" : c.status === "Approved" ? "Approved" : "Cancelled"}>{c.status}</Badge>
              </div>
              <div className="mt-3 text-sm text-navy/80 leading-relaxed border-l-2 border-navy/10 pl-3">{c.body}</div>
              <div className="mt-2 text-[11px] uppercase tracking-widest text-navy/45">On: {c.article}</div>
              {c.status === "Pending" && (
                <div className="mt-3 flex flex-wrap gap-2 justify-end">
                  <Btn variant="outline" size="sm" onClick={() => setStatus(c.id, "Rejected")}>Reject</Btn>
                  <Btn size="sm" onClick={() => setStatus(c.id, "Approved")}>Approve &amp; publish</Btn>
                </div>
              )}
              {c.status !== "Pending" && (
                <div className="mt-3 flex justify-end"><Btn variant="ghost" size="sm" onClick={() => setStatus(c.id, "Pending")}>Return to queue</Btn></div>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
