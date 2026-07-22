import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { StatCard, Panel, Badge, BarChart, Donut, Btn } from "@/components/admin/primitives";
import { kpi, todayAgenda, activity, tasks } from "@/data/admin";
import { ArrowUpRight, CalendarPlus, UserPlus, Beaker, Receipt } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Overview — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Overview,
});

function Overview() {
  const { t, i18n } = useTranslation();
  const hour = new Date().getHours();
  const greet = hour < 12 ? t("admin.overview.morning") : hour < 18 ? t("admin.overview.afternoon") : t("admin.overview.evening");
  const localeMap: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-BR", zh: "zh-CN" };
  const lng = (i18n.language.split("-")[0] || "en");
  const today = new Date().toLocaleDateString(localeMap[lng] ?? "en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div>
      <header className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.24em] text-gold font-semibold mb-3">{t("admin.overview.eyebrow")} · {today}</div>
        <h1 className="font-serif text-4xl md:text-5xl text-navy leading-[1.05] tracking-tight">{t("admin.overview.greeting", { greet })}</h1>
        <p className="text-sm text-navy/55 mt-3 max-w-2xl leading-relaxed">
          {t("admin.overview.lede", { appts: todayAgenda.length, requests: kpi.newPatientRequests, messages: kpi.pendingMessages })}
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label={t("admin.overview.kpi.today")} value={kpi.todayAppointments} sub={t("admin.overview.kpi.todaySub")} tone="navy" />
        <StatCard label={t("admin.overview.kpi.active")} value={kpi.activePatients} sub={t("admin.overview.kpi.activeSub")} trend="↑ 3.2%" />
        <StatCard label={t("admin.overview.kpi.requests")} value={kpi.newPatientRequests} sub={t("admin.overview.kpi.requestsSub")} tone="gold" />
        <StatCard label={t("admin.overview.kpi.pendingMsgs")} value={kpi.pendingMessages} sub={t("admin.overview.kpi.pendingMsgsSub")} />
        <StatCard label={t("admin.overview.kpi.pendingPay")} value={`$${(kpi.outstanding).toLocaleString()}`} sub={kpi.overdue > 0 ? t("admin.overview.kpi.overdue", { amount: `$${kpi.overdue.toLocaleString()}` }) : t("admin.overview.kpi.onTrack")} tone="gold" />
        <StatCard label={t("admin.overview.kpi.newLabs")} value={kpi.newLabs} sub={t("admin.overview.kpi.newLabsSub")} />
        <StatCard label={t("admin.overview.kpi.carePlans")} value={kpi.carePlansReview} sub={t("admin.overview.kpi.carePlansSub")} />
        <StatCard label={t("admin.overview.kpi.drafts")} value={kpi.researchDrafts} sub={t("admin.overview.kpi.draftsSub")} />
      </div>

      <div className="grid lg:grid-cols-3 gap-3 mt-4">
        <Panel className="lg:col-span-2" title={t("admin.overview.agenda.title")} action={<Link to="/admin/appointments" className="text-[11px] uppercase tracking-widest text-navy/50 hover:text-navy inline-flex items-center gap-1 transition-colors">{t("admin.overview.agenda.open")} <ArrowUpRight size={12} /></Link>}>
          <div className="divide-y divide-navy/8 -m-4">
            {todayAgenda.map((a, i) => (
              <div key={i} className="grid grid-cols-[56px_1fr_auto] items-center gap-4 px-4 py-3 hover:bg-mist/30 transition-colors">
                <div className="font-mono text-sm text-navy/70">{a.time}</div>
                <div className="min-w-0">
                  <div className="text-sm text-navy truncate">{a.patient}</div>
                  <div className="text-xs text-navy/45 truncate">{a.type} · {a.modality} · {a.lang} · {a.state}</div>
                </div>
                <Badge tone={a.status}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title={t("admin.overview.activity.title")} action={<Link to="/admin/notifications" className="text-[11px] uppercase tracking-widest text-navy/50 hover:text-navy transition-colors">{t("admin.overview.activity.all")}</Link>}>
          <ul className="space-y-3 -m-1">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${a.tone === "teal" ? "bg-teal/80" : a.tone === "gold" ? "bg-gold/80" : "bg-navy/50"}`} />
                <div className="min-w-0">
                  <div className="text-sm text-navy/80 leading-snug">{a.text}</div>
                  <div className="text-[10px] uppercase tracking-widest text-navy/40 mt-0.5">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-3 gap-3 mt-4">
        <Panel title={t("admin.overview.charts.byWeek")}>
          <BarChart data={[18, 22, 20, 26, 24, 30, 28, 32]} height={120} />
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-navy/40 mt-2"><span>W23</span><span>W30</span></div>
        </Panel>
        <Panel title={t("admin.overview.charts.tvi")}>
          <div className="flex items-center justify-center">
            <Donut segments={[
              { value: 62, color: "var(--teal)", label: t("admin.overview.charts.telehealth") },
              { value: 38, color: "var(--navy)", label: t("admin.overview.charts.inPerson") },
            ]} />
          </div>
        </Panel>
        <Panel title={t("admin.overview.charts.langDist")}>
          <div className="flex items-center justify-center">
            <Donut segments={[
              { value: 54, color: "var(--navy)", label: t("admin.overview.charts.english") },
              { value: 22, color: "var(--academic)", label: t("admin.overview.charts.portuguese") },
              { value: 16, color: "var(--teal)", label: t("admin.overview.charts.spanish") },
              { value: 8, color: "var(--gold)", label: t("admin.overview.charts.mandarin") },
            ]} />
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-3 gap-3 mt-4">
        <Panel className="lg:col-span-2" title={t("admin.overview.tasks.title")} action={<Link to="/admin/tasks" className="text-[11px] uppercase tracking-widest text-navy/50 hover:text-navy transition-colors">{t("admin.overview.tasks.openAll")}</Link>}>
          <ul className="divide-y divide-navy/8 -m-4">
            {tasks.slice(0, 6).map((t2) => (
              <li key={t2.id} className="flex items-center gap-3 px-4 py-3 hover:bg-mist/30 transition-colors">
                <input type="checkbox" className="h-4 w-4 border border-navy/25 accent-teal rounded-sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-navy/80 truncate">{t2.title}</div>
                  <div className="text-[10px] uppercase tracking-widest text-navy/40 mt-0.5">{t2.cat} · {t("admin.overview.tasks.due")} {t2.due}</div>
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${t2.priority === "High" ? "text-gold/90" : t2.priority === "Urgent" ? "text-destructive/90" : "text-navy/40"}`}>{t2.priority}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={t("admin.quick.title")}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: UserPlus, label: t("admin.quick.newPatient"), to: "/admin/patients/new" },
              { icon: CalendarPlus, label: t("admin.quick.newAppointment"), to: "/admin/appointments/new" },
              { icon: Beaker, label: t("admin.quick.newResearch"), to: "/admin/research" },
              { icon: Receipt, label: t("admin.quick.recordPayment"), to: "/admin/billing" },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="border border-navy/10 p-4 hover:border-navy/25 transition-colors bg-paper">
                <a.icon size={16} strokeWidth={1.5} className="text-navy/60" />
                <div className="text-[11px] uppercase tracking-widest text-navy/70 mt-3">{a.label}</div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Btn variant="outline" size="sm" className="w-full">{t("admin.quick.openPalette")}</Btn>
          </div>
        </Panel>
      </div>
    </div>
  );
}
