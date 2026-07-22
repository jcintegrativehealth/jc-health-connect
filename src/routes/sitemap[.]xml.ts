import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { services, conditions, articles, physicians, states } from "@/data/site";

const BASE_URL = "https://jcintegrativehealth.com";

const LEGAL_SLUGS = [
  "privacy",
  "terms",
  "notice-privacy-practices",
  "hipaa",
  "accessibility",
  "medical-disclaimer",
  "telehealth-consent",
  "website-disclaimer",
  "cookie-preferences",
  "research-editorial-disclaimer",
  "comment-policy",
  "community-guidelines",
];

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/dr-chen", changefreq: "monthly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/book", changefreq: "weekly", priority: "0.9" },
          { path: "/telehealth", changefreq: "monthly", priority: "0.8" },
          { path: "/portal", changefreq: "monthly", priority: "0.7" },
          { path: "/patient-resources", changefreq: "monthly", priority: "0.7" },
          { path: "/medications", changefreq: "weekly", priority: "0.7" },
          { path: "/innovation", changefreq: "weekly", priority: "0.7" },
          { path: "/faq", changefreq: "monthly", priority: "0.7" },
          { path: "/services", changefreq: "weekly", priority: "0.8" },
          { path: "/research", changefreq: "weekly", priority: "0.8" },
          { path: "/physicians", changefreq: "monthly", priority: "0.7" },
          { path: "/insights", changefreq: "weekly", priority: "0.8" },
          { path: "/conditions", changefreq: "weekly", priority: "0.8" },
        ];

        services.forEach((s) =>
          entries.push({ path: `/services/${s.slug}`, changefreq: "monthly", priority: "0.7" })
        );

        conditions.forEach((c) =>
          entries.push({ path: `/conditions/${c.slug}`, changefreq: "monthly", priority: "0.7" })
        );

        articles.forEach((a) =>
          entries.push({ path: `/insights/${a.slug}`, changefreq: "monthly", priority: "0.7" })
        );

        physicians.forEach((p) =>
          entries.push({ path: `/physicians/${p.slug}`, changefreq: "monthly", priority: "0.6" })
        );

        states.forEach((s) =>
          entries.push({ path: `/locations/${s.slug}`, changefreq: "monthly", priority: "0.6" })
        );

        LEGAL_SLUGS.forEach((slug) =>
          entries.push({ path: `/legal/${slug}`, changefreq: "yearly", priority: "0.4" })
        );

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n")
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
