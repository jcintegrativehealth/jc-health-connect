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
  return (
    <div>
      <header className="mb-10">
        <div className="eyebrow text-gold mb-2">Overview · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
        <h1 className="font-serif text-4xl md:text-5xl text-navy leading-[1.05]">{greeting}, Dr. Chen.</h1>
        <p className="text-navy/60 mt-3 max-w-2xl">Here is what is happening at JC Integrative Health today — {todayAgenda.length} appointments scheduled, {kpi.newPatientRequests} new patient requests awaiting review, and {kpi.pendingMessages} messages in the queue.</p>
      </header>

      {/* KPI grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Today's appointments" value={kpi.todayAppointments} sub="2 telehealth · 4 in-person · 6 confirmed" tone="teal" />
        <StatCard label="Active patients" value={kpi.activePatients} sub="+12 this month" trend="↑ 3.2%" />
        <StatCard label="New patient requests" value={kpi.newPatientRequests} sub="Awaiting review" tone="gold" />
        <StatCard label="Pending messages" value={kpi.pendingMessages} sub="3 flagged priority" />
        <StatCard label="Pending payments" value={`$${(kpi.outstanding).toLocaleString()}`} sub={`${kpi.overdue > 0 ? `$${kpi.overdue.toLocaleString()} overdue` : "On track"}`} tone="gold" />
        <StatCard label="New lab results" value={kpi.newLabs} sub="2 flagged abnormal" />
        <StatCard label="Care plans requiring review" value={kpi.carePlansReview} sub="Due this week" />
        <StatCard label="Research drafts" value={kpi.researchDrafts} sub="2 ready for review" />
      </div>

      {/* Today agenda + activity */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Panel className="lg:col-span-2" title="Today's agenda" action={<Link to="/admin/appointments" className="text-[11px] uppercase tracking-widest text-navy/55 hover:text-navy inline-flex items-center gap-1">Open <ArrowUpRight size={12} /></Link>}>
          <div className="divide-y divide-navy/10 -m-4">
            {todayAgenda.map((a, i) => (
              <div key={i} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 px-4 py-3 hover:bg-mist/40">
                <div className="font-mono text-sm text-navy">{a.time}</div>
                <div className="min-w-0">
                  <div className="text-sm text-navy truncate">{a.patient}</div>
                  <div className="text-xs text-navy/55 truncate">{a.type} · {a.modality} · {a.lang} · {a.state}</div>
                </div>
                <Badge tone={a.status}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Patient activity">
          <ul className="space-y-3 -m-1">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${a.tone === "teal" ? "bg-teal" : a.tone === "gold" ? "bg-gold" : "bg-navy/60"}`} />
                <div className="min-w-0">
                  <div className="text-sm text-navy leading-snug">{a.text}</div>
                  <div className="text-[10px] uppercase tracking-widest text-navy/40 mt-0.5">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Financial snapshot */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Panel title="Financial snapshot" className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <div className="eyebrow text-navy/45">Revenue this month</div>
              <div className="font-serif text-3xl text-navy mt-1">${kpi.revenueMonth.toLocaleString()}</div>
            </div>
            <div>
              <div className="eyebrow text-navy/45">Collected</div>
              <div className="font-serif text-3xl text-navy mt-1">${kpi.collected.toLocaleString()}</div>
            </div>
            <div>
              <div className="eyebrow text-navy/45">Outstanding</div>
              <div className="font-serif text-3xl text-navy mt-1">${kpi.outstanding.toLocaleString()}</div>
            </div>
            <div>
              <div className="eyebrow text-navy/45">Refunds</div>
              <div className="font-serif text-3xl text-navy mt-1">${kpi.refunds.toLocaleString()}</div>
            </div>
            <div>
              <div className="eyebrow text-navy/45">Avg visit value</div>
              <div className="font-serif text-3xl text-navy mt-1">${kpi.avgVisitValue}</div>
            </div>
            <div>
              <div className="eyebrow text-navy/45">Pending invoices</div>
              <div className="font-serif text-3xl text-navy mt-1">6</div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="eyebrow text-navy/50">Revenue by month · 2026</div>
              <div className="text-[10px] uppercase tracking-widest text-navy/40">Demo</div>
            </div>
            <LineChart data={[62, 71, 68, 82, 79, 91, 88, 105, 112, 121, 128, 132]} />
          </div>
        </Panel>

        <Panel title="Clinical snapshot">
          <ul className="text-sm divide-y divide-navy/10 -m-4">
            <li className="flex justify-between px-4 py-3"><span>Active care plans</span><span className="font-medium">{kpi.activeCarePlans}</span></li>
            <li className="flex justify-between px-4 py-3"><span>Patients needing follow-up</span><span className="font-medium">{kpi.followUpNeeded}</span></li>
            <li className="flex justify-between px-4 py-3"><span>Labs awaiting review</span><span className="font-medium">{kpi.labsAwaiting}</span></li>
            <li className="flex justify-between px-4 py-3"><span>Incomplete intake forms</span><span className="font-medium">{kpi.incompleteIntakes}</span></li>
            <li className="flex justify-between px-4 py-3"><span>Pending prescriptions</span><span className="font-medium">{kpi.pendingRx}</span></li>
            <li className="flex justify-between px-4 py-3"><span>Goals in progress</span><span className="font-medium">{kpi.goalsInProgress}</span></li>
          </ul>
        </Panel>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Panel title="Appointments by week">
          <BarChart data={[18, 22, 20, 26, 24, 30, 28, 32]} />
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-navy/40 mt-2"><span>W23</span><span>W30</span></div>
        </Panel>
        <Panel title="Telehealth vs in-person">
          <Donut segments={[
            { value: 62, color: "var(--teal)", label: "Telehealth" },
            { value: 38, color: "var(--navy)", label: "In-person" },
          ]} />
        </Panel>
        <Panel title="Patient language distribution">
          <Donut segments={[
            { value: 54, color: "var(--navy)", label: "English" },
            { value: 22, color: "var(--academic)", label: "Portuguese" },
            { value: 16, color: "var(--teal)", label: "Spanish" },
            { value: 8, color: "var(--gold)", label: "Mandarin" },
          ]} />
        </Panel>
      </div>

      {/* Tasks + Quick actions */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Panel className="lg:col-span-2" title="Tasks" action={<Link to="/admin/tasks" className="text-[11px] uppercase tracking-widest text-navy/55 hover:text-navy">Open all</Link>}>
          <ul className="divide-y divide-navy/10 -m-4">
            {tasks.slice(0, 6).map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                <input type="checkbox" className="h-4 w-4 border border-navy/30 accent-teal" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-navy truncate">{t.title}</div>
                  <div className="text-[10px] uppercase tracking-widest text-navy/45 mt-0.5">{t.cat} · Due {t.due}</div>
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${t.priority === "High" ? "text-gold" : t.priority === "Urgent" ? "text-destructive" : "text-navy/45"}`}>{t.priority}</span>
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
              <Link key={a.to} to={a.to} className="border border-navy/15 p-4 hover:border-navy/40 transition-colors">
                <a.icon size={16} strokeWidth={1.5} className="text-navy/70" />
                <div className="text-xs uppercase tracking-widest text-navy/75 mt-3">{a.label}</div>
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
