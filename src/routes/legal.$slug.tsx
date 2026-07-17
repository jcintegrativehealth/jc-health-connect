import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Container, PageHeader, Disclaimer } from "@/components/site/primitives";

const LEGAL: Record<string, { title: string; summary: string; body: string[] }> = {
  "privacy": {
    title: "Privacy Policy",
    summary: "How JC Integrative Health collects, uses, and protects information across our digital services.",
    body: [
      "At JC Integrative Health, we treat your personal and health information with the same discretion we bring to the exam room. This policy explains what we collect, how we use it, and the choices you have.",
      "Information we collect. We collect information you provide directly — name, contact details, appointment preferences, and messages you send through the patient portal — as well as limited technical data (device, browser, coarse location) required to operate the site securely.",
      "How we use it. We use your information to schedule care, communicate about your treatment, deliver telehealth visits, respond to inquiries, and improve our services. Protected health information is handled under our Notice of Privacy Practices and applicable HIPAA rules.",
      "How we share it. We share information only with clinicians involved in your care, business associates bound by written agreements, and authorities where required by law. We never sell personal or health information.",
      "Your choices. You can request access, correction, or deletion of your information at any time. Patients in Colorado, Washington, and other regulated states have additional rights under state law, which we honor.",
      "Contact. Questions about this policy can be sent to privacy@jcintegrativehealth.com.",
    ],
  },
  "terms": {
    title: "Terms of Use",
    summary: "The terms governing your use of the JC Integrative Health website and digital services.",
    body: [
      "By using this website you agree to these terms. Content is provided for educational purposes and does not create a physician-patient relationship. Clinical care begins only after intake and a scheduled visit.",
      "Acceptable use. You agree not to interfere with the site, attempt unauthorized access, upload malicious content, or use it to harass others. We may suspend access when necessary to protect patients or systems.",
      "Accounts. Patient portal credentials are personal to you. You are responsible for keeping them confidential and for activity performed under your account.",
      "Content. All copy, imagery, and design are owned by JC Integrative Health or its licensors. You may share links to our public pages; broader reuse requires written permission.",
      "Third parties. We link to trusted educational and clinical resources. We do not control external sites and are not responsible for their content.",
      "Changes. We may update these terms as our services evolve. Material changes will be surfaced on this page with a revised effective date.",
    ],
  },
  "notice-privacy-practices": { title: "Notice of Privacy Practices", summary: "How medical information about you may be used and disclosed, and how you can access it.", body: ["This notice describes uses and disclosures of your Protected Health Information (PHI) for treatment, payment, and health-care operations, as required by HIPAA. Full text is provided at your first visit and is available on request."] },
  "hipaa": {
    title: "HIPAA Information",
    summary: "Our commitments under the Health Insurance Portability and Accountability Act.",
    body: [
      "JC Integrative Health is a HIPAA-covered entity. We maintain administrative, physical, and technical safeguards designed to protect the confidentiality, integrity, and availability of your Protected Health Information.",
      "Our team members receive ongoing training on privacy and security. Vendors who process PHI on our behalf sign Business Associate Agreements and are held to the same standards.",
      "You have the right to inspect and receive a copy of your records, request corrections, ask for restrictions on disclosure, receive an accounting of disclosures, and file a complaint with our Privacy Officer or the U.S. Department of Health and Human Services.",
    ],
  },
  "accessibility": {
    title: "Accessibility",
    summary: "Our commitment to an inclusive, accessible digital experience for every patient.",
    body: [
      "We design and build with WCAG 2.2 AA guidelines in mind. Type is set for comfortable reading, color contrast is verified against the palette, and interactive elements are keyboard reachable and screen-reader labeled.",
      "If any part of our site or patient portal is difficult to use, please contact accessibility@jcintegrativehealth.com. We treat accessibility feedback as clinical feedback — it goes directly to the team responsible for the experience.",
    ],
  },
  "medical-disclaimer": {
    title: "Medical Disclaimer",
    summary: "How to interpret educational content on this site.",
    body: [
      "Content published on JCIH is intended to inform and to support informed conversations with your clinician. It is not medical advice, diagnosis, or treatment, and it does not create a physician-patient relationship.",
      "Individual health situations vary. Decisions about care — including starting, stopping, or changing therapies, supplements, or medications — should be made with a qualified clinician who knows your history.",
      "In an emergency, call 911 or your local emergency number. Do not delay urgent care to consult this site.",
    ],
  },
  "telehealth-consent": { title: "Telehealth Consent", summary: "Consent to receive care through secure telehealth technology.", body: ["Telehealth extends our clinical care through secure video and messaging. Consent covers the nature of remote care, its limitations, privacy safeguards, and your right to withdraw consent at any time. Complete text is provided in the patient portal before your first telehealth visit."] },
  "website-disclaimer": { title: "Website Disclaimer", summary: "General disclaimers regarding this website.", body: ["Information on this site is provided in good faith for general informational purposes. We make reasonable efforts to keep content accurate and current, but we make no warranty as to completeness, timeliness, or fitness for a particular purpose."] },
  "cookie-preferences": { title: "Cookie Preferences", summary: "How we use cookies and the choices available to you.", body: ["We use a small number of first-party cookies to remember your language preference and to measure aggregate site performance. You can clear these at any time through your browser settings without affecting your ability to book care."] },
  "research-editorial-disclaimer": { title: "Research & Editorial Disclaimer", summary: "Our editorial standards and disclosures.", body: ["Editorial content is authored or reviewed by clinicians and researchers with named credentials. We disclose funding sources and material conflicts. Coverage of a therapy, medication, or technology is not an endorsement and does not imply we recommend it for your specific situation."] },
  "comment-policy": { title: "Comment Policy", summary: "How discussion works in our clinical commentary spaces.", body: ["Comments are moderated. Personal medical details, identifying information, and marketing content are removed. Discussion is for educational exchange between clinicians, researchers, and informed patients — always civil, always evidence-oriented."] },
  "community-guidelines": { title: "Community Guidelines", summary: "How we expect participants to engage across our platforms.", body: ["Respectful, curious, and professional conduct is expected in every discussion area. Disagreement is welcome; personal attacks, medical misinformation, and promotional content are not."] },
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
            {doc.body.map((p: string, i: number) => (<p key={i} className="text-navy/70 leading-relaxed">{p}</p>))}
            <Disclaimer>Placeholder content pending review by qualified legal counsel prior to publication.</Disclaimer>
          </div>
        </Container>
      </div>
    );
  },
  notFoundComponent: () => <Container className="py-24"><h1 className="font-serif text-4xl">Document not found</h1></Container>,
});
