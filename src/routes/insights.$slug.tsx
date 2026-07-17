import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { articles } from "@/data/site";
import { Container, Disclaimer } from "@/components/site/primitives";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const a = articles.find((x) => x.slug === params.slug);
    if (!a) throw notFound();
    return { article: a };
  },
  head: ({ loaderData, params }) => loaderData ? ({
    meta: [
      { title: `${loaderData.article.title} — JC Health Insights` },
      { name: "description", content: loaderData.article.summary },
      { property: "og:title", content: loaderData.article.title },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/insights/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/insights/${params.slug}` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: loaderData.article.title,
        author: { "@type": "Person", name: loaderData.article.author },
        datePublished: loaderData.article.date,
      }),
    }],
  }) : ({ meta: [{ title: "Article" }, { name: "robots", content: "noindex" }] }),
  component: ArticleDetail,
  notFoundComponent: () => <Container className="py-24"><h1 className="font-serif text-4xl">Article not found</h1></Container>,
});

function ArticleDetail() {
  const { article } = Route.useLoaderData();
  return (
    <div>
      <Container className="pt-20 pb-8">
        <div className="eyebrow text-navy/45 mb-4"><Link to="/insights" className="hover:text-navy">Insights</Link> / {article.category}</div>
      </Container>

      <article>
        <Container className="pb-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-navy/45 mb-6">
              <span className="px-2 py-0.5 border border-teal text-teal">{article.category}</span>
              <span>{article.type}</span>
              <span>Evidence: {article.evidence}</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy leading-[1.05]">{article.title}</h1>
            <p className="mt-6 text-lg text-navy/65 text-pretty">{article.summary}</p>
            <div className="mt-8 flex items-center justify-between text-xs text-navy/50 border-t border-b border-navy/10 py-4">
              <div>{article.author} · {new Date(article.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
              <div>{article.readMinutes} min read</div>
            </div>
          </div>
        </Container>

        <Container className="pb-16">
          <div className="grid lg:grid-cols-[1fr_240px] gap-16 pt-8">
            <div className="max-w-3xl space-y-6 text-navy/75 leading-[1.8] font-serif text-[1.125rem]">
              {article.body.map((p: string, i: number) => <p key={i}>{p}</p>)}
              <h2 className="font-serif text-2xl text-navy mt-10">Key findings</h2>
              <ul className="text-base list-disc pl-5 space-y-2 font-sans text-navy/70">
                <li>Effect sizes vary substantially across studies.</li>
                <li>Applicability to healthy adults remains contingent on further evidence.</li>
                <li>Careful monitoring is warranted when interventions are used off-label.</li>
              </ul>
              <h2 className="font-serif text-2xl text-navy mt-10">Clinical context</h2>
              <p className="font-sans text-base text-navy/70">Recommendations should always be considered within the individual patient's clinical picture.</p>
              <h2 className="font-serif text-2xl text-navy mt-10">Limitations</h2>
              <p className="font-sans text-base text-navy/70">Publication bias, heterogeneous protocols, and short follow-up limit strong conclusions.</p>
              <h2 className="font-serif text-2xl text-navy mt-10">References</h2>
              <ol className="text-sm font-sans text-navy/60 list-decimal pl-5 space-y-1">
                <li>Author et al. Journal Placeholder. Year. Volume, Pages.</li>
                <li>Author et al. Journal Placeholder. Year. Volume, Pages.</li>
              </ol>

              <div className="mt-10"><Disclaimer>Content is educational and is not medical advice.</Disclaimer></div>
            </div>

            <aside className="space-y-8">
              <ReactionBar />
              <div>
                <div className="eyebrow text-navy/50 mb-3">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((t: string) => (
                    <span key={t} className="text-[11px] px-2 py-1 bg-mist text-navy/70 font-mono uppercase">{t}</span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>

        {/* Clinical discussion */}
        <section className="bg-mist/40 py-20">
          <Container>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold mb-3">Clinical Discussion</div>
              <h2 className="font-serif text-3xl md:text-4xl text-navy">Comments</h2>
              <p className="mt-3 text-sm text-navy/60">Sorted by most relevant · Moderated by editorial staff.</p>

              <div className="mt-10 space-y-8">
                <Comment name="Dr. Amelia Park" title="Endocrinology · Verified physician" date="3 days ago" verified>
                  A helpful synthesis. The point about study heterogeneity is well-taken; I would add that endpoint selection remains a common weakness in this literature.
                </Comment>
                <Comment name="Editor" title="Editorial team" date="2 days ago" editor>
                  Approved. Related references added under "References."
                </Comment>
                <Comment name="Dr. Rafael Mendez" title="Cardiology · Verified physician" date="1 day ago" verified>
                  Agree on the caution around off-label use in otherwise healthy adults.
                </Comment>
                <Comment name="Anonymous" title="Awaiting moderation" date="just now" pending>
                  [Comment awaiting moderation]
                </Comment>
              </div>

              <CommentBox />
            </div>
          </Container>
        </section>
      </article>
    </div>
  );
}

function ReactionBar() {
  const [state, setState] = useState({ helpful: false, insightful: false, wellReferenced: false, saved: false });
  const btn = (k: keyof typeof state, label: string) => (
    <button
      onClick={() => setState((s) => ({ ...s, [k]: !s[k] }))}
      className={`flex items-center justify-between w-full text-left px-4 py-3 border ${state[k] ? "border-teal bg-teal/5 text-teal" : "border-navy/10 text-navy/70 hover:border-teal/40"} transition-colors`}
    >
      <span className="text-sm">{label}</span>
      <span className="font-mono text-[10px]">{state[k] ? "✓" : "+"}</span>
    </button>
  );
  return (
    <div>
      <div className="eyebrow text-navy/50 mb-3">Reactions</div>
      <div className="space-y-2">
        {btn("helpful", "Helpful")}
        {btn("insightful", "Insightful")}
        {btn("wellReferenced", "Well Referenced")}
        {btn("saved", "Save")}
      </div>
    </div>
  );
}

function Comment({ name, title, date, children, verified, editor, pending }: { name: string; title: string; date: string; children: React.ReactNode; verified?: boolean; editor?: boolean; pending?: boolean }) {
  return (
    <div className={`p-6 border-l-2 ${verified ? "border-teal bg-paper" : editor ? "border-gold bg-paper" : pending ? "border-navy/20 bg-paper/60" : "border-navy/10 bg-paper"}`}>
      <div className="flex flex-wrap items-baseline gap-3 mb-3">
        <span className="font-medium text-navy">{name}</span>
        {verified && <span className="text-[10px] font-semibold uppercase tracking-widest text-teal">Verified Physician</span>}
        {editor && <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">Editor</span>}
        {pending && <span className="text-[10px] font-semibold uppercase tracking-widest text-navy/40">Awaiting Moderation</span>}
        <span className="text-xs text-navy/45 ml-auto">{date}</span>
      </div>
      <div className="text-sm text-navy/70 leading-relaxed">{children}</div>
      <div className="mt-3 flex gap-4 text-[11px] text-navy/40 font-mono uppercase">
        <button className="hover:text-navy">Reply</button>
        <button className="hover:text-navy">Add Reference</button>
        <button className="hover:text-navy">Report</button>
      </div>
    </div>
  );
}

type CommentStatus = "submitted" | "pending" | "approved" | "rejected";
type HistoryEntry = { status: CommentStatus; label: string; detail: string; at: Date };

const STATUS_META: Record<CommentStatus, { label: string; tone: string; dot: string }> = {
  submitted: { label: "Submitted", tone: "text-navy", dot: "bg-gold" },
  pending:   { label: "Pending review", tone: "text-navy/70", dot: "bg-gold/60" },
  approved:  { label: "Approved", tone: "text-forest", dot: "bg-forest" },
  rejected:  { label: "Not published", tone: "text-terracotta", dot: "bg-terracotta" },
};

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function CommentBox() {
  const [submitted, setSubmitted] = useState(false);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const current = history[history.length - 1];

  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => {
      setHistory((h) =>
        h.some((e) => e.status === "pending")
          ? h
          : [...h, { status: "pending", label: "Pending review", detail: "Queued for editorial review by Dr. Jason Chen.", at: new Date() }]
      );
    }, 1200);
    return () => clearTimeout(t);
  }, [submitted]);

  if (submitted && current) {
    return (
      <div className="mt-12 border border-navy/10 bg-paper">
        <div className="p-6 border-b border-navy/10">
          <div className="flex items-center gap-3">
            <span className={`inline-block h-2 w-2 rounded-full ${STATUS_META[current.status].dot}`} aria-hidden />
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-navy/45">Comment status</p>
          </div>
          <p className={`mt-3 font-serif text-2xl ${STATUS_META[current.status].tone}`}>
            {STATUS_META[current.status].label}
          </p>
          <p className="mt-2 text-xs text-navy/60 leading-relaxed max-w-md">
            {current.detail} Refresh this page to see the latest status — you will not receive email notifications.
          </p>
        </div>

        <div className="p-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-navy/45 mb-4">Timeline</p>
          <ol className="relative border-l border-navy/10 pl-5 space-y-5">
            {history.map((entry, i) => (
              <li key={i} className="relative">
                <span
                  className={`absolute -left-[23px] top-1 inline-block h-2.5 w-2.5 rounded-full ring-4 ring-paper ${STATUS_META[entry.status].dot}`}
                  aria-hidden
                />
                <div className="flex items-baseline justify-between gap-4">
                  <p className={`text-sm font-medium ${STATUS_META[entry.status].tone}`}>{entry.label}</p>
                  <span className="text-[11px] font-mono text-navy/45 tabular-nums">{formatTime(entry.at)}</span>
                </div>
                <p className="mt-1 text-xs text-navy/55 leading-relaxed">{entry.detail}</p>
              </li>
            ))}
            {current.status === "pending" && (
              <li className="relative opacity-40">
                <span className="absolute -left-[23px] top-1 inline-block h-2.5 w-2.5 rounded-full ring-4 ring-paper border border-dashed border-navy/30 bg-paper" aria-hidden />
                <p className="text-sm text-navy/60">Awaiting decision</p>
                <p className="mt-1 text-xs text-navy/45 leading-relaxed">Approved comments appear publicly under your name.</p>
              </li>
            )}
          </ol>

          <button
            type="button"
            onClick={() => { setSubmitted(false); setValue(""); setHistory([]); }}
            className="mt-6 text-xs uppercase tracking-widest text-navy/60 hover:text-navy transition-colors"
          >
            Write another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        setHistory([{ status: "submitted", label: "Submitted", detail: "Your comment was received and logged in the moderation queue.", at: new Date() }]);
        setSubmitted(true);
      }}
      className="mt-12 p-6 bg-paper border border-navy/10"
    >
      <label htmlFor="comment" className="block text-sm font-medium text-navy mb-3">Contribute to the discussion</label>
      <textarea
        id="comment"
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border border-navy/10 p-3 text-sm outline-none focus:border-teal"
        placeholder="Your comment..."
      />
      <div className="mt-3 flex items-start gap-2 text-xs text-navy/50">
        <span className="mt-[3px] inline-block h-1.5 w-1.5 rounded-full bg-gold/70" aria-hidden />
        <p>
          Comments are reviewed by Dr. Jason Chen before publication. Do not include personal medical information —
          this space is for educational discussion only.
        </p>
      </div>
      <div className="mt-4 flex flex-col-reverse sm:flex-row justify-center gap-3">
        <button type="reset" onClick={() => setValue("")} className="w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-widest text-navy/60 hover:text-navy transition-colors">Cancel</button>
        <button type="submit" className="w-full sm:w-auto px-5 py-2 bg-navy text-paper text-xs font-semibold uppercase tracking-widest hover:bg-academic transition-colors">Submit for review</button>
      </div>
    </form>
  );
}
