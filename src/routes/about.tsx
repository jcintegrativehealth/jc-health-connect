import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Container, PageHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — JC Integrative Health" },
      { name: "description", content: "About JC Integrative Health: mission, philosophy, and commitment to evidence-based, personalized care." },
      { property: "og:description", content: 'About JC Integrative Health: mission, philosophy, and commitment to evidence-based, personalized care.' },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: 'About — JC Integrative Health' },
      { name: "twitter:description", content: 'About JC Integrative Health: mission, philosophy, and commitment to evidence-based, personalized care.' },
      { property: "og:title", content: "About — JC Integrative Health" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const SECTION_KEYS = [
  "mission",
  "vision",
  "philosophy",
  "evidence",
  "personalized",
  "prevention",
  "innovation",
  "multilingual",
  "locations",
  "education",
  "research",
  "patient",
] as const;

function AboutPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader eyebrow={t("about.eyebrow")} title={t("about.title")} lede={t("about.lede")} />
      <Container className="pb-24">
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 border-t border-navy/10 pt-16">
          {SECTION_KEYS.map((key, i) => (
            <div key={key}>
              <div className="font-mono text-[10px] text-navy/40 mb-3">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="font-serif text-2xl text-navy mb-3">{t(`about.sections.${key}.t`)}</h2>
              <p className="text-sm text-navy/65 leading-relaxed">{t(`about.sections.${key}.d`)}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
