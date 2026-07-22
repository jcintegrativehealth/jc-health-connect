import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home, Calendar, User, Menu, X, ChevronRight,
} from "lucide-react";
import { useMyProfile, displayName, initials } from "@/lib/profile";

export const Route = createFileRoute("/_authenticated/patient")({
  head: () => ({
    meta: [
      { title: "Patient Portal — JC Integrative Health" },
      { name: "description", content: "Private patient portal." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PatientLayout,
});

// Phase-1 portal: only sections backed by real data are exposed. Other
// clinical areas (labs, care plans, medications, messages, documents, forms,
// billing) return once their backend + admin entry surfaces ship.
const NAV = [
  { to: "/patient", label: "Home", icon: Home, exact: true },
  { to: "/patient/appointments", label: "Appointments", icon: Calendar },
  { to: "/patient/profile", label: "Profile", icon: User },
] as const;

const BOTTOM_NAV = [
  { to: "/patient", label: "Home", icon: Home, exact: true },
  { to: "/patient/appointments", label: "Visits", icon: Calendar },
  { to: "/patient/profile", label: "Profile", icon: User },
] as const;

// Sections that are live in phase 1. Anything else under /patient/* still has a
// mock route file (unlinked from the menu) — send those back to Home so real
// patients never land on illustrative clinical data by direct URL.
const ALLOWED_PREFIXES = ["/patient/appointments", "/patient/profile"];

function PatientLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useMyProfile();

  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    const allowed = pathname === "/patient" || ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!allowed) navigate({ to: "/patient", replace: true });
  }, [pathname, navigate]);

  const active = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-paper text-navy">
      {/* Desktop sidebar — mirrors admin */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-navy/10 bg-card transition-[width] duration-200 ${collapsed ? "w-14" : "w-56"}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-navy/8">
          <div className="h-9 w-9 border border-navy/15 flex items-center justify-center font-serif text-sm text-navy shrink-0 bg-paper">JC</div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-serif text-sm text-navy truncate leading-tight">JC Integrative Health</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-navy/40">Patient Portal</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4">
          {NAV.map((n) => {
            const isActive = active(n.to, "exact" in n && n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`group flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isActive ? "text-navy" : "text-navy/55 hover:text-navy"}`}
              >
                <span className={`inline-block h-4 w-0.5 -ml-4 ${isActive ? "bg-gold" : "bg-transparent"}`} />
                <n.icon size={15} strokeWidth={1.5} className="shrink-0" />
                {!collapsed && <span className="truncate font-medium">{n.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-navy/8 p-3 space-y-1">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center gap-3 px-2 py-2 text-[11px] uppercase tracking-widest text-navy/45 hover:text-navy transition-colors"
          >
            {collapsed ? "»" : "« Collapse"}
          </button>
          <Link to="/" className="w-full flex items-center gap-3 px-2 py-2 text-[11px] uppercase tracking-widest text-navy/45 hover:text-navy transition-colors">
            ← Back to site
          </Link>
          <button
            onClick={async () => { const { signOut } = await import("@/lib/auth"); await signOut(); window.location.assign("/portal"); }}
            className="w-full flex items-center gap-3 px-2 py-2 text-[11px] uppercase tracking-widest text-navy/45 hover:text-navy transition-colors"
          >
            {collapsed ? "⎋" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-navy/30" onClick={() => setDrawerOpen(false)} />
          <aside className="relative w-72 max-w-[85%] bg-card border-r border-navy/10 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-navy/8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 border border-navy/15 grid place-items-center font-serif text-sm text-navy bg-paper">JC</div>
                <div className="font-serif text-navy">Patient Portal</div>
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="text-navy/60 hover:text-navy"><X size={18} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3">
              {NAV.map((n) => {
                const isActive = active(n.to, "exact" in n && n.exact);
                return (
                  <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${isActive ? "text-navy" : "text-navy/60 hover:text-navy"}`}>
                    <span className={`inline-block h-4 w-0.5 -ml-4 ${isActive ? "bg-gold" : "bg-transparent"}`} />
                    <n.icon size={15} strokeWidth={1.5} /> {n.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-14" : "lg:pl-56"}`}>
        {/* Topbar — mirrors admin */}
        <header className="sticky top-0 z-30 border-b border-navy/8 bg-paper/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 md:px-6 h-14">
            <button className="lg:hidden text-navy/60 hover:text-navy" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <Menu size={18} strokeWidth={1.5} />
            </button>

            <PageTitle />

            <div className="ml-auto flex items-center gap-1 md:gap-1.5">
              <Link to="/patient/profile" className="flex items-center gap-2 h-9 pl-2 pr-3">
                <div className="h-7 w-7 rounded-full border border-navy/15 grid place-items-center text-[10px] font-semibold text-navy bg-paper">{initials(profile)}</div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-xs font-medium text-navy">{displayName(profile) || "Patient"}</div>
                  <div className="text-[10px] uppercase tracking-widest text-navy/40">Patient</div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-5 md:p-8 lg:p-10 pb-24 lg:pb-10 max-w-[1440px] mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-navy/8 mt-12 py-5 px-5 md:px-10 flex flex-col md:flex-row justify-between gap-2 text-[11px] uppercase tracking-widest text-navy/40">
          <span>© {new Date().getFullYear()} JC Integrative Health · Patient Portal</span>
          <span>Not for emergencies · Call 911</span>
        </footer>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-paper/95 backdrop-blur border-t border-navy/10 grid grid-cols-3">
          {BOTTOM_NAV.map((n) => {
            const isActive = active(n.to, "exact" in n && n.exact);
            return (
              <Link key={n.to} to={n.to} className={`flex flex-col items-center justify-center py-2 gap-1 text-[10px] ${isActive ? "text-navy" : "text-navy/50"}`}>
                <n.icon size={17} strokeWidth={1.6} />
                <span>{n.label}</span>
                {isActive && <span className="h-0.5 w-6 bg-gold rounded-full" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function PageTitle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const match = NAV.slice().reverse().find((n) => (n.to === "/patient" ? pathname === "/patient" : pathname === n.to || pathname.startsWith(n.to + "/")));
  return (
    <div className="hidden lg:flex items-center gap-2 text-navy/45 text-[11px] font-mono uppercase tracking-[0.2em] pl-1">
      <ChevronRight size={12} className="text-navy/25" />
      <span>{match?.label ?? "Portal"}</span>
    </div>
  );
}

// Shared UI helpers exported for sub-routes
export function PortalCard({ title, meta, action, children, className = "" }: { title?: string; meta?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-navy/10 rounded-sm p-5 ${className}`}>
      {(title || meta || action) && (
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <div>
            {title && <div className="eyebrow text-navy/60 text-[11px]">{title}</div>}
          </div>
          <div className="flex items-center gap-3">
            {meta && <div className="font-mono text-[10px] text-navy/40 uppercase tracking-widest">{meta}</div>}
            {action}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function PortalPageHeader({ eyebrow, title, lede, actions }: { eyebrow?: string; title: string; lede?: string; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow text-gold text-[11px] mb-2">{eyebrow}</div>}
        <h1 className="font-serif text-3xl sm:text-4xl text-navy leading-[1.05] tracking-[-0.01em]">{title}</h1>
        {lede && <p className="mt-2 text-sm text-navy/60 max-w-2xl">{lede}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warn" | "danger" | "info" | "gold" }) {
  const map = {
    neutral: "bg-mist text-navy/70 border-navy/10",
    success: "bg-teal/30 text-navy border-teal/40",
    warn: "bg-gold/15 text-navy border-gold/40",
    danger: "bg-destructive/10 text-destructive border-destructive/30",
    info: "bg-academic/10 text-academic border-academic/30",
    gold: "bg-gold/15 text-navy border-gold/40",
  } as const;
  return <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] font-mono uppercase tracking-widest ${map[tone]}`}>{children}</span>;
}

export function BtnPrimary({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.16em] hover:bg-academic transition-colors disabled:bg-navy/30 disabled:cursor-not-allowed rounded-sm ${className}`}
    >
      {children}
    </button>
  );
}

export function BtnGhost({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.16em] hover:bg-mist rounded-sm ${className}`}
    >
      {children}
    </button>
  );
}

export function Sparkline({ data, className = "" }: { data: number[]; className?: string }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`w-full h-10 ${className}`} aria-hidden>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Disclaim({ children }: { children: ReactNode }) {
  return <div className="border-l-2 border-gold/60 bg-gold/5 px-4 py-3 text-[12px] text-navy/70 leading-relaxed rounded-sm">{children}</div>;
}

export function EmergencyBar() {
  return (
    <div className="border border-destructive/25 bg-destructive/5 text-destructive px-4 py-2 text-xs rounded-sm flex items-start gap-2">
      <span className="font-mono uppercase tracking-widest text-[10px] bg-destructive/10 px-1.5 py-0.5 rounded-sm mt-0.5">Emergency</span>
      <span className="text-navy/75">This portal is not for emergencies. Call 911 or your local emergency services if you are experiencing a medical emergency.</span>
    </div>
  );
}
