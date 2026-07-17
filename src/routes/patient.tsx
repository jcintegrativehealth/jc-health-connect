import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home, Calendar, HeartPulse, FlaskConical, ClipboardList, Pill, MessageSquare,
  FileText, ClipboardCheck, Receipt, Sparkles, BookOpen, Bell, User, HelpCircle,
  Search, Menu, X, Globe, ChevronRight, Video, LifeBuoy,
} from "lucide-react";

export const Route = createFileRoute("/patient")({
  head: () => ({
    meta: [
      { title: "Patient Portal — JC Integrative Health" },
      { name: "description", content: "Private patient portal (demonstration)." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PatientLayout,
});

const NAV = [
  { to: "/patient", label: "Home", icon: Home, exact: true },
  { to: "/patient/appointments", label: "Appointments", icon: Calendar },
  { to: "/patient/telehealth", label: "Telehealth", icon: Video },
  { to: "/patient/health", label: "My Health", icon: HeartPulse },
  { to: "/patient/labs", label: "Lab Results", icon: FlaskConical },
  { to: "/patient/care-plan", label: "Care Plan", icon: ClipboardList },
  { to: "/patient/medications", label: "Medications", icon: Pill },
  { to: "/patient/messages", label: "Messages", icon: MessageSquare },
  { to: "/patient/documents", label: "Documents", icon: FileText },
  { to: "/patient/forms", label: "Forms", icon: ClipboardCheck },
  { to: "/patient/billing", label: "Billing", icon: Receipt },
  { to: "/patient/programs", label: "Health Programs", icon: Sparkles },
  { to: "/patient/education", label: "Education", icon: BookOpen },
  { to: "/patient/notifications", label: "Notifications", icon: Bell },
  { to: "/patient/profile", label: "Profile", icon: User },
  { to: "/patient/help", label: "Help & Support", icon: HelpCircle },
] as const;

const BOTTOM_NAV = [
  { to: "/patient", label: "Home", icon: Home, exact: true },
  { to: "/patient/appointments", label: "Visits", icon: Calendar },
  { to: "/patient/messages", label: "Inbox", icon: MessageSquare },
  { to: "/patient/care-plan", label: "Care", icon: ClipboardList },
] as const;

function PatientLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setDrawerOpen(false), [pathname]);

  const active = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-mist/40 text-navy">
      {/* Demo banner */}
      <div className="bg-gold/10 border-b border-gold/25 text-navy/75 text-[11px] px-4 py-1.5 text-center tracking-wide font-mono">
        Demonstration portal — no real medical, personal or billing data is processed.
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 top-[30px] left-0 z-30 flex-col bg-navy text-paper border-r border-navy/40 transition-[width] duration-200 ${collapsed ? "w-14" : "w-60"}`}
      >
        <div className="px-4 py-5 border-b border-paper/10 flex items-center gap-2">
          <div className="h-7 w-7 rounded-sm bg-gold/90 grid place-items-center text-navy font-serif text-sm">JC</div>
          {!collapsed && (
            <div>
              <div className="font-serif text-base leading-tight">JC Integrative</div>
              <div className="eyebrow text-[9px] text-paper/60">Patient Portal</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map((n) => {
            const isActive = active(n.to, "exact" in n && n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`group flex items-center gap-3 px-3 py-2 rounded-sm text-[13px] transition-colors ${
                  isActive ? "bg-academic text-paper" : "text-paper/70 hover:bg-academic/40 hover:text-paper"
                }`}
              >
                <n.icon size={15} strokeWidth={1.6} className="shrink-0" />
                {!collapsed && <span className="truncate">{n.label}</span>}
                {!collapsed && isActive && <span className="ml-auto h-1 w-1 rounded-full bg-gold" />}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="border-t border-paper/10 py-2.5 text-[10px] font-mono uppercase tracking-widest text-paper/50 hover:text-paper"
        >
          {collapsed ? "»" : "« Collapse"}
        </button>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="relative w-72 max-w-[85%] bg-navy text-paper flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-paper/10">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-sm bg-gold/90 grid place-items-center text-navy font-serif text-sm">JC</div>
                <div className="font-serif">Patient Portal</div>
              </div>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu"><X size={18} /></button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
              {NAV.map((n) => {
                const isActive = active(n.to, "exact" in n && n.exact);
                return (
                  <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-3 rounded-sm text-sm ${isActive ? "bg-academic" : "text-paper/75 hover:bg-academic/40"}`}>
                    <n.icon size={16} strokeWidth={1.6} /> {n.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className={`min-h-screen flex flex-col ${collapsed ? "lg:pl-14" : "lg:pl-60"}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur border-b border-navy/10">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-14">
            <button className="lg:hidden text-navy" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
              <Menu size={20} />
            </button>
            <Link to="/patient" className="lg:hidden font-serif text-navy text-lg">JC Portal</Link>

            <PageTitle />

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="h-9 hidden sm:flex items-center gap-2 px-3 rounded-sm border border-navy/10 bg-mist/60 text-navy/60 text-xs hover:border-navy/25 min-w-[220px]"
                aria-label="Search portal"
              >
                <Search size={13} /> Search appointments, labs, documents…
              </button>
              <button onClick={() => setSearchOpen(true)} className="sm:hidden p-2 text-navy/70" aria-label="Search"><Search size={17} /></button>

              <Link to="/patient/notifications" className="relative p-2 text-navy/70 hover:text-navy" aria-label="Notifications">
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
              </Link>
              <Link to="/patient/help" className="hidden sm:inline-flex p-2 text-navy/70 hover:text-navy" aria-label="Help"><LifeBuoy size={17} /></Link>
              <button className="hidden sm:inline-flex items-center gap-1.5 p-2 text-navy/70 hover:text-navy text-xs font-mono uppercase tracking-widest" aria-label="Language">
                <Globe size={15} /> EN
              </button>
              <Link to="/patient/profile" className="flex items-center gap-2 pl-2 border-l border-navy/10 ml-1">
                <div className="h-8 w-8 rounded-full bg-teal/40 text-navy font-serif grid place-items-center text-sm">EC</div>
                <div className="hidden md:block leading-tight">
                  <div className="text-xs font-medium text-navy">Emily Carter</div>
                  <div className="text-[10px] text-navy/50 font-mono uppercase tracking-widest">Patient</div>
                </div>
              </Link>
            </div>
          </div>
          <NextVisitStrip />
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-10 pb-24 lg:pb-10 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="hidden lg:block border-t border-navy/10 bg-paper px-8 py-4 text-[11px] text-navy/50 font-mono uppercase tracking-widest flex-none">
          <div className="flex items-center justify-between">
            <span>JC Integrative Health · Patient Portal (demo)</span>
            <span>Not for emergencies. Call 911 for medical emergencies.</span>
          </div>
        </footer>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-paper/95 backdrop-blur border-t border-navy/10 grid grid-cols-5">
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
          <button onClick={() => setDrawerOpen(true)} className="flex flex-col items-center justify-center py-2 gap-1 text-[10px] text-navy/50">
            <Menu size={17} strokeWidth={1.6} />
            <span>More</span>
          </button>
        </nav>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

function PageTitle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const match = NAV.slice().reverse().find((n) => (n.to === "/patient" ? pathname === "/patient" : pathname === n.to || pathname.startsWith(n.to + "/")));
  return (
    <div className="hidden lg:flex items-center gap-2 text-navy/70 text-[13px] font-mono uppercase tracking-widest">
      <ChevronRight size={13} className="text-navy/30" />
      <span>{match?.label ?? "Portal"}</span>
    </div>
  );
}

function NextVisitStrip() {
  return (
    <div className="border-t border-navy/8 bg-mist/50 px-4 lg:px-8 py-2 text-[11px] flex flex-wrap items-center gap-x-4 gap-y-1 text-navy/70 font-mono uppercase tracking-widest">
      <span className="text-navy/50">Next visit</span>
      <span className="text-navy">Fri · Jul 24 · 10:30 AM MST</span>
      <span className="text-navy/40">·</span>
      <span>Dr. Jason Chen · Telehealth</span>
      <Link to="/patient/telehealth/waiting-room" className="ml-auto inline-flex items-center gap-1 text-gold hover:text-navy">
        Preview waiting room <ChevronRight size={12} />
      </Link>
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const groups: { title: string; items: { label: string; to: string }[] }[] = [
    { title: "Appointments", items: [{ label: "Follow-up · Jul 24", to: "/patient/appointments/apt-2026-0917" }, { label: "Longevity review · Aug 14", to: "/patient/appointments/apt-2026-1105" }] },
    { title: "Lab Results", items: [{ label: "Comprehensive Metabolic Panel", to: "/patient/labs/lab-metab-jul26" }, { label: "Advanced Lipid Panel", to: "/patient/labs/lab-lipid-jun26" }] },
    { title: "Documents", items: [{ label: "Care Plan v3", to: "/patient/documents" }, { label: "Visit summary Jul 02", to: "/patient/documents" }] },
    { title: "Care Plan", items: [{ label: "Metabolic Reset & Longevity Foundation", to: "/patient/care-plan" }] },
    { title: "Messages", items: [{ label: "Your July metabolic panel", to: "/patient/messages" }] },
    { title: "Billing", items: [{ label: "INV-2026-0501", to: "/patient/billing" }] },
  ]
    .map((g) => ({ ...g, items: g.items.filter((i) => !q || i.label.toLowerCase().includes(q.toLowerCase())) }))
    .filter((g) => g.items.length);

  return (
    <div className="fixed inset-0 z-[60] bg-navy/30 backdrop-blur-sm p-4 sm:p-16" onClick={onClose}>
      <div className="max-w-2xl mx-auto bg-paper border border-navy/15 rounded-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-navy/10">
          <Search size={16} className="text-navy/50" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search across your portal…" className="flex-1 bg-transparent outline-none text-sm" />
          <button onClick={onClose} className="text-navy/50 hover:text-navy"><X size={16} /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {groups.length === 0 && <div className="px-4 py-8 text-center text-sm text-navy/50">No results</div>}
          {groups.map((g) => (
            <div key={g.title} className="py-2">
              <div className="px-4 pb-1 text-[10px] font-mono uppercase tracking-widest text-navy/40">{g.title}</div>
              {g.items.map((i) => (
                <Link key={i.to + i.label} to={i.to} onClick={onClose} className="flex items-center justify-between px-4 py-2 hover:bg-mist text-sm text-navy">
                  <span>{i.label}</span>
                  <ChevronRight size={13} className="text-navy/30" />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
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
