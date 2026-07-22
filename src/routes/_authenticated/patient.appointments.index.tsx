import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PortalPageHeader, PortalCard, StatusPill, BtnPrimary, BtnGhost } from "./patient";
import { appointments } from "@/data/patient";
import { Calendar, Video, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/appointments/")({
  head: () => ({ meta: [{ title: "Appointments — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: AppointmentsIndex,
});

const TABS = ["Upcoming", "Past", "Cancelled", "Requests"] as const;

function AppointmentsIndex() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Upcoming");

  const filtered = appointments.filter((a) =>
    tab === "Upcoming" ? a.status === "Confirmed" || a.status === "Pending" :
    tab === "Past" ? a.status === "Completed" :
    tab === "Cancelled" ? a.status === "Cancelled" : false
  );

  return (
    <div>
      <PortalPageHeader
        eyebrow="Care · Schedule"
        title="Appointments"
        lede="Manage upcoming visits, review past appointments, and request new ones."
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

      {filtered.length === 0 ? (
        <PortalCard>
          <div className="py-10 text-center">
            <div className="eyebrow text-navy/50 mb-2">No {tab.toLowerCase()} appointments</div>
            <p className="text-sm text-navy/55">You have no {tab.toLowerCase()} appointments to show.</p>
            <div className="mt-6 flex justify-center"><BtnPrimary>Request Appointment</BtnPrimary></div>
          </div>
        </PortalCard>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="bg-card border border-navy/10 rounded-sm p-5 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                <div className="lg:w-40">
                  <div className="eyebrow text-gold text-[10px]">Visit</div>
                  <div className="font-serif text-2xl text-navy mt-1">{new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50">{a.time} · {a.tz}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <StatusPill tone={a.status === "Confirmed" ? "success" : a.status === "Pending" ? "warn" : a.status === "Completed" ? "info" : "neutral"}>{a.status}</StatusPill>
                    <StatusPill tone={a.forms === "Completed" ? "success" : "warn"}>Forms · {a.forms}</StatusPill>
                    <StatusPill tone={a.payment === "Paid" ? "success" : "neutral"}>{a.payment}</StatusPill>
                  </div>
                  <div className="font-serif text-xl text-navy">{a.type}</div>
                  <div className="text-sm text-navy/60 mt-0.5">{a.physician} · {a.service}</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-navy/50 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1">{a.format.includes("Tele") ? <Video size={11} /> : <Calendar size={11} />} {a.format}</span>
                    <span>{a.duration}</span>
                    <span>{a.language}</span>
                  </div>
                </div>
                <div className="flex flex-wrap lg:flex-col gap-2 lg:w-52">
                  <Link to="/patient/appointments/$id" params={{ id: a.id }} className="w-full">
                    <BtnPrimary className="w-full">View Details <ArrowRight size={13} /></BtnPrimary>
                  </Link>
                  {a.status === "Confirmed" && a.format.includes("Tele") && (
                    <Link to="/patient/telehealth/waiting-room" className="w-full"><BtnGhost className="w-full">Preview Waiting Room</BtnGhost></Link>
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
