import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { services, articles, conditions, innovations, visitTypes } from "@/data/site";
import { Container } from "@/components/site/primitives";
import { ArrowUpRight } from "lucide-react";
import heroClinic from "@/assets/hero-clinic.jpg";
import heroBotanical from "@/assets/hero-botanical.jpg";
import textureLinen from "@/assets/texture-linen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JC Integrative Health — Integrative Medicine. Longevity. Medical Innovation." },
      { name: "description", content: "Personalized, evidence-based integrative medicine, longevity, and preventive care. Serving Colorado, Washington, and via telehealth." },
      { property: "og:title", content: "JC Integrative Health" },
      { property: "og:description", content: "Integrative medicine, longevity, and medical innovation." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  const featuredServices = services.slice(0, 10);
  const featuredArticles = articles.slice(0, 3);
  const featuredInnovations = innovations.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative pt-10 md:pt-16 pb-20 md:pb-28 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-32 w-[560px] h-[560px] rounded-full opacity-[0.14] blur-3xl bg-linear-to-br from-teal via-academic to-navy" />

        {/* Mobile-only botanical / topographic art layer */}
        <div aria-hidden className="pointer-events-none absolute inset-0 md:hidden overflow-hidden">
          <svg className="absolute -top-10 -right-16 w-[420px] h-[420px] text-teal/30" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" strokeWidth="0.6" fill="none">
              {Array.from({ length: 14 }).map((_, i) => (
                <circle key={i} cx="200" cy="200" r={30 + i * 12} opacity={0.55 - i * 0.03} />
              ))}
            </g>
          </svg>
          <svg className="absolute -bottom-24 -left-20 w-[360px] h-[360px] text-terracotta/25" viewBox="0 0 300 300" fill="none">
            <g stroke="currentColor" strokeWidth="0.7" fill="none">
              <path d="M150 20 C 90 90, 90 210, 150 280 C 210 210, 210 90, 150 20 Z" />
              <path d="M150 40 C 105 100, 105 200, 150 260" />
              <path d="M150 40 C 195 100, 195 200, 150 260" />
              <line x1="150" y1="20" x2="150" y2="280" />
              <path d="M150 100 C 120 120, 120 150, 150 170" />
              <path d="M150 100 C 180 120, 180 150, 150 170" />
              <path d="M150 170 C 115 190, 115 220, 150 240" />
              <path d="M150 170 C 185 190, 185 220, 150 240" />
            </g>
          </svg>
          <div className="absolute inset-x-0 top-1/3 h-px bg-linear-to-r from-transparent via-navy/10 to-transparent" />
        </div>

        <Container>
          {/* Clinical masthead strip */}
          <div className="flex flex-col items-center text-center md:flex-row md:flex-wrap md:items-center md:justify-between md:text-left gap-3 md:gap-4 pb-5 mb-10 border-b border-navy/10 text-[10px] font-mono uppercase tracking-[0.22em] text-navy/55">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal" />
              </span>
              Now accepting new patients
            </div>
            <div className="hidden sm:block">Est. 2019 · Colorado · Washington · Telehealth</div>
            <div>NPI-verified · HIPAA compliant</div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
            <div className="lg:col-span-7 relative">
              <div className="eyebrow text-terracotta mb-6">Section 01 · Evidence-Based Care</div>
              <h1 className="font-serif text-[2.5rem] leading-[1.05] md:text-5xl lg:text-[3.75rem] text-balance text-navy">
                {t("hero.title")}
              </h1>
              <p className="mt-7 text-base md:text-lg text-navy/65 max-w-[52ch] text-pretty leading-relaxed">
                {t("hero.lede")}
              </p>

              {/* Clinician signature block */}
              <div className="mt-8 flex items-center gap-4 pb-6 border-b border-navy/10 max-w-md">
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-navy to-academic grid place-items-center text-paper font-serif text-sm ring-1 ring-navy/20">JC</div>
                <div>
                  <div className="text-sm font-medium text-navy">Jason Chen, DO</div>

                  <div className="text-[11px] text-navy/55 font-mono uppercase tracking-[0.14em]">Board Certified · Integrative Medicine</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/book" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.2em] ring-1 ring-gold/50 hover:bg-academic transition-colors group">
                  {t("hero.bookCta")}
                </Link>
                <Link to="/about" className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.2em] hover:bg-navy/5 transition-colors">
                  {t("hero.exploreCta")}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full rounded-md overflow-hidden ring-1 ring-navy/10 shadow-[0_30px_80px_-40px_rgba(31,61,46,0.35)]">
                <img src={heroBotanical} alt="Fresh sage and eucalyptus on linen" className="absolute inset-0 h-full w-full object-cover" width={1100} height={1400} />
                <div className="absolute top-4 left-4 eyebrow text-paper/80 mix-blend-difference">JC · Fig. 001</div>
              </div>

              {/* Clinical data card overlay */}
              <div className="mt-6 lg:mt-0 lg:absolute lg:-bottom-8 lg:-left-16 lg:w-72 bg-paper ring-1 ring-navy/10 p-5 shadow-xl">
                <div className="eyebrow text-terracotta mb-4">At a glance</div>
                <dl className="space-y-3 text-xs">
                  {[
                    ["Initial consult", "60–90 min"],
                    ["Languages", "EN · ES · PT · ZH"],
                    ["Modalities", "In-person · Telehealth"],
                    ["Follow-up", "Within 14 days"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-baseline gap-3 border-b border-navy/5 pb-2 last:border-b-0 last:pb-0">
                      <dt className="text-navy/50 font-mono uppercase tracking-[0.14em] text-[10px]">{k}</dt>
                      <dd className="text-navy font-medium text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-24 lg:mt-32 relative aspect-[21/9] w-full rounded-md ring-1 ring-navy/10 overflow-hidden">
            <img src={heroClinic} alt="Sunlit consulting room in the JC clinic" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1200} loading="lazy" />
            <div className="absolute inset-0 bg-linear-to-t from-navy/50 via-navy/10 to-transparent" />
            <div className="absolute top-6 left-6 eyebrow text-paper/80">JC · Fig. 002 · Consulting room</div>
            <div className="absolute bottom-6 right-6 font-mono text-[10px] text-paper/70">40.5°N / 105.1°W</div>
            <div className="absolute bottom-6 left-6 font-serif italic text-paper text-lg md:text-xl max-w-md">"Medicine practiced with quiet attention."</div>
          </div>
        </Container>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-navy/5 bg-mist/40">
        <Container className="py-10">
          <ul className="flex flex-wrap justify-between gap-x-10 gap-y-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy/55">
            {(["integrative", "longevity", "evidence", "telehealth", "multilingual"] as const).map((k) => (
              <li key={k} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-teal" />
                {t(`trust.${k}`)}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* APPROACH — 4 pillars */}
      <section className="bg-navy text-paper py-28">
        <Container>
          <div className="max-w-2xl mb-16">
            <div className="eyebrow text-gold mb-4">{t("approach.eyebrow")}</div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">{t("approach.title")}</h2>
            <p className="mt-5 text-paper/60 text-pretty">{t("approach.lede")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(["one", "two", "three", "four"] as const).map((k, i) => (
              <div key={k} className="border-l border-paper/15 pl-6 hover:border-teal transition-colors">
                <div className="font-mono text-xs text-teal tracking-widest mb-6">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-lg font-medium text-paper mb-3">{t(`approach.pillars.${k}.t`)}</h3>
                <p className="text-sm text-paper/55 leading-relaxed">{t(`approach.pillars.${k}.d`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* SERVICES MATRIX */}
      <section className="py-28">
        <Container>
          <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
            <div>
              <div className="eyebrow text-gold mb-4">Section 03</div>
              <h2 className="font-serif text-4xl md:text-5xl text-navy">Featured Services</h2>
            </div>
            <Link to="/services" className="text-sm font-semibold text-navy border-b border-navy pb-1 hover:text-teal hover:border-teal transition-colors">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10 ring-1 ring-navy/10">
            {featuredServices.map((s, i) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group p-8 lg:p-10 bg-paper hover:bg-navy hover:text-paper transition-colors"
              >
                <div className="font-mono text-[10px] text-navy/40 group-hover:text-paper/50 mb-6">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-lg font-medium mb-3">{s.name}</h3>
                <p className="text-sm text-navy/60 group-hover:text-paper/60 leading-relaxed mb-8 line-clamp-3">{s.summary}</p>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal group-hover:text-gold">
                  Learn more <ArrowUpRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* DR. CHEN — discreet intro */}
      <section className="py-28 bg-mist/50">
        <Container>
          <div className="grid lg:grid-cols-[400px_1fr] gap-16 items-start">
            <div className="aspect-[4/5] bg-linear-to-b from-navy/10 to-navy/5 ring-1 ring-navy/10 grid place-items-center">
              <div className="text-center">
                <div className="eyebrow text-navy/35 mb-2">Portrait</div>
                <div className="font-serif italic text-navy/25 text-sm">Photography placeholder</div>
              </div>
            </div>
            <div>
              <div className="eyebrow text-gold mb-4">Section 04</div>
              <h2 className="font-serif text-4xl md:text-5xl text-navy leading-tight mb-6">Meet Dr. Jason Chen</h2>
              <p className="text-navy/70 leading-relaxed max-w-2xl mb-5">
                Physician in integrative medicine, university lecturer, and clinic director with a research interest in longevity, prevention, and the responsible integration of medical technology into everyday practice.
              </p>
              <p className="text-navy/60 leading-relaxed max-w-2xl mb-8">
                Practicing in Colorado and Washington and available via telehealth for eligible patients across supported states. Fluent clinical communication in English, Spanish, Portuguese, and Mandarin.
              </p>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-navy/10 pt-8 max-w-2xl">
                {[
                  ["Focus", "Integrative Medicine"],
                  ["Interest", "Longevity"],
                  ["Role", "Clinic Director"],
                  ["Also", "Academic Teaching"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow text-navy/40 mb-2">{k}</dt>
                    <dd className="text-sm font-medium text-navy">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10">
                <Link to="/dr-chen" className="inline-flex items-center gap-2 text-sm font-semibold text-navy border-b border-navy pb-1 hover:text-teal hover:border-teal transition-colors">
                  Learn more about Dr. Chen <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CARE OPTIONS */}
      <section className="py-28">
        <Container>
          <div className="mb-14">
            <div className="eyebrow text-gold mb-4">Section 05</div>
            <h2 className="font-serif text-4xl md:text-5xl text-navy">Care Options</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {visitTypes.map((v, i) => (
              <div key={v.slug} className="border border-navy/10 p-6 hover:border-teal transition-colors">
                <div className="font-mono text-[10px] text-navy/40 mb-4">V-{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-base font-medium text-navy mb-2">{v.name}</h3>
                <p className="text-xs text-navy/55 mb-6">{v.duration}</p>
                <Link to="/book" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal hover:text-navy">Book →</Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* RESEARCH & INSIGHTS */}
      <section className="bg-navy text-paper py-28">
        <Container>
          <div className="grid lg:grid-cols-[380px_1fr] gap-16">
            <div>
              <div className="eyebrow text-gold mb-4">Section 06</div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">Research & Medical Insights</h2>
              <p className="mt-6 text-paper/55 leading-relaxed max-w-md">
                Editorial reviews, clinical commentary, and evidence summaries on integrative medicine, longevity, and medical innovation.
              </p>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/45">
                <span className="text-paper/30 cursor-not-allowed flex items-center gap-2">Research <span className="text-[10px] tracking-widest">Soon</span></span>
                <span className="text-paper/30 cursor-not-allowed flex items-center gap-2">Insights <span className="text-[10px] tracking-widest">Soon</span></span>
                <span className="text-paper/30 cursor-not-allowed flex items-center gap-2">Innovation <span className="text-[10px] tracking-widest">Soon</span></span>
              </div>
            </div>

            <div className="space-y-10">
              {featuredArticles.map((a) => (
                <Link
                  key={a.slug}
                  to="/insights/$slug"
                  params={{ slug: a.slug }}
                  className="group block border-b border-paper/10 pb-10 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px] font-mono uppercase tracking-widest text-paper/40">
                    <span className="px-2 py-0.5 border border-teal text-teal">{a.category}</span>
                    <span>{formatDate(a.date)}</span>
                    <span>{a.readMinutes} min read</span>
                    <span>· {a.type}</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight group-hover:text-teal transition-colors max-w-3xl">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-paper/55 text-sm max-w-2xl line-clamp-2">{a.summary}</p>
                  <div className="mt-5 flex items-center gap-6 text-[11px] text-paper/40">
                    <span>{a.author}</span>
                    <span>{a.reactions.helpful} helpful</span>
                    <span>{a.reactions.insightful} insightful</span>
                    <span>{a.comments} comments</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* INNOVATION RADAR */}
      <section className="py-28">
        <Container>
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <div className="max-w-xl">
              <div className="eyebrow text-gold mb-4">Section 07</div>
              <h2 className="font-serif text-4xl md:text-5xl text-navy">Medical Innovation Radar</h2>
              <p className="mt-5 text-navy/60 text-pretty">Tracking the intersection of clinical research and applied technology — with candid notes on evidence and limitations.</p>
            </div>
            <span className="text-sm font-semibold text-navy/30 border-b border-navy/20 pb-1 cursor-not-allowed flex items-center gap-2">
              Full Radar <span className="text-[10px] uppercase tracking-widest">Soon</span>
            </span>
          </div>

          <div className="divide-y divide-navy/10 border-y border-navy/10">
            {featuredInnovations.map((it) => (
              <div key={it.slug} className="grid grid-cols-12 items-center py-5 gap-4">
                <div className="col-span-12 md:col-span-3">
                  <StatusBadge status={it.status} />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div className="text-base font-medium text-navy">{it.name}</div>
                  <div className="text-xs text-navy/50 mt-1">{it.category} · {it.evidence}</div>
                </div>
                <div className="col-span-12 md:col-span-3 text-xs text-navy/55 md:text-right line-clamp-2">
                  {it.summary}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CONDITIONS TREATED */}
      <section className="py-28 bg-mist/40">
        <Container>
          <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
            <div>
              <div className="eyebrow text-gold mb-4">{t("conditions.eyebrow")}</div>
              <h2 className="font-serif text-4xl md:text-5xl text-navy">{t("conditions.title")}</h2>
              <p className="mt-4 text-navy/60 max-w-xl">{t("conditions.lede")}</p>
            </div>
            <Link to="/conditions" className="text-sm font-semibold text-navy border-b border-navy pb-1 hover:text-teal hover:border-teal transition-colors">
              {t("conditions.viewAll")}
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-navy/10 ring-1 ring-navy/10">
            {conditions.slice(0, 8).map((c, i) => (
              <Link key={c.slug} to="/conditions/$slug" params={{ slug: c.slug }} className="group block bg-paper p-8 hover:bg-navy hover:text-paper transition-colors">
                <div className="font-mono text-[10px] text-navy/40 group-hover:text-paper/50 mb-4">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-base font-medium text-navy group-hover:text-paper mb-2">{c.name}</h3>
                <p className="text-sm text-navy/55 group-hover:text-paper/55 line-clamp-2">{c.summary}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* PATIENT JOURNEY */}
      <section className="py-28">
        <Container>
          <div className="mb-14 max-w-2xl">
            <div className="eyebrow text-gold mb-4">Section 09</div>
            <h2 className="font-serif text-4xl md:text-5xl text-navy">The Patient Experience</h2>
          </div>
          <ol className="grid md:grid-cols-3 gap-x-8 gap-y-12">
            {[
              ["Choose your visit", "Select in-person or telehealth, your state, and preferred language."],
              ["Complete intake", "Structured intake and, when relevant, laboratory or functional evaluation."],
              ["Meet with the physician", "Comprehensive initial consultation, typically 60–90 minutes."],
              ["Receive your care plan", "A written, prioritized plan with clinical rationale and next steps."],
              ["Continue follow-up", "Regular check-ins, adjustments, and re-evaluation over time."],
              ["Ongoing partnership", "A long-term view of health, coordinated across specialists as needed."],
            ].map(([title, body], i) => (
              <li key={title} className="relative">
                <div className="font-serif text-6xl italic text-navy/10 absolute -top-6 -left-2">{i + 1}</div>
                <div className="relative">
                  <h3 className="text-lg font-medium text-navy mb-3">{title}</h3>
                  <p className="text-sm text-navy/60 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* NEWSLETTER */}
      <section className="py-28 bg-academic text-paper">
        <Container>
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-center">
            <div>
              <div className="eyebrow text-gold mb-4">Section 10</div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">JC Health Insights</h2>
              <p className="mt-5 text-paper/60 max-w-xl">
                Curated insights on integrative medicine, longevity, research and medical innovation — delivered occasionally, not aggressively.
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
              <input type="text" placeholder="First Name" className="w-full bg-transparent border-b border-paper/25 py-3 text-sm outline-none placeholder:text-paper/40 focus:border-teal" />
              <input type="email" required placeholder="Email Address" className="w-full bg-transparent border-b border-paper/25 py-3 text-sm outline-none placeholder:text-paper/40 focus:border-teal" />
              <select className="w-full bg-transparent border-b border-paper/25 py-3 text-sm outline-none text-paper/70 focus:border-teal">
                <option className="text-navy">English</option>
                <option className="text-navy">Español</option>
                <option className="text-navy">Português</option>
                <option className="text-navy">中文</option>
              </select>
              <button type="submit" className="w-full px-6 py-3 bg-teal text-paper text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gold transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="py-32">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="eyebrow text-gold mb-6">The Next Step</div>
            <h2 className="font-serif text-4xl md:text-5xl text-navy leading-tight text-balance">
              Take the next step toward more personalized care.
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/book" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.2em] hover:bg-academic">Book Appointment</Link>
              <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.2em] hover:bg-navy/5">Contact the Clinic</Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Available Now": "bg-teal/10 text-teal ring-teal/30",
    "Emerging": "bg-gold/10 text-gold ring-gold/30",
    "In Clinical Trials": "bg-academic/10 text-academic ring-academic/30",
    "Experimental": "bg-navy/10 text-navy/60 ring-navy/20",
  };
  return (
    <span className={`inline-block px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ring-1 ${map[status] || "bg-navy/10 text-navy"}`}>
      {status}
    </span>
  );
}
