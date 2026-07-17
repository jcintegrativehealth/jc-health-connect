import { createFileRoute, Link } from "@tanstack/react-router";
import { StatCard, Panel, Badge, BarChart, LineChart, Donut, Btn } from "@/components/admin/primitives";
import { kpi, todayAgenda, activity, tasks } from "@/data/admin";
import { ArrowUpRight, CalendarPlus, UserPlus, Beaker, Receipt } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Overview — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Overview,
});

function Overview() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return (
    <div>
      <header className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.24em] text-gold font-semibold mb-3">Overview · {today}</div>
        <h1 className="font-serif text-4xl md:text-5xl text-navy leading-[1.05] tracking-tight">{greeting}, Dr. Chen.</h1>
        <p className="text-sm text-navy/55 mt-3 max-w-2xl leading-relaxed">
          Here is what is happening at JC Integrative Health today — {todayAgenda.length} appointments scheduled, {kpi.newPatientRequests} new patient requests awaiting review, and {kpi.pendingMessages} messages in the queue.
        </p>
      </header>

      {/* KPI grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Today's appointments" value={kpi.todayAppointments} sub="2 telehealth · 4 in-person · 6 confirmed" tone="navy" />
        <StatCard label="Active patients" value={kpi.activePatients} sub="+12 this month" trend="↑ 3.2%" />
        <StatCard label="New patient requests" value={kpi.newPatientRequests} sub="Awaiting review" tone="gold" />
        <StatCard label="Pending messages" value={kpi.pendingMessages} sub="3 flagged priority" />
        <StatCard label="Pending payments" value={`$${(kpi.outstanding).toLocaleString()}`} sub={`${kpi.overdue > 0 ? `$${kpi.overdue.toLocaleString()} overdue` : "On track"}`} tone="gold" />
        <StatCard label="New lab results" value={kpi.newLabs} sub="2 flagged abnormal" />
        <StatCard label="Care plans requiring review" value={kpi.carePlansReview} sub="Due this week" />
        <StatCard label="Research drafts" value={kpi.researchDrafts} sub="2 ready for review" />
      </div>

      {/* Today agenda + activity */}
      <div className="grid lg:grid-cols-3 gap-3 mt-4">
        <Panel className="lg:col-span-2" title="Today's agenda" action={<Link to="/admin/appointments" className="text-[11px] uppercase tracking-widest text-navy/50 hover:text-navy inline-flex items-center gap-1 transition-colors">Open <ArrowUpRight size={12} /></Link>}>
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

        <Panel title="Patient activity" action={<Link to="/admin/notifications" className="text-[11px] uppercase tracking-widest text-navy/50 hover:text-navy transition-colors">All</Link>}>
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

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-3 mt-4">
        <Panel title="Appointments by week">
          <BarChart data={[18, 22, 20, 26, 24, 30, 28, 32]} height={120} />
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-navy/40 mt-2"><span>W23</span><span>W30</span></div>
        </Panel>
        <Panel title="Telehealth vs in-person">
          <div className="flex items-center justify-center">
            <Donut segments={[
              { value: 62, color: "var(--teal)", label: "Telehealth" },
              { value: 38, color: "var(--navy)", label: "In-person" },
            ]} />
          </div>
        </Panel>
        <Panel title="Patient language distribution">
          <div className="flex items-center justify-center">
            <Donut segments={[
              { value: 54, color: "var(--navy)", label: "English" },
              { value: 22, color: "var(--academic)", label: "Portuguese" },
              { value: 16, color: "var(--teal)", label: "Spanish" },
              { value: 8, color: "var(--gold)", label: "Mandarin" },
            ]} />
          </div>
        </Panel>
      </div>

      {/* Tasks + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-3 mt-4">
        <Panel className="lg:col-span-2" title="Tasks" action={<Link to="/admin/tasks" className="text-[11px] uppercase tracking-widest text-navy/50 hover:text-navy transition-colors">Open all</Link>}>
          <ul className="divide-y divide-navy/8 -m-4">
            {tasks.slice(0, 6).map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-mist/30 transition-colors">
                <input type="checkbox" className="h-4 w-4 border border-navy/25 accent-teal rounded-sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-navy/80 truncate">{t.title}</div>
                  <div className="text-[10px] uppercase tracking-widest text-navy/40 mt-0.5">{t.cat} · Due {t.due}</div>
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-medium ${t.priority === "High" ? "text-gold/90" : t.priority === "Urgent" ? "text-destructive/90" : "text-navy/40"}`}>{t.priority}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Quick actions">
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: UserPlus, label: "New patient", to: "/admin/patients/new" },
              { icon: CalendarPlus, label: "New appointment", to: "/admin/appointments/new" },
              { icon: Beaker, label: "New research", to: "/admin/research" },
              { icon: Receipt, label: "Record payment", to: "/admin/billing" },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="border border-navy/10 p-4 hover:border-navy/25 transition-colors bg-paper">
                <a.icon size={16} strokeWidth={1.5} className="text-navy/60" />
                <div className="text-[11px] uppercase tracking-widest text-navy/70 mt-3">{a.label}</div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Btn variant="outline" size="sm" className="w-full">Open command palette (⌘K)</Btn>
          </div>
        </Panel>
      </div>
    </div>
  );
}
