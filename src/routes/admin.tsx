import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Calendar, CalendarDays, Stethoscope, FileHeart, FlaskConical, ClipboardList,
  MessageSquare, Receipt, Contact, Beaker, Newspaper, PanelsTopLeft, MessageSquareWarning,
  BarChart3, FilePieChart, Files, ListChecks, Bell, Settings, Search, ChevronsLeft, ChevronsRight,
  Plus, HelpCircle, Globe, LogOut, X, Menu, Command,
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
  { to: "/admin", label: "Overview", icon: LayoutDashboard, group: "Practice" },
  { to: "/admin/patients", label: "Patients", icon: Users, group: "Practice" },
  { to: "/admin/appointments", label: "Appointments", icon: Calendar, group: "Practice" },
  { to: "/admin/calendar", label: "Calendar", icon: CalendarDays, group: "Practice" },

  { to: "/admin/clinical", label: "Clinical", icon: Stethoscope, group: "Clinical" },
  { to: "/admin/records", label: "Health Records", icon: FileHeart, group: "Clinical" },
  { to: "/admin/labs", label: "Lab Results", icon: FlaskConical, group: "Clinical" },
  { to: "/admin/care-plans", label: "Care Plans", icon: ClipboardList, group: "Clinical" },

  { to: "/admin/messages", label: "Messages", icon: MessageSquare, group: "Relations" },
  { to: "/admin/billing", label: "Billing", icon: Receipt, group: "Relations" },
  { to: "/admin/crm", label: "CRM", icon: Contact, group: "Relations" },

  { to: "/admin/research", label: "Research", icon: Beaker, group: "Editorial" },
  { to: "/admin/insights", label: "Medical Insights", icon: Newspaper, group: "Editorial" },
  { to: "/admin/website", label: "Website Content", icon: PanelsTopLeft, group: "Editorial" },
  { to: "/admin/comments", label: "Comments", icon: MessageSquareWarning, group: "Editorial" },

  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "Operations" },
  { to: "/admin/reports", label: "Reports", icon: FilePieChart, group: "Operations" },
  { to: "/admin/documents", label: "Documents", icon: Files, group: "Operations" },
  { to: "/admin/tasks", label: "Tasks", icon: ListChecks, group: "Operations" },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, group: "Operations" },
  { to: "/admin/settings", label: "Settings", icon: Settings, group: "Operations" },
];

const GROUPS = ["Practice", "Clinical", "Relations", "Editorial", "Operations"];

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
        className={`hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col border-r border-navy/10 bg-card transition-[width] duration-200 ${collapsed ? "w-16" : "w-64"}`}
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
      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        <TopBar
          onOpenMobile={() => setMobileOpen(true)}
          onOpenCmd={() => setCmdOpen(true)}
          onOpenNotif={() => setNotifOpen(true)}
        />
        <main className="p-6 md:p-8 lg:p-10 max-w-[1440px] mx-auto">
          <Outlet />
        </main>
        <footer className="border-t border-navy/10 mt-16 py-6 px-6 md:px-10 flex flex-col md:flex-row justify-between gap-2 text-[11px] uppercase tracking-widest text-navy/45">
          <span>© {new Date().getFullYear()} {clinic.name} · Private admin</span>
          <span>Preview build · Frontend only · Not for clinical use</span>
        </footer>
      </div>

      {cmdOpen && <CommandPalette onClose={() => setCmdOpen(false)} />}
      {notifOpen && <NotificationsDrawer onClose={() => setNotifOpen(false)} />}
    </div>
  );
}

function SidebarBody({ collapsed, isActive, onCollapse }: { collapsed: boolean; isActive: (to: string) => boolean; onCollapse?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-3 px-4 py-5 border-b border-navy/8">
        <div className="h-9 w-9 border border-navy/15 flex items-center justify-center font-serif text-sm text-navy shrink-0 bg-paper">JC</div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-serif text-sm text-navy truncate leading-tight">JC Integrative Health</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-navy/40">Private admin</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-5">
        {GROUPS.map((g) => (
          <div key={g} className="mb-5">
            {!collapsed && <div className="px-4 mb-2 text-[10px] uppercase tracking-[0.24em] text-navy/35 font-medium">{g}</div>}
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
                  {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-navy/8 p-3 space-y-1">
        {onCollapse && (
          <button onClick={onCollapse} className="w-full flex items-center gap-3 px-2 py-2 text-[11px] uppercase tracking-widest text-navy/45 hover:text-navy transition-colors">
            {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />} {!collapsed && "Collapse"}
          </button>
        )}
        <Link to="/" className="w-full flex items-center gap-3 px-2 py-2 text-[11px] uppercase tracking-widest text-navy/45 hover:text-navy transition-colors">
          <LogOut size={14} strokeWidth={1.5} /> {!collapsed && "Back to site"}
        </Link>
      </div>
    </>
  );
}

function TopBar({ onOpenMobile, onOpenCmd, onOpenNotif }: { onOpenMobile: () => void; onOpenCmd: () => void; onOpenNotif: () => void }) {
  const unread = demoNotifs.filter((n) => !n.read).length;
  const [lang, setLang] = useState("EN");
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

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
          <span className="text-sm truncate">Search patients, appointments, invoices…</span>
          <span className="ml-auto text-[10px] uppercase tracking-widest border border-navy/10 px-1.5 py-0.5 flex items-center gap-1 text-navy/40"><Command size={10} /> K</span>
        </button>

        <div className="flex-1 md:hidden text-[11px] uppercase tracking-[0.2em] text-navy/45">{today}</div>

        <div className="ml-auto flex items-center gap-1 md:gap-1.5">
          <span className="hidden xl:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-navy/45 mr-3">
            <span className="h-1.5 w-1.5 rounded-full bg-teal/80" /> Clinic online · {today}
          </span>

          <QuickActions />

          <button onClick={onOpenNotif} className="relative h-9 w-9 grid place-items-center text-navy/55 hover:text-navy transition-colors" aria-label="Notifications">
            <Bell size={16} strokeWidth={1.5} />
            {unread > 0 && <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-gold" />}
          </button>

          <button className="h-9 w-9 grid place-items-center text-navy/55 hover:text-navy transition-colors" aria-label="Help"><HelpCircle size={15} strokeWidth={1.5} /></button>

          <div className="hidden md:flex items-center gap-0.5 h-9 border border-navy/10 px-2 text-[11px] uppercase tracking-widest text-navy/50">
            <Globe size={12} strokeWidth={1.5} className="mr-1" />
            {(["EN", "ES", "PT", "ZH"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-1.5 py-0.5 transition-colors ${lang === l ? "text-navy" : "hover:text-navy"}`}>{l}</button>
            ))}
          </div>

          <div className="flex items-center gap-2 h-9 pl-2 pr-3 border-l border-navy/8 ml-1">
            <div className="h-7 w-7 rounded-full border border-navy/15 grid place-items-center text-[10px] font-semibold text-navy bg-paper">JC</div>
            <div className="hidden sm:block leading-tight">
              <div className="text-xs font-medium text-navy">Dr. Jason Chen</div>
              <div className="text-[10px] uppercase tracking-widest text-navy/40">Medical Director</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function QuickActions() {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "New Patient", to: "/admin/patients/new" },
    { label: "Schedule Appointment", to: "/admin/appointments/new" },
    { label: "Create Care Plan", to: "/admin/care-plans" },
    { label: "Send Message", to: "/admin/messages" },
    { label: "New Research Post", to: "/admin/research" },
    { label: "Record Payment", to: "/admin/billing" },
    { label: "Upload Document", to: "/admin/documents" },
  ];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 border border-navy/20 text-navy hover:border-navy/40 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold"
      >
        <Plus size={13} strokeWidth={2} /> <span className="hidden sm:inline">New</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-card border border-navy/15 shadow-lg z-50">
            <div className="px-3 py-2 border-b border-navy/10 eyebrow text-navy/45">Quick actions</div>
            {items.map((i) => (
              <Link key={i.to} to={i.to} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-navy/75 hover:bg-mist/60 hover:text-navy">
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
  const groups = [
    { label: "Pages", items: NAV.slice(0, 12).map((n) => ({ label: n.label, to: n.to })) },
    { label: "Patients", items: [{ label: "Amelia Reyes · P-1042", to: "/admin/patients/P-1042" }, { label: "Rafael Marques · P-1043", to: "/admin/patients/P-1043" }, { label: "Sofía Lopez · P-1044", to: "/admin/patients/P-1044" }] },
    { label: "Appointments", items: [{ label: "A-8801 · Amelia Reyes", to: "/admin/appointments/A-8801" }, { label: "A-8802 · Rafael Marques", to: "/admin/appointments/A-8802" }] },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-navy/20" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-paper border border-navy/15 shadow-2xl">
        <div className="flex items-center gap-2 px-4 h-12 border-b border-navy/10">
          <Search size={14} strokeWidth={1.5} className="text-navy/50" />
          <input autoFocus placeholder="Search patients, appointments, messages…" className="flex-1 bg-transparent outline-none text-sm placeholder:text-navy/40" />
          <kbd className="text-[10px] uppercase tracking-widest border border-navy/15 px-1.5 py-0.5 text-navy/45">Esc</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {groups.map((g) => (
            <div key={g.label} className="border-b border-navy/10 last:border-b-0">
              <div className="px-4 py-2 eyebrow text-navy/45">{g.label}</div>
              {g.items.map((i) => (
                <Link key={i.to + i.label} to={i.to} onClick={onClose} className="flex items-center justify-between px-4 py-2 text-sm text-navy/75 hover:bg-mist/60 hover:text-navy">
                  {i.label} <span className="text-[10px] text-navy/40">↵</span>
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
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-navy/20" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 w-full sm:w-96 bg-paper border-l border-navy/10 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-navy/10">
          <div>
            <div className="eyebrow text-gold">Notifications</div>
            <div className="font-serif text-lg text-navy">Recent activity</div>
          </div>
          <button onClick={onClose} className="text-navy/60 hover:text-navy"><X size={18} /></button>
        </header>
        <div className="flex-1 overflow-y-auto">
          {demoNotifs.map((n) => (
            <div key={n.id} className="p-4 border-b border-navy/5 hover:bg-mist/40">
              <div className="flex items-start gap-3">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${n.read ? "bg-navy/20" : "bg-gold"}`} />
                <div className="min-w-0">
                  <div className="text-sm text-navy">{n.text}</div>
                  <div className="text-[10px] uppercase tracking-widest text-navy/45 mt-1">{n.type} · {n.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-navy/10 flex items-center justify-between text-xs">
          <button className="text-navy/60 hover:text-navy uppercase tracking-widest">Mark all as read</button>
          <Link to="/admin/notifications" onClick={onClose} className="text-navy/60 hover:text-navy uppercase tracking-widest">Open center →</Link>
        </div>
      </aside>
    </div>
  );
}
