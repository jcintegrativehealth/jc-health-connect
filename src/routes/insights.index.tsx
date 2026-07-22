import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { articles, insightsCategories } from "@/data/site";
import { Container, PageHeader } from "@/components/site/primitives";
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
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { month: "long", day: "numeric", year: "numeric" });

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

      {/* Category rail — horizontal scroll on mobile */}
      <Container className="pb-10">
        <div className="border-y border-navy/10 py-4 -mx-6 px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 min-w-max">
            <span className="eyebrow text-navy/45 shrink-0">{t("insightsIndex.filedUnder")}</span>
            {insightsCategories.map((c) => (
              <button
                key={c}
                type="button"
                className="text-xs text-navy/60 hover:text-gold transition-colors whitespace-nowrap tracking-wide"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* Featured */}
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

      {/* Archive */}
      <Container className="pb-24">
        <div className="flex items-baseline justify-between mb-8 md:mb-10 pb-4 border-b border-navy/10">
          <h2 className="eyebrow text-navy/60">{t("insightsIndex.recent")}</h2>
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-navy/40">
            {t("insightsIndex.countOf", { shown: rest.length, total: articles.length })}
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-14">
          {rest.map((a, i) => (
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
      </Container>
    </div>
  );
}

