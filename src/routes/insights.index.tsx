import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { articles, insightsCategories } from "@/data/site";
import { Container, PageHeader } from "@/components/site/primitives";
import { Search, X } from "lucide-react";
import botanical from "@/assets/hero-botanical.jpg";
import clinic from "@/assets/hero-clinic.jpg";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Medical Insights — JC Integrative Health" },
      { name: "description", content: "Editorial reviews, clinical commentary, and evidence summaries." },
      { property: "og:title", content: 'Medical Insights — JC Integrative Health' },
      { property: "og:description", content: 'Editorial reviews, clinical commentary, and evidence summaries.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Medical Insights — JC Integrative Health' },
      { name: "twitter:description", content: 'Editorial reviews, clinical commentary, and evidence summaries.' },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: InsightsIndex,
});

const COVERS = [botanical, clinic];

const DATE_LOCALES: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-BR", zh: "zh-CN" };

function InsightsIndex() {
  const { t, i18n } = useTranslation();
  const locale = DATE_LOCALES[i18n.language] ?? "en-US";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" });

  const q = query.trim().toLowerCase();
  const active = q !== "" || category !== "All";

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const inCategory = category === "All" || a.category === category;
      if (!inCategory) return false;
      if (q === "") return true;
      const haystack = [
        a.title,
        a.summary,
        a.author,
        a.category,
        a.type,
        a.evidence,
        ...a.tags,
        ...a.body,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [q, category]);

  const [featured, ...rest] = articles;
  const issueNo = String(articles.length).padStart(2, "0");
  const latest = formatDate(featured.date);

  return (
    <div>
      <PageHeader
        eyebrow={t("insightsIndex.eyebrow")}
        title={t("insightsIndex.title")}
        lede={t("insightsIndex.lede")}
        meta={
          <>
            <span>{t("insightsIndex.issue", { no: issueNo })}</span>
            <span aria-hidden>·</span>
            <span>{t("insightsIndex.updated", { date: latest })}</span>
            <span aria-hidden>·</span>
            <span>{t("insightsIndex.entries", { count: articles.length })}</span>
          </>
        }
      />

      {/* Search + filters */}
      <Container className="pb-10">
        <div className="border-y border-navy/10 py-5 -mx-6 px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
            {/* Search bar */}
            <div className="relative flex-1 max-w-xl group">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center text-navy/35">
                <Search size={16} strokeWidth={1.5} />
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("insightsIndex.searchPlaceholder")}
                className="w-full bg-paper border border-navy/10 rounded-sm pl-10 pr-10 py-2.5 text-sm text-navy placeholder:text-navy/35 outline-none transition-colors focus:border-gold/60 focus:shadow-[0_0_0_1px_rgba(196,125,90,0.15)]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-navy/35 hover:text-navy transition-colors"
                  aria-label={t("insightsIndex.clear")}
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Category rail */}
            <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
              <div className="flex items-center gap-2 min-w-max">
                {["All", ...insightsCategories].map((c) => {
                  const activeCat = category === c;
                  const count = c === "All" ? articles.length : articles.filter((a) => a.category === c).length;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-widest rounded-sm transition-colors ${
                        activeCat
                          ? "bg-navy text-paper"
                          : "text-navy/60 hover:text-navy border border-navy/10 hover:border-navy/25"
                      }`}
                    >
                      <span>{c === "All" ? t("insightsIndex.all") : c}</span>
                      <span className={`font-mono text-[10px] ${activeCat ? "text-paper/60" : "text-navy/35"}`}>
                        {String(count).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active filter summary */}
          {active && (
            <div className="mt-4 flex items-center gap-3 text-[11px] text-navy/50">
              <span className="h-px w-5 bg-gold/60" aria-hidden />
              <span>{t("insightsIndex.results", { count: filtered.length })}</span>
              {(q || category !== "All") && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setCategory("All"); }}
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  {t("insightsIndex.clear")}
                </button>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Featured — only when no active filter */}
      {!active && (
        <Container className="pb-16 md:pb-20">
          <article className="group block">
            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 md:gap-12 items-stretch">
              <div className="relative aspect-[5/4] md:aspect-[4/3] overflow-hidden bg-mist">
                <img
                  src={botanical}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-navy/40 via-navy/5 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-paper">
                  <span className="h-px w-6 bg-gold" aria-hidden />
                  {t("insightsIndex.editorSelection")}
                </div>
              </div>
              <div className="flex flex-col justify-center py-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5 text-[10px] font-mono uppercase tracking-[0.2em] text-navy/50">
                  <span className="text-gold">{featured.category}</span>
                  <span aria-hidden>·</span>
                  <span>{t("insightsIndex.minRead", { n: featured.readMinutes })}</span>
                </div>
                <h2 className="font-serif text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.1] text-navy tracking-[-0.01em]">
                  {featured.title}
                </h2>
                <p className="mt-5 text-navy/70 leading-relaxed max-w-xl">{featured.summary}</p>
                <div className="mt-8 pt-5 border-t border-navy/10 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-navy/50">
                  <span>{featured.author}</span>
                  <span>{formatDate(featured.date)}</span>
                </div>
              </div>
            </div>
          </article>
        </Container>
      )}

      {/* Archive */}
      <Container className="pb-24">
        <div className="flex items-baseline justify-between mb-8 md:mb-10 pb-4 border-b border-navy/10">
          <h2 className="eyebrow text-navy/60">
            {active ? t("insightsIndex.results", { count: filtered.length }) : t("insightsIndex.recent")}
          </h2>
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-navy/40">
            {t("insightsIndex.countOf", { shown: active ? filtered.length : rest.length, total: articles.length })}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 md:py-24 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full border border-navy/10 mb-5">
              <Search size={18} strokeWidth={1.5} className="text-navy/40" />
            </div>
            <p className="text-sm text-navy/70">{t("insightsIndex.noResults")}</p>
            <button
              type="button"
              onClick={() => { setQuery(""); setCategory("All"); }}
              className="mt-4 text-xs uppercase tracking-widest text-gold hover:text-gold/80 transition-colors"
            >
              {t("insightsIndex.clear")}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-14">
            {(active ? filtered : rest).map((a, i) => (
              <article key={a.slug} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-mist mb-5">
                  <img
                    src={COVERS[i % COVERS.length]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-navy/25 to-transparent" />
                </div>
                <div className="flex items-center gap-2 eyebrow text-gold mb-3">
                  <span className="font-mono text-navy/35">{String(i + 1).padStart(2, "0")}</span>
                  <span>{a.category}</span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl leading-[1.2] text-navy tracking-[-0.005em]">
                  {a.title}
                </h3>
                <p className="mt-3 text-sm text-navy/65 leading-relaxed line-clamp-3">{a.summary}</p>
                <div className="mt-5 pt-4 border-t border-navy/10 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-navy/45">
                  <span>{a.author}</span>
                  <span>{t("insightsIndex.min", { n: a.readMinutes })}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
