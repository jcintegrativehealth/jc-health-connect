import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-navy text-paper pt-24 pb-12 px-6 mt-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-baseline gap-2 mb-6">
              <span className="font-serif text-2xl font-semibold tracking-tight">JC</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/60">Integrative Health</span>
            </Link>
            <p className="text-sm text-paper/55 max-w-[34ch] leading-relaxed">{t("footer.tagline")}</p>
            <div className="mt-8 max-w-sm">
              <div className="eyebrow text-paper/50 mb-3">{t("footer.newsletterTitle")}</div>
              <p className="text-xs text-paper/50 mb-4">{t("footer.newsletterCopy")}</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex border-b border-paper/20 pb-2">
                <input type="email" required placeholder={t("footer.newsletterEmail")} className="bg-transparent text-sm flex-1 outline-none placeholder:text-paper/30" />
                <button type="submit" className="text-teal font-mono uppercase text-xs tracking-widest px-3 hover:text-paper">→</button>
              </form>
            </div>
          </div>

          <FooterCol title={t("footer.columns.care")}>
            <FLink to="/services">{t("nav.services")}</FLink>
            <FLink to="/telehealth">{t("footer.links.telehealth")}</FLink>
            <FLink to="/book">{t("nav.book")}</FLink>
            <FLink to="/portal">{t("nav.portal")}</FLink>
          </FooterCol>

          <FooterCol title={t("footer.columns.research")}>
            <FLink to="/research" disabled>{t("footer.links.researchLibrary")}</FLink>
            <FLink to="/insights" disabled>{t("nav.insights")}</FLink>
            <FLink to="/innovation" disabled>{t("nav.innovation")}</FLink>
            <FLink to="/medications" disabled>{t("footer.links.medicationUpdates")}</FLink>
          </FooterCol>

          <FooterCol title={t("footer.columns.resources")}>
            <FLink to="/patient-resources">{t("footer.links.patientResources")}</FLink>
            <FLink to="/faq">{t("footer.links.faq")}</FLink>
            <FLink to="/conditions">{t("footer.links.conditions")}</FLink>
            <FLink to="/physicians">{t("footer.links.guestPhysicians")}</FLink>
          </FooterCol>

          <FooterCol title={t("footer.columns.contact")}>
            <FLink to="/locations/colorado">{t("footer.links.colorado")}</FLink>
            <FLink to="/locations/washington">{t("footer.links.washington")}</FLink>
            <FLink to="/contact">{t("nav.contact")}</FLink>
            <FLink to="/dr-chen">{t("footer.links.drChen")}</FLink>
          </FooterCol>
        </div>

        <div className="pt-10 border-t border-paper/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-paper/40">{t("footer.rights")}</p>
          <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.2em] text-paper/40">
            <Link to="/legal/$slug" params={{ slug: "privacy" }} className="hover:text-paper">{t("footer.privacy")}</Link>
            <Link to="/legal/$slug" params={{ slug: "terms" }} className="hover:text-paper">{t("footer.terms")}</Link>
            <Link to="/legal/$slug" params={{ slug: "hipaa" }} className="hover:text-paper">{t("footer.hipaa")}</Link>
            <Link to="/legal/$slug" params={{ slug: "medical-disclaimer" }} className="hover:text-paper">{t("footer.disclaimer")}</Link>
            <Link to="/legal/$slug" params={{ slug: "accessibility" }} className="hover:text-paper col-span-2 sm:col-span-1 md:col-span-auto">{t("footer.links.accessibility")}</Link>
          </div>
          {import.meta.env.DEV && (
            <div className="mt-6 pt-4 border-t border-paper/10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.24em] text-gold/70">
              <span className="h-1 w-1 rounded-full bg-gold/70" />
              <Link to="/admin" className="hover:text-gold">{t("footer.links.adminPreview")}</Link>
            </div>
          )}

        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal mb-6">{title}</h5>
      <ul className="space-y-3 text-sm text-paper/60">{children}</ul>
    </div>
  );
}

function FLink({ to, children, disabled }: { to: string; children: React.ReactNode; disabled?: boolean }) {
  if (disabled) {
    return (
      <li>
        <span className="text-paper/30 cursor-not-allowed flex items-center gap-2">
          {children}
          <span className="text-[10px] uppercase tracking-widest">Soon</span>
        </span>
      </li>
    );
  }
  return (
    <li>
      <Link to={to} className="hover:text-paper transition-colors">{children}</Link>
    </li>
  );
}
