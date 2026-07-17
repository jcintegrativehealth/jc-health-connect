import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";

const LEGAL: Record<string, { title: string; summary: string; body: string[] }> = {
  "privacy": { title: "Privacy Policy", summary: "How JC Integrative Health handles patient and visitor information.", body: ["Placeholder text pending legal review. This section describes how information is collected, used, and protected across the clinic's digital services."] },
  "terms": { title: "Terms of Use", summary: "Terms governing use of this website.", body: ["Placeholder text pending legal review."] },
  "notice-privacy-practices": { title: "Notice of Privacy Practices", summary: "How medical information may be used and disclosed.", body: ["Placeholder text pending legal review."] },
  "hipaa": { title: "HIPAA Information", summary: "HIPAA-related information relevant to patients.", body: ["Placeholder text pending legal review."] },
  "accessibility": { title: "Accessibility", summary: "Our commitment to accessible digital experiences.", body: ["We aim for WCAG-conformant design across our site and portal."] },
  "medical-disclaimer": { title: "Medical Disclaimer", summary: "Educational content and clinical care.", body: ["Content on this site is educational and does not constitute medical advice or a physician-patient relationship."] },
  "telehealth-consent": { title: "Telehealth Consent", summary: "Consent to telehealth services.", body: ["Placeholder text pending legal review."] },
  "website-disclaimer": { title: "Website Disclaimer", summary: "Website-wide disclaimers.", body: ["Placeholder text pending legal review."] },
  "cookie-preferences": { title: "Cookie Preferences", summary: "How we use cookies and how you can adjust preferences.", body: ["Placeholder text pending legal review."] },
  "research-editorial-disclaimer": { title: "Research and Editorial Disclaimer", summary: "Editorial standards and disclosures.", body: ["Editorial content is authored and reviewed by qualified contributors and does not represent an endorsement of specific products or interventions."] },
  "comment-policy": { title: "Comment Policy", summary: "Rules and standards for clinical discussion.", body: ["Comments are moderated. Personal medical information should not be posted. Discussion is for educational purposes only."] },
  "community-guidelines": { title: "Community Guidelines", summary: "How we expect participants to engage.", body: ["Respectful, evidence-oriented, and professional engagement is expected in all discussion areas."] },
};

export const Route = createFileRoute("/legal/$slug")({
  loader: ({ params }) => {
    const doc = LEGAL[params.slug];
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData, params }) => loaderData ? ({
    meta: [
      { title: `${loaderData.doc.title} — JC Integrative Health` },
      { name: "description", content: loaderData.doc.summary },
      { property: "og:url", content: `/legal/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/legal/${params.slug}` }],
  }) : ({ meta: [{ title: "Legal" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { doc } = Route.useLoaderData();
    return (
      <div>
        <Container className="pt-20 pb-6">
          <div className="eyebrow text-navy/45 mb-4"><Link to="/" className="hover:text-navy">Home</Link> / Legal / {doc.title}</div>
        </Container>
        <PageHeader eyebrow="Legal" title={doc.title} lede={doc.summary} />
        <Container className="pb-24">
          <div className="max-w-3xl border-t border-navy/10 pt-10 space-y-6">
            {doc.body.map((p, i) => (<p key={i} className="text-navy/70 leading-relaxed">{p}</p>))}
            <Disclaimer>Placeholder content pending review by qualified legal counsel prior to publication.</Disclaimer>
          </div>
        </Container>
      </div>
    );
  },
  notFoundComponent: () => <Container className="py-24"><h1 className="font-serif text-4xl">Document not found</h1></Container>,
});
