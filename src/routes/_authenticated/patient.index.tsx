import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalCard, StatusPill, Disclaim } from "./patient";
import { useAppointments, useAppointmentsStatus, type AppointmentRequest } from "@/lib/appointmentStore";
import { useMyProfile, displayName } from "@/lib/profile";
import { formatDate, formatTime } from "@/lib/datetime";
import { Calendar, User as UserIcon, CalendarPlus, Video, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/")({
  head: () => ({ meta: [{ title: "Home — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: PatientHome,
});

const UPCOMING = new Set(["Pending", "Confirmed", "Checked In", "In Progress", "Rescheduled"]);

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function nextUpcoming(rows: AppointmentRequest[]): AppointmentRequest | undefined {
  const today = todayIso();
  return rows
    .filter((r) => UPCOMING.has(r.status) && r.date >= today)
    .sort((a, b) => (a.date + a.time > b.date + b.time ? 1 : -1))[0];
}

function PatientHome() {
  const rows = useAppointments();
  const { ready } = useAppointmentsStatus();
  const { profile } = useMyProfile();
  const next = nextUpcoming(rows);
  const name = displayName(profile);

  return (
    <div className="space-y-8">
      <header>
        <div className="eyebrow text-gold text-[11px] mb-2">Overview</div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy tracking-[-0.01em]">
          Welcome{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-2 text-sm text-navy/60 max-w-2xl">Here is what you need to know about your care.</p>
      </header>

      {/* Next appointment hero */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        {!ready ? (
          <div className="bg-navy/5 rounded-sm p-6 sm:p-8 min-h-[220px] animate-pulse" aria-hidden />
        ) : next ? (
          <div className="bg-navy text-paper rounded-sm p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-6 right-6 h-1 w-16 bg-gold" aria-hidden />
            <div className="eyebrow text-gold text-[11px]">Your next visit</div>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-paper/60">
              <span className="text-paper">{formatDate(next.date)}</span>
              <span>{formatTime(next.time)}</span>
              <span>{next.duration} min</span>
              <span>{next.lang}</span>
            </div>
            <h2 className="mt-5 font-serif text-2xl sm:text-3xl leading-tight">{next.type}</h2>
            <p className="mt-2 text-sm text-paper/70">{next.format}{next.service ? ` · ${next.service}` : ""}</p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-[11px] font-mono uppercase tracking-widest">
              <div className="border border-paper/15 rounded-sm p-3">
                <div className="text-paper/50">Status</div>
                <div className="text-paper mt-1">{next.status}</div>
              </div>
              <div className="border border-paper/15 rounded-sm p-3">
                <div className="text-paper/50">Payment</div>
                <div className="text-paper mt-1">{next.pay}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {next.format === "Telehealth" && next.meetingLink && next.status === "Confirmed" && (
                <a href={next.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-navy text-xs font-semibold uppercase tracking-[0.16em] rounded-sm hover:brightness-95">
                  <Video size={14} /> Join Visit
                </a>
              )}
              <Link to="/patient/appointments/$id" params={{ id: next.id }} className="inline-flex items-center gap-2 px-4 py-2.5 border border-paper/25 text-paper text-xs font-semibold uppercase tracking-[0.16em] rounded-sm hover:bg-paper/10">
                View Appointment
              </Link>
            </div>

            {next.format === "Telehealth" && !next.meetingLink && (
              <p className="mt-5 text-[11px] font-mono uppercase tracking-widest text-paper/40">
                A join link will appear here once the clinic confirms your telehealth visit.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-card border border-navy/10 rounded-sm p-6 sm:p-8 flex flex-col justify-center">
            <div className="eyebrow text-navy/50 text-[11px] mb-2">No upcoming visits</div>
            <h2 className="font-serif text-2xl text-navy">You have no scheduled appointments</h2>
            <p className="mt-2 text-sm text-navy/60 max-w-md">Request a visit and the clinical team will confirm a time with you.</p>
            <div className="mt-6">
              <Link to="/book" className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-paper text-xs font-semibold uppercase tracking-[0.16em] rounded-sm hover:bg-academic">
                <CalendarPlus size={14} /> Request Appointment
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <QuickCard to="/patient/appointments" icon={<Calendar size={16} />} title="My appointments" hint="View upcoming and past visits" />
          <QuickCard to="/patient/profile" icon={<UserIcon size={16} />} title="My profile" hint="Update your contact details" />
          <QuickCard to="/book" icon={<CalendarPlus size={16} />} title="Request a visit" hint="Book an in-person or telehealth appointment" />
        </div>
      </div>

      {rows.length > 0 && (
        <PortalCard title="Recent visits" meta={`${rows.length} total`} action={
          <Link to="/patient/appointments" className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy inline-flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        }>
          <ul className="divide-y divide-navy/8">
            {rows.slice(0, 4).map((a) => (
              <li key={a.id} className="py-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-navy">{a.type}</div>
                  <div className="text-[11px] text-navy/50 font-mono uppercase tracking-widest mt-0.5">
                    {formatDate(a.date)} · {formatTime(a.time)} · {a.format}
                  </div>
                </div>
                <StatusPill tone={a.status === "Confirmed" ? "success" : a.status === "Completed" ? "info" : a.status === "Cancelled" || a.status === "No Show" ? "danger" : "warn"}>
                  {a.status}
                </StatusPill>
              </li>
            ))}
          </ul>
        </PortalCard>
      )}

      <Disclaim>This portal is not for emergencies. If you are experiencing a medical emergency, call 911 or your local emergency services.</Disclaim>
    </div>
  );
}

function QuickCard({ to, icon, title, hint }: { to: string; icon: React.ReactNode; title: string; hint: string }) {
  return (
    <Link to={to} className="border border-navy/10 bg-card rounded-sm p-4 hover:border-navy/25 transition-colors flex items-start gap-3">
      <span className="text-navy/50 mt-0.5">{icon}</span>
      <span className="min-w-0">
        <span className="block font-serif text-lg text-navy leading-tight">{title}</span>
        <span className="block mt-0.5 text-[12px] text-navy/55">{hint}</span>
      </span>
    </Link>
  );
}
