import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type LangCode } from "@/i18n";
import {
  LayoutDashboard, Users, Calendar, CalendarDays, Stethoscope, FileHeart, FlaskConical, ClipboardList,
  MessageSquare, Receipt, Contact, Beaker, Newspaper, PanelsTopLeft, MessageSquareWarning,
  BarChart3, FilePieChart, Files, ListChecks, Bell, Settings, Search, ChevronsLeft, ChevronsRight,
  Plus, HelpCircle, Globe, LogOut, X, Menu, Command, Video,
} from "lucide-react";
import { clinic, notifications as demoNotifs } from "@/data/admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — JC Integrative Health" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

type Item = { to: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>; group: string };

const NAV: Item[] = [
  { to: "/admin", label: "overview", icon: LayoutDashboard, group: "practice" },
  { to: "/admin/patients", label: "patients", icon: Users, group: "practice" },
  { to: "/admin/appointments", label: "appointments", icon: Calendar, group: "practice" },
  { to: "/admin/calendar", label: "calendar", icon: CalendarDays, group: "practice" },
  { to: "/admin/instant-room", label: "instantRoom", icon: Video, group: "practice" },

  { to: "/admin/clinical", label: "clinical", icon: Stethoscope, group: "clinical" },
  { to: "/admin/records", label: "records", icon: FileHeart, group: "clinical" },
  { to: "/admin/labs", label: "labs", icon: FlaskConical, group: "clinical" },
  { to: "/admin/care-plans", label: "carePlans", icon: ClipboardList, group: "clinical" },

  { to: "/admin/messages", label: "messages", icon: MessageSquare, group: "relations" },
  { to: "/admin/billing", label: "billing", icon: Receipt, group: "relations" },
  { to: "/admin/crm", label: "crm", icon: Contact, group: "relations" },

  { to: "/admin/research", label: "research", icon: Beaker, group: "editorial" },
  { to: "/admin/insights", label: "insights", icon: Newspaper, group: "editorial" },
  { to: "/admin/website", label: "website", icon: PanelsTopLeft, group: "editorial" },
  { to: "/admin/comments", label: "comments", icon: MessageSquareWarning, group: "editorial" },

  { to: "/admin/analytics", label: "analytics", icon: BarChart3, group: "operations" },
  { to: "/admin/reports", label: "reports", icon: FilePieChart, group: "operations" },
  { to: "/admin/documents", label: "documents", icon: Files, group: "operations" },
  { to: "/admin/tasks", label: "tasks", icon: ListChecks, group: "operations" },
  { to: "/admin/notifications", label: "notifications", icon: Bell, group: "operations" },
  { to: "/admin/settings", label: "settings", icon: Settings, group: "operations" },
];

const GROUPS = ["practice", "clinical", "relations", "editorial", "operations"] as const;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setMobileOpen(false); setCmdOpen(false); setNotifOpen(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen((v) => !v); }
      if (e.key === "Escape") { setCmdOpen(false); setNotifOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) => to === "/admin" ? pathname === "/admin" : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-paper text-navy">
      {/* Sidebar — desktop */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-navy/10 bg-card transition-[width] duration-200 ${collapsed ? "w-14" : "w-56"}`}
      >
        <SidebarBody collapsed={collapsed} isActive={isActive} onCollapse={() => setCollapsed((v) => !v)} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card border-r border-navy/10 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-navy/10">
              <span className="font-serif text-lg text-navy">JC Admin</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-navy/60 hover:text-navy"><X size={18} /></button>
            </div>
            <SidebarBody collapsed={false} isActive={isActive} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-14" : "lg:pl-56"}`}>
        <TopBar
          onOpenMobile={() => setMobileOpen(true)}
          onOpenCmd={() => setCmdOpen(true)}
          onOpenNotif={() => setNotifOpen(true)}
        />
        <main className="p-5 md:p-8 lg:p-10 max-w-[1440px] mx-auto">
          <Outlet />
        </main>
        <AdminFooter />
      </div>

      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
      {notifOpen && <NotificationsDrawer onClose={() => setNotifOpen(false)} />}
    </div>
  );
}

function AdminFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-navy/8 mt-12 py-5 px-5 md:px-10 flex flex-col md:flex-row justify-between gap-2 text-[11px] uppercase tracking-widest text-navy/40">
      <span>© {new Date().getFullYear()} {clinic.name} · {t("admin.footer.private")}</span>
      <span>{t("admin.footer.preview")}</span>
    </footer>
  );
}

function SidebarBody({ collapsed, isActive, onCollapse }: { collapsed: boolean; isActive: (to: string) => boolean; onCollapse?: () => void }) {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-navy/8">
        <div className="h-9 w-9 border border-navy/15 flex items-center justify-center font-serif text-sm text-navy shrink-0 bg-paper">JC</div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-serif text-sm text-navy truncate leading-tight">JC Integrative Health</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-navy/40">{t("admin.sidebar.privateAdmin")}</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-5">
        {GROUPS.map((g) => (
          <div key={g} className="mb-5">
            {!collapsed && <div className="px-4 mb-2 text-[10px] uppercase tracking-[0.24em] text-navy/35 font-medium">{t(`admin.groups.${g}`)}</div>}
            {NAV.filter((i) => i.group === g).map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex items-center gap-3 px-4 py-2 text-sm transition-colors ${active ? "text-navy" : "text-navy/55 hover:text-navy"}`}
                >
                  <span className={`inline-block h-4 w-0.5 -ml-4 ${active ? "bg-gold" : "bg-transparent"}`} />
                  <item.icon size={15} strokeWidth={1.5} className="shrink-0" />
                  {!collapsed && <span className="truncate font-medium">{t(`admin.nav.${item.label}`)}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-navy/8 p-3 space-y-1">
        {onCollapse && (
          <button onClick={onCollapse} className="w-full flex items-center gap-3 px-2 py-2 text-[11px] uppercase tracking-widest text-navy/45 hover:text-navy transition-colors">
            {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />} {!collapsed && t("admin.sidebar.collapse")}
          </button>
        )}
        <Link to="/" className="w-full flex items-center gap-3 px-2 py-2 text-[11px] uppercase tracking-widest text-navy/45 hover:text-navy transition-colors">
          <LogOut size={14} strokeWidth={1.5} /> {!collapsed && t("admin.sidebar.backToSite")}
        </Link>
      </div>
    </>
  );
}

function TopBar({ onOpenMobile, onOpenCmd, onOpenNotif }: { onOpenMobile: () => void; onOpenCmd: () => void; onOpenNotif: () => void }) {
  const { t, i18n } = useTranslation();
  const unread = demoNotifs.filter((n) => !n.read).length;
  const localeMap: Record<LangCode, string> = { en: "en-US", es: "es-ES", pt: "pt-BR", zh: "zh-CN" };
  const active = (i18n.language.split("-")[0] as LangCode) || "en";
  const today = new Date().toLocaleDateString(localeMap[active] ?? "en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <header className="sticky top-0 z-30 border-b border-navy/8 bg-paper/90 backdrop-blur">
      <div className="flex items-center gap-3 px-4 md:px-6 h-14">
        <button className="lg:hidden text-navy/60 hover:text-navy" onClick={onOpenMobile} aria-label="Open menu">
          <Menu size={18} strokeWidth={1.5} />
        </button>

        <button
          onClick={onOpenCmd}
          className="hidden md:flex items-center gap-2 h-9 border border-navy/10 bg-card px-3 min-w-0 flex-1 max-w-md text-navy/45 hover:border-navy/25 transition-colors"
        >
          <Search size={13} strokeWidth={1.5} />
          <span className="text-sm truncate">{t("admin.topbar.search")}</span>
          <span className="ml-auto text-[10px] uppercase tracking-widest border border-navy/10 px-1.5 py-0.5 flex items-center gap-1 text-navy/40"><Command size={10} /> K</span>
        </button>

        <div className="flex-1 md:hidden text-[11px] uppercase tracking-[0.2em] text-navy/45">{today}</div>

        <div className="ml-auto flex items-center gap-1 md:gap-1.5">
          <span className="hidden xl:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-navy/45 mr-3">
            <span className="h-1.5 w-1.5 rounded-full bg-teal/80" /> {t("admin.topbar.clinicOnline")} · {today}
          </span>

          <QuickActions />

          <button onClick={onOpenNotif} className="relative h-9 w-9 grid place-items-center text-navy/55 hover:text-navy transition-colors" aria-label={t("admin.topbar.notifications")}>
            <Bell size={16} strokeWidth={1.5} />
            {unread > 0 && <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-gold" />}
          </button>

          <button className="h-9 w-9 grid place-items-center text-navy/55 hover:text-navy transition-colors" aria-label={t("admin.topbar.help")}><HelpCircle size={15} strokeWidth={1.5} /></button>

          <div className="hidden md:flex items-center gap-0.5 h-9 border border-navy/10 px-2 text-[11px] uppercase tracking-widest text-navy/50">
            <Globe size={12} strokeWidth={1.5} className="mr-1" />
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { i18n.changeLanguage(l.code); try { localStorage.setItem("jc.lang", l.code); } catch {} }}
                className={`px-1.5 py-0.5 transition-colors ${active === l.code ? "text-navy" : "hover:text-navy"}`}
              >
                {l.short}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 h-9 pl-2 pr-3 border-l border-navy/8 ml-1">
            <div className="h-7 w-7 rounded-full border border-navy/15 grid place-items-center text-[10px] font-semibold text-navy bg-paper">JC</div>
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-medium text-navy">Dr. Jason Chen</div>
              <div className="text-[10px] uppercase tracking-widest text-navy/40">{t("admin.topbar.role")}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function QuickActions() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const items = [
    { label: t("admin.quick.newPatient"), to: "/admin/patients/new" },
    { label: t("admin.quick.scheduleAppointment"), to: "/admin/appointments/new" },
    { label: "Start Instant Room", to: "/admin/instant-room" },
    { label: t("admin.quick.createCarePlan"), to: "/admin/care-plans" },
    { label: t("admin.quick.sendMessage"), to: "/admin/messages" },
    { label: t("admin.quick.newResearchPost"), to: "/admin/research" },
    { label: t("admin.quick.recordPayment"), to: "/admin/billing" },
    { label: t("admin.quick.uploadDocument"), to: "/admin/documents" },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 border border-navy/15 text-navy hover:border-navy/30 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold transition-colors bg-card"
      >
        <Plus size={13} strokeWidth={2} /> <span className="hidden sm:inline">{t("admin.topbar.new")}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-card border border-navy/10 shadow-sm z-50">
            <div className="px-3 py-2 border-b border-navy/8 text-[10px] uppercase tracking-[0.2em] text-navy/40 font-medium">{t("admin.quick.title")}</div>
            {items.map((i) => (
              <Link key={i.to} to={i.to} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-navy/70 hover:bg-mist/40 hover:text-navy transition-colors">
                {i.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const groups = [
    { label: t("admin.cmd.pages"), items: NAV.slice(0, 12).map((n) => ({ label: t(`admin.nav.${n.label}`), to: n.to })) },
    { label: t("admin.cmd.patients"), items: [{ label: "Amelia Reyes · P-1042", to: "/admin/patients/P-1042" }, { label: "Rafael Marques · P-1043", to: "/admin/patients/P-1043" }, { label: "Sofía Lopez · P-1044", to: "/admin/patients/P-1044" }] },
    { label: t("admin.cmd.appointments"), items: [{ label: "A-8801 · Amelia Reyes", to: "/admin/appointments/A-8801" }, { label: "A-8802 · Rafael Marques", to: "/admin/appointments/A-8802" }] },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-navy/15" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-card border border-navy/10 shadow-sm">
        <div className="flex items-center gap-2 px-4 h-12 border-b border-navy/8">
          <Search size={14} strokeWidth={1.5} className="text-navy/45" />
          <input autoFocus placeholder={t("admin.cmd.placeholder")} className="flex-1 bg-transparent outline-none text-sm placeholder:text-navy/40" />
          <kbd className="text-[10px] uppercase tracking-widest border border-navy/10 px-1.5 py-0.5 text-navy/40">Esc</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {groups.map((g) => (
            <div key={g.label} className="border-b border-navy/8 last:border-b-0">
              <div className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-navy/40 font-medium">{g.label}</div>
              {g.items.map((i) => (
                <Link key={i.to + i.label} to={i.to} onClick={onClose} className="flex items-center justify-between px-4 py-2 text-sm text-navy/70 hover:bg-mist/40 hover:text-navy transition-colors">
                  {i.label} <span className="text-[10px] text-navy/35">↵</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsDrawer({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-navy/15" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 w-full sm:w-96 bg-card border-l border-navy/8 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-navy/8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">{t("admin.notif.eyebrow")}</div>
            <div className="font-serif text-lg text-navy mt-0.5">{t("admin.notif.title")}</div>
          </div>
          <button onClick={onClose} className="text-navy/55 hover:text-navy transition-colors"><X size={18} /></button>
        </header>
        <div className="flex-1 overflow-y-auto">
          {demoNotifs.map((n) => (
            <div key={n.id} className="p-4 border-b border-navy/5 hover:bg-mist/30 transition-colors">
              <div className="flex items-start gap-3">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${n.read ? "bg-navy/20" : "bg-gold/80"}`} />
                <div className="min-w-0">
                  <div className="text-sm text-navy/80">{n.text}</div>
                  <div className="text-[10px] uppercase tracking-widest text-navy/40 mt-1">{n.type} · {n.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-navy/8 flex items-center justify-between text-xs">
          <button className="text-navy/55 hover:text-navy uppercase tracking-widest transition-colors">{t("admin.notif.markAll")}</button>
          <Link to="/admin/notifications" onClick={onClose} className="text-navy/55 hover:text-navy uppercase tracking-widest transition-colors">{t("admin.notif.openCenter")}</Link>
        </div>
      </aside>
    </div>
  );
}
