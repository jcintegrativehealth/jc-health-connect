import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { conditions } from "@/data/site";
import { Container, PageHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/conditions/")({
  head: () => ({
    meta: [
      { title: "Conditions & Health Goals — JC Integrative Health" },
      { name: "description", content: "Educational information on conditions and health goals commonly addressed at JC Integrative Health." },
      { property: "og:title", content: 'Conditions & Health Goals — JC Integrative Health' },
      { property: "og:description", content: 'Educational information on conditions and health goals commonly addressed at JC Integrative Health.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'Conditions & Health Goals — JC Integrative Health' },
      { name: "twitter:description", content: 'Educational information on conditions and health goals commonly addressed at JC Integrative Health.' },
      { property: "og:url", content: "/conditions" },
    ],
    links: [{ rel: "canonical", href: "/conditions" }],
  }),
  component: ConditionsIndex,
});

function ConditionsIndex() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader eyebrow={t("conditions.index.eyebrow")} title={t("conditions.index.title")} lede={t("conditions.index.lede")} />
      <Container className="pb-24">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10 ring-1 ring-navy/10 border-t border-navy/10">
          {conditions.map((c, i) => (
            <li key={c.slug} className="bg-paper">
              <Link to="/conditions/$slug" params={{ slug: c.slug }} className="block p-8 hover:bg-navy hover:text-paper transition-colors group">
                <div className="font-mono text-[10px] text-navy/40 group-hover:text-paper/50 mb-4">{String(i + 1).padStart(2, "0")}</div>
                <h2 className="text-lg font-medium mb-2">{c.name}</h2>
                <p className="text-sm text-navy/55 group-hover:text-paper/55 line-clamp-2">{c.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

