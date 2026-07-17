import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/site/primitives";

export const Route = createFileRoute("/telehealth")({
  head: () => ({
    meta: [
      { title: "Telehealth — JC Integrative Health" },
      { name: "description", content: "How telehealth visits work, states available, and preparation." },
      { property: "og:url", content: "/telehealth" },
    ],
    links: [{ rel: "canonical", href: "/telehealth" }],
  }),
  component: () => (
    <div>
      <PageHeader eyebrow="Care Options" title="Telehealth" lede="Structured virtual visits for eligible patients across supported states, with the same clinical care as in-person consultations." />
      <Container className="pb-24">
        <div className="grid lg:grid-cols-2 gap-12 border-t border-navy/10 pt-12">
          <div className="space-y-8">
            {[
              ["How Telehealth Works", "A structured video consultation with your physician, including a review of your intake and records."],
              ["States Available", "Colorado and Washington. Additional states are added periodically."],
              ["Technology Requirements", "A modern browser, stable internet, and a device with a camera and microphone."],
              ["Appointment Preparation", "Have recent labs and medication list ready. Choose a quiet, well-lit space."],
              ["Privacy", "Visits use a HIPAA-conformant video platform. Recordings are not made unless explicitly agreed."],
              ["Frequently Asked Questions", "See our full FAQ for common questions about telehealth."],
            ].map(([t, d]) => (
              <div key={t}>
                <h2 className="font-serif text-2xl text-navy mb-2">{t}</h2>
                <p className="text-sm text-navy/65">{d}</p>
              </div>
            ))}
            <Link to="/book" className="inline-flex items-center px-6 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-academic">Book Telehealth Visit</Link>
          </div>

          {/* Virtual waiting room preview */}
          <div className="bg-navy text-paper p-8 h-fit lg:sticky lg:top-32">
            <div className="eyebrow text-gold mb-4">Preview · Virtual Waiting Room</div>
            <div className="aspect-video bg-academic mb-6 grid place-items-center rounded">
              <span className="font-mono text-xs text-paper/40">Camera preview</span>
            </div>
            <dl className="space-y-3 text-sm text-paper/70">
              <div className="flex justify-between border-b border-paper/10 pb-2"><dt>Appointment</dt><dd>Follow-up · 30 min</dd></div>
              <div className="flex justify-between border-b border-paper/10 pb-2"><dt>Physician</dt><dd>Dr. Jason Chen</dd></div>
              <div className="flex justify-between border-b border-paper/10 pb-2"><dt>Camera</dt><dd className="text-teal">Ready</dd></div>
              <div className="flex justify-between border-b border-paper/10 pb-2"><dt>Microphone</dt><dd className="text-teal">Ready</dd></div>
              <div className="flex justify-between"><dt>Connection</dt><dd className="text-teal">Excellent</dd></div>
            </dl>
            <label className="mt-6 flex items-start gap-3 text-xs text-paper/70">
              <input type="checkbox" className="mt-0.5" /> I have read and consent to the terms of the telehealth visit.
            </label>
            <button className="mt-6 w-full py-3 bg-teal text-paper text-xs font-semibold uppercase tracking-[0.18em] hover:bg-gold">Join Visit</button>
          </div>
        </div>
      </Container>
    </div>
  ),
});
