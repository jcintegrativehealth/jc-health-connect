import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

// Hero nav: essentials only. Secondary pages live in the footer.
const NAV: { to: string; key: string }[] = [
  { to: "/about", key: "nav.about" },
  { to: "/services", key: "nav.services" },
  { to: "/insights", key: "nav.insights" },
  { to: "/contact", key: "nav.contact" },
];

// Full sitemap surfaces in the mobile drawer for discoverability.
const DRAWER_MORE: { to: string; key: string }[] = [
  { to: "/research", key: "nav.research" },
  { to: "/innovation", key: "nav.innovation" },
  { to: "/physicians", key: "nav.physicians" },
  { to: "/patient-resources", key: "nav.patientResources" },
];

export function Header() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2 shrink-0">
            <span className="font-serif text-2xl font-semibold tracking-tight text-navy">JC</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-navy/60">Integrative Health</span>
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

          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em] ring-1 ring-navy hover:bg-academic transition-colors"
            >
              {t("nav.book")}
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
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-paper shadow-2xl flex flex-col">
            <div className="h-20 px-6 flex items-center justify-between border-b border-navy/5">
              <span className="font-serif text-xl font-semibold text-navy">Menu</span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="w-11 h-11 grid place-items-center text-navy">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-lg font-medium text-navy border-b border-navy/5 hover:text-teal"
                >
                  {t(n.key)}
                </Link>
              ))}
              <Link to="/portal" onClick={() => setMobileOpen(false)} className="py-3 text-lg font-medium text-navy border-b border-navy/5">
                {t("nav.portal")}
              </Link>
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-3 text-lg font-medium text-navy border-b border-navy/5">
                Admin
              </Link>
            </nav>
            <div className="p-6 border-t border-navy/5 space-y-4">
              <LanguageSwitcher variant="inline" />
              <Link
                to="/book"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-3 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.18em]"
              >
                {t("nav.book")}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
