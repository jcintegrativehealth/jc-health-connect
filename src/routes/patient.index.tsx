import { createFileRoute, Link } from "@tanstack/react-router";
import { BtnPrimary, BtnGhost, PortalCard, StatusPill, Sparkline, Disclaim } from "./patient";
import { appointments, todaysActions, healthJourney, vitals, education } from "@/data/patient";
import { Calendar, MessageSquare, FlaskConical, ClipboardList, Receipt, ArrowRight, CheckCircle2, Clock, AlertTriangle, FileText } from "lucide-react";

export const Route = createFileRoute("/patient/")({
  head: () => ({ meta: [{ title: "Home — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: PatientHome,
});

function PatientHome() {
  const next = appointments[0];
  const iconFor = (s: string) =>
    s === "Completed" ? <CheckCircle2 size={14} className="text-academic" /> :
    s === "Overdue" ? <AlertTriangle size={14} className="text-destructive" /> :
    <Clock size={14} className="text-gold" />;

  return (
    <div className="space-y-8">
      <header>
        <div className="eyebrow text-gold text-[11px] mb-2">Overview</div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy tracking-[-0.01em]">Welcome back, Emily</h1>
        <p className="mt-2 text-sm text-navy/60 max-w-2xl">Here is what you need to know about your care today.</p>
      </header>

      {/* Next appointment hero */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="bg-navy text-paper rounded-sm p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-6 right-6 h-1 w-16 bg-gold" aria-hidden />
          <div className="eyebrow text-gold text-[11px]">Your next visit</div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-paper/60">
            <span className="text-paper">Fri · Jul 24 · 2026</span>
            <span>10:30 AM MST</span>
            <span>{next.duration}</span>
            <span>{next.language}</span>
          </div>
          <h2 className="mt-5 font-serif text-2xl sm:text-3xl leading-tight">{next.type} with {next.physician}</h2>
          <p className="mt-2 text-sm text-paper/70">{next.format} · {next.service}</p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-[11px] font-mono uppercase tracking-widest">
            <div className="border border-paper/15 rounded-sm p-3">
              <div className="text-paper/50">Status</div>
              <div className="text-paper mt-1">{next.status}</div>
            </div>
            <div className="border border-paper/15 rounded-sm p-3">
              <div className="text-paper/50">Payment</div>
              <div className="text-paper mt-1">{next.payment}</div>
            </div>
            <div className="border border-paper/15 rounded-sm p-3">
              <div className="text-paper/50">Forms</div>
              <div className="text-gold mt-1">{next.forms}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/patient/telehealth/waiting-room" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-navy text-xs font-semibold uppercase tracking-[0.16em] rounded-sm hover:brightness-95">
              Join Visit
            </Link>
            <Link to="/patient/appointments/$id" params={{ id: next.id }} className="inline-flex items-center gap-2 px-4 py-2.5 border border-paper/25 text-paper text-xs font-semibold uppercase tracking-[0.16em] rounded-sm hover:bg-paper/10">View Appointment</Link>
            <Link to="/patient/forms" className="inline-flex items-center gap-2 px-4 py-2.5 border border-paper/25 text-paper text-xs font-semibold uppercase tracking-[0.16em] rounded-sm hover:bg-paper/10">Complete Forms</Link>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-paper/25 text-paper text-xs font-semibold uppercase tracking-[0.16em] rounded-sm hover:bg-paper/10">Add to Calendar</button>
          </div>

          <p className="mt-5 text-[11px] font-mono uppercase tracking-widest text-paper/40">Join Visit is currently unavailable — opens 15 minutes before your visit.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <QuickCard to="/patient/labs" icon={<FlaskConical size={16} />} title="New lab results" value="1" hint="Awaiting review" />
          <QuickCard to="/patient/messages" icon={<MessageSquare size={16} />} title="Unread messages" value="2" hint="From your care team" />
          <QuickCard to="/patient/forms" icon={<ClipboardList size={16} />} title="Pending forms" value="2" hint="Due before next visit" />
          <QuickCard to="/patient/care-plan" icon={<FileText size={16} />} title="Care plan" value="62%" hint="Phase 2 · Stabilization" />
          <QuickCard to="/patient/billing" icon={<Receipt size={16} />} title="Balance" value="$220" hint="Due Aug 07" tone="gold" />
          <QuickCard to="/patient/health" icon={<Calendar size={16} />} title="Next action" value="Complete intake" hint="Sleep & Recovery" />
        </div>
      </div>

      {/* Today's actions + Journey */}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
        <PortalCard title="Today's actions" meta={`${todaysActions.length} items`}>
          <ul className="divide-y divide-navy/8">
            {todaysActions.map((a) => (
              <li key={a.id} className="py-3 flex items-center gap-3">
                <span className="shrink-0">{iconFor(a.status)}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-navy">{a.label}</div>
                  {a.due && <div className="text-[11px] text-navy/50 font-mono uppercase tracking-widest mt-0.5">{a.due}</div>}
                </div>
                <StatusPill tone={a.status === "Completed" ? "success" : a.status === "Overdue" ? "danger" : a.status === "Due Soon" ? "warn" : "info"}>{a.status}</StatusPill>
              </li>
            ))}
          </ul>
        </PortalCard>

        <PortalCard title="My health journey" meta="Recent activity">
          <ol className="relative border-l border-navy/10 pl-5 space-y-4">
            {healthJourney.map((h, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[22px] top-1 h-2 w-2 rounded-full bg-teal border-2 border-paper" />
                <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50">{h.date} · {h.type}</div>
                <div className="text-sm text-navy">{h.label}</div>
              </li>
            ))}
          </ol>
        </PortalCard>
      </div>

      {/* Health snapshot */}
      <PortalCard title="Health snapshot" meta="Last 7 days" action={<Link to="/patient/health/vitals" className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy inline-flex items-center gap-1">View all <ArrowRight size={12} /></Link>}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {vitals.map((v) => (
            <div key={v.key} className="border border-navy/8 rounded-sm p-4">
              <div className="eyebrow text-navy/50 text-[10px]">{v.label}</div>
              <div className="mt-1 font-serif text-2xl text-navy leading-none">{v.value}</div>
              {v.unit && <div className="text-[10px] font-mono uppercase text-navy/40 mt-0.5">{v.unit}</div>}
              <div className="text-academic mt-2"><Sparkline data={v.trend} /></div>
            </div>
          ))}
        </div>
        <div className="mt-4"><Disclaim>Values shown are illustrative. Discuss any concerns with your care team.</Disclaim></div>
      </PortalCard>

      {/* Recommended */}
      <PortalCard title="Recommended for you" meta="Curated by your care team" action={<Link to="/patient/education" className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy inline-flex items-center gap-1">Explore <ArrowRight size={12} /></Link>}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {education.slice(0, 3).map((e) => (
            <Link key={e.title} to="/patient/education" className="border border-navy/8 rounded-sm p-4 hover:border-navy/25 transition-colors">
              <div className="eyebrow text-navy/50 text-[10px]">{e.type} · {e.time}</div>
              <div className="mt-1.5 font-serif text-lg text-navy leading-snug">{e.title}</div>
              <div className="mt-3 text-[11px] font-mono uppercase tracking-widest text-gold">{e.reason}</div>
            </Link>
          ))}
        </div>
      </PortalCard>

      <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <BtnPrimary onClick={() => (window.location.href = "/patient/appointments")}>Manage appointments</BtnPrimary>
        <BtnGhost onClick={() => (window.location.href = "/patient/messages")}>Send a message</BtnGhost>
      </div>
    </div>
  );
}

function QuickCard({ to, icon, title, value, hint, tone }: { to: string; icon: React.ReactNode; title: string; value: string; hint: string; tone?: "gold" }) {
  return (
    <Link to={to} className={`border rounded-sm p-4 hover:border-navy/25 transition-colors ${tone === "gold" ? "border-gold/40 bg-gold/5" : "border-navy/10 bg-card"}`}>
      <div className="flex items-center gap-2 text-navy/50">{icon}<span className="eyebrow text-[10px]">{title}</span></div>
      <div className="mt-2 font-serif text-xl sm:text-2xl text-navy leading-tight">{value}</div>
      <div className="mt-1 text-[11px] text-navy/50">{hint}</div>
    </Link>
  );
}
