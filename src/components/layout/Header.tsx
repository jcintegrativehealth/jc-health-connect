import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Menu, X, Calendar } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

// Hero nav: essentials only. Secondary pages live in the footer & drawer.
const NAV: { to: string; key: string }[] = [
  { to: "/about", key: "nav.about" },
  { to: "/services", key: "nav.services" },
  { to: "/insights", key: "nav.insights" },
  { to: "/contact", key: "nav.contact" },
];

// Full sitemap surfaces in the mobile drawer for discoverability,
// mirroring the footer information architecture.
type DrawerLink = { to: string; label: string };
type DrawerGroup = { title: string; links: DrawerLink[] };

const DRAWER_GROUPS: DrawerGroup[] = [
  {
    title: "Clinical Care",
    links: [
      { to: "/conditions", label: "Conditions" },
      { to: "/telehealth", label: "Telehealth" },
      { to: "/medications", label: "Medications" },
    ],
  },
  {
    title: "Knowledge",
    links: [
      { to: "/research", label: "Research Hub" },
      { to: "/innovation", label: "Innovation Center" },
    ],
  },
  {
    title: "People",
    links: [
      { to: "/dr-chen", label: "Dr. Jason Chen" },
      { to: "/physicians", label: "Guest Physicians" },
    ],
  },
  {
    title: "Patients",
    links: [
      { to: "/patient-resources", label: "Patient Resources" },
      { to: "/faq", label: "FAQ" },
      { to: "/portal", label: "Patient Portal" },
    ],
  },
];

export function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  // Auto-close the drawer on any route change (link tap, back button, programmatic nav).
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scroll while the drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      {/* Utility bar */}
      <div className="hidden md:block border-b border-navy/5 bg-paper">
        <div className="max-w-[1440px] mx-auto px-6 h-9 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-navy/55">
          <LanguageSwitcher variant="inline" />
          <div className="flex items-center gap-6">
            <Link to="/portal" className="hover:text-navy transition-colors">{t("nav.portal")}</Link>
            <Link to="/admin" className="hover:text-navy transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-navy/5">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-baseline gap-2 shrink-0">
            <span className="font-serif text-2xl font-semibold tracking-tight text-navy">JC</span>
            <span className="hidden xs:inline text-[11px] font-semibold uppercase tracking-[0.22em] text-navy/60">Integrative Health</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-navy/75">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="hover:text-navy transition-colors"
                activeProps={{ className: "text-navy" }}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Booking CTA — desktop / tablet (pill) */}
            <Link
              to="/book"
              className="hidden sm:inline-flex items-center gap-2 h-11 px-5 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] ring-1 ring-gold/60 hover:bg-academic hover:ring-gold transition-colors"
            >
              <Calendar size={14} strokeWidth={1.75} className="text-gold" />
              {t("nav.book")}
            </Link>
            {/* Booking CTA — compact for phones (outline, no fill) */}
            <Link
              to="/book"
              aria-label={t("nav.book")}
              className="sm:hidden inline-flex items-center justify-center w-11 h-11 bg-transparent text-navy border border-navy/15 hover:border-gold/60 hover:text-gold transition-colors"
            >
              <Calendar size={16} strokeWidth={1.75} />
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-navy"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-[88%] max-w-sm bg-paper border-l border-navy/10 flex flex-col">
            <div className="h-20 px-6 flex items-center justify-between border-b border-navy/10">
              <span className="font-serif text-xl font-semibold text-navy">Menu</span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="w-11 h-11 grid place-items-center text-navy">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6">
              {/* Primary */}
              <ul className="flex flex-col">
                {NAV.map((n, idx) => {
                  const active = isActive(n.to);
                  return (
                    <li key={n.to}>
                      <Link
                        to={n.to}
                        onClick={() => setMobileOpen(false)}
                        className={[
                          "relative flex items-center justify-between py-3.5 text-lg font-serif border-b border-navy/10 transition-colors",
                          active
                            ? "text-gold bg-mist/60 pr-5"
                            : "text-navy hover:text-gold",
                        ].join(" ")}
                      >
                        <span className="pl-4">{t(n.key)}</span>
                        <span className="flex items-center gap-3">
                          {active && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold" aria-hidden="true" />
                          )}
                          <span className="font-mono text-[10px] text-navy/30">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Grouped More */}
              {DRAWER_GROUPS.map((group) => (
                <div key={group.title} className="mt-8">
                  <div className="eyebrow text-navy/40 mb-2">{group.title}</div>
                  <ul>
                    {group.links.map((l) => {
                      const active = isActive(l.to);
                      return (
                        <li key={l.to}>
                          <Link
                            to={l.to}
                            onClick={() => setMobileOpen(false)}
                            className={[
                              "flex items-center gap-2.5 py-2.5 text-sm border-b border-navy/5 transition-colors",
                              active
                                ? "text-gold bg-mist/60 -mx-2 px-2 rounded-sm"
                                : "text-navy/80 hover:text-gold",
                            ].join(" ")}
                          >
                            {active && (
                              <span className="inline-block w-1 h-1 rounded-full bg-gold" aria-hidden="true" />
                            )}
                            <span>{l.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="p-6 border-t border-navy/10 space-y-4 bg-mist/40">
              <LanguageSwitcher variant="inline" />
              <Link
                to="/book"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] ring-1 ring-gold/60 hover:bg-academic transition-colors"
              >
                <Calendar size={14} strokeWidth={1.75} className="text-gold" />
                {t("nav.book")}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
