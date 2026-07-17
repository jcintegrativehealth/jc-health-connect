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
import { clinic, notifications as demoNotifs, patients } from "@/data/admin";
import { toast } from "sonner";
import { Copy, Check, Loader2, AlertCircle, ExternalLink, Shield, Clock } from "lucide-react";

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
  const [instantOpen, setInstantOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setMobileOpen(false); setCmdOpen(false); setNotifOpen(false); setInstantOpen(false); }, [pathname]);
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
          onOpenInstant={() => setInstantOpen(true)}
        />
        <main className="p-5 md:p-8 lg:p-10 max-w-[1440px] mx-auto">
          <Outlet />
        </main>
        <AdminFooter />
      </div>

      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
      {notifOpen && <NotificationsDrawer onClose={() => setNotifOpen(false)} />}
      {instantOpen && <InstantRoomDrawer onClose={() => setInstantOpen(false)} />}
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

function TopBar({ onOpenMobile, onOpenCmd, onOpenNotif, onOpenInstant }: { onOpenMobile: () => void; onOpenCmd: () => void; onOpenNotif: () => void; onOpenInstant: () => void }) {
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

          <button
            onClick={onOpenInstant}
            className="hidden sm:inline-flex h-9 px-3 border border-navy/15 bg-card text-navy hover:border-navy/30 items-center gap-2 text-[11px] uppercase tracking-widest font-semibold transition-colors"
            title="Instant Room"
          >
            <Video size={13} strokeWidth={2} /> <span className="hidden md:inline">Instant Room</span>
          </button>

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

type CreatedRoom = { id: string; patientName: string; type: string; duration: number; language: string; note: string; expiresAt: number };

function makeRoomId() {
  const s = () => Math.random().toString(36).slice(2, 6);
  return `RM-${s()}-${s()}`.toUpperCase();
}

function InstantRoomDrawer({ onClose }: { onClose: () => void }) {
  const [patientId, setPatientId] = useState<string>(patients[0]?.id ?? "");
  const [type, setType] = useState("Follow-up");
  const [duration, setDuration] = useState(30);
  const [language, setLanguage] = useState("English");
  const [expiresMin, setExpiresMin] = useState(120);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedRoom | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!created) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [created]);

  const patient = patients.find((p) => p.id === patientId);
  const joinUrl = created ? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${created.id}` : "";
  const remainingMs = created ? Math.max(0, created.expiresAt - now) : 0;
  const remainingLabel = (() => {
    if (!created) return "";
    if (remainingMs <= 0) return "Expired";
    const s = Math.floor(remainingMs / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${sec.toString().padStart(2, "0")}s` : `${sec}s`;
  })();
  const expired = created ? remainingMs <= 0 : false;
  const totalMs = created ? created.expiresAt - (created.expiresAt - expiresMin * 60_000) : 1;
  const progressPct = created ? Math.max(0, Math.min(100, (remainingMs / totalMs) * 100)) : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!patientId) e.patientId = "Select a patient";
    if (!type) e.type = "Choose a visit type";
    if (!duration || duration < 5) e.duration = "Duration must be at least 5 min";
    if (!expiresMin || expiresMin < 5) e.expiresMin = "Expiration must be at least 5 min";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setSubmitError(null);
    if (!validate()) {
      toast.error("Please review the highlighted fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    // simulated ~10% failure
    if (Math.random() < 0.1) {
      setLoading(false);
      setSubmitError("We couldn't create the room. Please try again.");
      toast.error("Failed to create Instant Room");
      return;
    }
    const room: CreatedRoom = {
      id: makeRoomId(),
      patientName: patient?.name ?? "Patient",
      type, duration, language, note,
      expiresAt: Date.now() + expiresMin * 60_000,
    };
    setCreated(room);
    setLoading(false);
    toast.success("Instant Room created — share the secure link.");
  };

  const copy = async () => {
    if (!joinUrl || expired) return;
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      toast.success("Secure link copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy link. Please copy manually.");
    }
  };

  const reset = () => { setCreated(null); setSubmitError(null); setCopied(false); };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-navy/20 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 w-full sm:w-[440px] bg-paper border-l border-navy/10 flex flex-col shadow-xl">
        <header className="flex items-start justify-between p-5 border-b border-navy/10">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">Telehealth</div>
            <div className="font-serif text-xl text-navy mt-0.5">Instant Room</div>
            <div className="text-[11px] text-navy/50 mt-1 flex items-center gap-1.5"><Shield size={11} /> Encrypted · Single-use link</div>
          </div>
          <button onClick={onClose} className="text-navy/55 hover:text-navy transition-colors" aria-label="Close"><X size={18} /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {!created ? (
            <div className="space-y-4">
              {submitError && (
                <div className="flex items-start gap-2 border border-terracotta/40 bg-terracotta/5 px-3 py-2.5 text-sm text-terracotta">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{submitError}</div>
                    <button onClick={submit} className="mt-1 text-[11px] uppercase tracking-widest underline">Retry</button>
                  </div>
                </div>
              )}

              <FieldRow label="Patient" error={errors.patientId}>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  disabled={loading}
                  className={`w-full h-10 border bg-card px-3 text-sm text-navy outline-none focus:border-teal ${errors.patientId ? "border-terracotta" : "border-navy/15"}`}
                >
                  <option value="">Select a patient…</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} · {p.id}</option>
                  ))}
                </select>
              </FieldRow>

              <FieldRow label="Visit type" error={errors.type}>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={loading}
                  className={`w-full h-10 border bg-card px-3 text-sm text-navy outline-none focus:border-teal ${errors.type ? "border-terracotta" : "border-navy/15"}`}
                >
                  {["Follow-up", "Quick check-in", "Lab review", "Second opinion", "Coaching"].map((x) => <option key={x}>{x}</option>)}
                </select>
              </FieldRow>

              <div className="grid grid-cols-2 gap-3">
                <FieldRow label="Duration" error={errors.duration}>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    disabled={loading}
                    className="w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
                  >
                    {[10, 15, 20, 30, 45, 60].map((x) => <option key={x} value={x}>{x} min</option>)}
                  </select>
                </FieldRow>
                <FieldRow label="Language">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={loading}
                    className="w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
                  >
                    {["English", "Spanish", "Portuguese", "Mandarin"].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </FieldRow>
              </div>

              <FieldRow label="Link valid for" error={errors.expiresMin}>
                <div className="flex flex-wrap gap-1.5">
                  {[30, 60, 120, 240, 1440].map((m) => (
                    <button
                      key={m}
                      type="button"
                      disabled={loading}
                      onClick={() => setExpiresMin(m)}
                      className={`h-9 px-3 border text-[11px] uppercase tracking-widest transition-colors ${expiresMin === m ? "border-navy text-navy bg-mist/40" : "border-navy/15 text-navy/60 hover:text-navy"}`}
                    >
                      {m < 60 ? `${m} min` : m < 1440 ? `${m / 60} h` : "24 h"}
                    </button>
                  ))}
                </div>
              </FieldRow>

              <FieldRow label="Note to patient (optional)">
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. Please have your recent labs ready."
                  className="w-full border border-navy/15 bg-card p-3 text-sm text-navy outline-none focus:border-teal resize-none"
                />
              </FieldRow>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-navy/10 bg-mist/30 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold mb-1">Secure join link</div>
                <div className="flex items-center gap-2">
                  <code className={`flex-1 min-w-0 truncate text-xs font-mono bg-card border border-navy/10 px-3 h-10 flex items-center ${expired ? "text-navy/40 line-through" : "text-navy"}`}>{joinUrl}</code>
                  <button
                    onClick={copy}
                    disabled={expired}
                    className="h-10 px-3 border border-navy/15 bg-card text-navy hover:border-navy/30 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Copy link"
                  >
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-navy/45 mb-1">
                    <span className="inline-flex items-center gap-1"><Clock size={11} /> {expired ? "Expired" : `Expires in ${remainingLabel}`}</span>
                    <span>{created.duration} min · {created.language}</span>
                  </div>
                  <div className="h-1 bg-navy/8 overflow-hidden">
                    <div
                      className={`h-full transition-[width] duration-500 ${expired ? "bg-terracotta/60" : progressPct < 20 ? "bg-terracotta" : "bg-teal"}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <dl className="text-sm border border-navy/10">
                <Row k="Patient" v={created.patientName} />
                <Row k="Visit type" v={created.type} />
                {created.note && <Row k="Note" v={created.note} />}
              </dl>

              <a
                href={joinUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-widest ${expired ? "text-navy/30 pointer-events-none" : "text-navy/60 hover:text-navy"}`}
              >
                <ExternalLink size={12} /> Preview as patient
              </a>
            </div>
          )}
        </div>

        <footer className="border-t border-navy/10 p-4 flex items-center justify-between gap-2 bg-card">
          {!created ? (
            <>
              <button onClick={onClose} disabled={loading} className="h-10 px-4 text-[11px] uppercase tracking-widest text-navy/55 hover:text-navy disabled:opacity-40">Cancel</button>
              <button
                onClick={submit}
                disabled={loading}
                className="h-10 px-5 bg-navy text-paper text-[11px] uppercase tracking-widest font-semibold hover:bg-academic inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
              >
                {loading ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : <><Video size={13} /> Create Room</>}
              </button>
            </>
          ) : (
            <>
              <button onClick={reset} className="h-10 px-4 text-[11px] uppercase tracking-widest text-navy/55 hover:text-navy">New Room</button>
              <button onClick={copy} disabled={expired} className="h-10 px-5 bg-navy text-paper text-[11px] uppercase tracking-widest font-semibold hover:bg-academic inline-flex items-center gap-2 disabled:opacity-40">
                {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy Link</>}
              </button>
            </>
          )}
        </footer>
      </aside>
    </div>
  );
}

function FieldRow({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-navy/50 mb-1.5 font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-terracotta">{error}</span>}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 px-3 py-2 border-b border-navy/8 last:border-b-0">
      <dt className="text-[10px] uppercase tracking-widest text-navy/45">{k}</dt>
      <dd className="text-sm text-navy text-right truncate">{v}</dd>
    </div>
  );
}
