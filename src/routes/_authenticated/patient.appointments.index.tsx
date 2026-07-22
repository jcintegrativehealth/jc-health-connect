import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PortalPageHeader, PortalCard, StatusPill, BtnPrimary } from "./patient";
import { useAppointments, useAppointmentsStatus, type AppointmentRequest } from "@/lib/appointmentStore";
import { formatDate, formatTime } from "@/lib/datetime";
import { Calendar, Video, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/appointments/")({
  head: () => ({ meta: [{ title: "Appointments — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: AppointmentsIndex,
});

const TABS = ["Upcoming", "Requests", "Past", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

function inTab(a: AppointmentRequest, tab: Tab, today: string): boolean {
  switch (tab) {
    case "Upcoming":
      return ["Confirmed", "Checked In", "In Progress", "Rescheduled"].includes(a.status) && a.date >= today;
    case "Requests":
      return a.status === "Pending";
    case "Past":
      return a.status === "Completed" || (["Confirmed", "Checked In", "In Progress"].includes(a.status) && a.date < today);
    case "Cancelled":
      return a.status === "Cancelled" || a.status === "No Show";
  }
}

function AppointmentsIndex() {
  const [tab, setTab] = useState<Tab>("Upcoming");
  const rows = useAppointments();
  const { ready, error } = useAppointmentsStatus();
  const today = new Date().toISOString().slice(0, 10);

  const filtered = rows.filter((a) => inTab(a, tab, today));

  return (
    <div>
      <PortalPageHeader
        eyebrow="Care · Schedule"
        title="Appointments"
        lede="Review your upcoming visits, past appointments, and pending requests."
        actions={<Link to="/book" className="inline-flex"><BtnPrimary>Request Appointment</BtnPrimary></Link>}
      />

      <div className="flex flex-wrap gap-1 border-b border-navy/10 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-mono uppercase tracking-widest border-b-2 -mb-px ${tab === t ? "border-gold text-navy" : "border-transparent text-navy/50 hover:text-navy"}`}>
            {t}
          </button>
        ))}
      </div>

      {!ready ? (
        <PortalCard><div className="py-10 text-center text-sm text-navy/50">Loading your appointments…</div></PortalCard>
      ) : error ? (
        <PortalCard><div className="py-10 text-center text-sm text-navy/60">{error}</div></PortalCard>
      ) : filtered.length === 0 ? (
        <PortalCard>
          <div className="py-10 text-center">
            <div className="eyebrow text-navy/50 mb-2">No {tab.toLowerCase()} appointments</div>
            <p className="text-sm text-navy/55">You have no {tab.toLowerCase()} appointments to show.</p>
            <div className="mt-6 flex justify-center">
              <Link to="/book"><BtnPrimary>Request Appointment</BtnPrimary></Link>
            </div>
          </div>
        </PortalCard>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="bg-card border border-navy/10 rounded-sm p-5 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                <div className="lg:w-40">
                  <div className="eyebrow text-gold text-[10px]">Visit</div>
                  <div className="font-serif text-2xl text-navy mt-1">{new Date(`${a.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50">{formatTime(a.time)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StatusPill tone={a.status === "Confirmed" ? "success" : a.status === "Pending" ? "warn" : a.status === "Completed" ? "info" : a.status === "Cancelled" || a.status === "No Show" ? "danger" : "neutral"}>{a.status}</StatusPill>
                    <StatusPill tone={a.pay === "Paid" ? "success" : "neutral"}>{a.pay}</StatusPill>
                  </div>
                  <div className="font-serif text-xl text-navy">{a.type}</div>
                  {a.service && <div className="text-sm text-navy/60 mt-0.5">{a.service}</div>}
                  <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1">{a.format === "Telehealth" ? <Video size={11} /> : <Calendar size={11} />} {a.format}</span>
                    <span>{a.duration} min</span>
                    <span>{a.lang}</span>
                  </div>
                </div>
                <div className="flex flex-wrap lg:flex-col gap-2 lg:w-52">
                  <Link to="/patient/appointments/$id" params={{ id: a.id }} className="w-full">
                    <BtnPrimary className="w-full">View Details <ArrowRight size={13} /></BtnPrimary>
                  </Link>
                  {a.status === "Confirmed" && a.format === "Telehealth" && a.meetingLink && (
                    <a href={a.meetingLink} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.16em] hover:bg-mist rounded-sm">
                      <Video size={13} /> Join Visit
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
