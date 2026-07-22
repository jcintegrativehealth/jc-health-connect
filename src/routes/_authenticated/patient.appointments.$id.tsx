import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, StatusPill, BtnPrimary, BtnGhost, Disclaim } from "./patient";
import { appointments } from "@/data/patient";
import { Video, MapPin, Clock, Globe, FileText, ArrowLeft, X, Calendar as CalIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/appointments/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Appointment ${params.id} — Patient Portal` }, { name: "robots", content: "noindex" }],
  }),
  component: AppointmentDetail,
  notFoundComponent: () => (
    <div className="py-16 text-center">
      <div className="eyebrow text-gold">Not found</div>
      <h1 className="font-serif text-3xl text-navy mt-2">Appointment unavailable</h1>
      <Link to="/patient/appointments" className="inline-block mt-6"><BtnPrimary>Back to Appointments</BtnPrimary></Link>
    </div>
  ),
});

function AppointmentDetail() {
  const { id } = useParams({ from: "/_authenticated/patient/appointments/$id" });
  const appt = appointments.find((a) => a.id === id);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  if (!appt) throw notFound();

  return (
    <div>
      <Link to="/patient/appointments" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-navy/50 hover:text-navy mb-4">
        <ArrowLeft size={12} /> All appointments
      </Link>

      <PortalPageHeader
        eyebrow={`Visit · ${appt.id}`}
        title={appt.type}
        lede={`${appt.physician} · ${appt.service}`}
        actions={
          <>
            <StatusPill tone={appt.status === "Confirmed" ? "success" : "warn"}>{appt.status}</StatusPill>
            <StatusPill tone={appt.payment === "Paid" ? "success" : "neutral"}>{appt.payment}</StatusPill>
          </>
        }
      />

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="space-y-5">
          <PortalCard title="Visit details">
            <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <Field label="Date" value={new Date(appt.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} />
              <Field label="Time" value={`${appt.time} ${appt.tz}`} icon={<Clock size={12} />} />
              <Field label="Format" value={appt.format} icon={appt.format.includes("Tele") ? <Video size={12} /> : <MapPin size={12} />} />
              <Field label="Language" value={appt.language} icon={<Globe size={12} />} />
              <Field label="Duration" value={appt.duration} />
              <Field label="Forms" value={appt.forms} />
            </dl>
          </PortalCard>

          <PortalCard title="Preparation">
            {appt.preparation.length ? (
              <ul className="space-y-2 text-sm text-navy/75">
                {appt.preparation.map((p, i) => (
                  <li key={i} className="flex gap-2"><span className="text-gold">·</span> {p}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-navy/50">No preparation required for this visit.</div>
            )}
          </PortalCard>

          <PortalCard title="Notes for you">
            <p className="text-sm text-navy/70 leading-relaxed">{appt.notes}</p>
          </PortalCard>

          <PortalCard title="Documents" action={<button className="text-[11px] font-mono uppercase tracking-widest text-gold">Upload</button>}>
            <ul className="divide-y divide-navy/10 text-sm">
              {["Care Plan v3", "Sleep & Recovery guide"].map((d) => (
                <li key={d} className="py-2.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-navy"><FileText size={13} className="text-academic" /> {d}</span>
                  <button className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy">Preview</button>
                </li>
              ))}
            </ul>
          </PortalCard>

          <Disclaim>If you are experiencing a medical emergency, do not use this portal. Call 911 or your local emergency services.</Disclaim>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24 h-fit">
          {appt.format.includes("Tele") && appt.status === "Confirmed" && (
            <Link to="/patient/telehealth/waiting-room"><BtnPrimary className="w-full">Join Visit</BtnPrimary></Link>
          )}
          <BtnGhost className="w-full" onClick={() => setShowReschedule(true)}>Reschedule</BtnGhost>
          <BtnGhost className="w-full" onClick={() => (toast.success("Added to calendar (demo)"))}><CalIcon size={13} /> Add to Calendar</BtnGhost>
          <Link to="/patient/forms"><BtnGhost className="w-full">Complete Forms</BtnGhost></Link>
          <Link to="/patient/messages"><BtnGhost className="w-full">Contact Clinic</BtnGhost></Link>
          <Link to="/patient/billing"><BtnGhost className="w-full">View Payment</BtnGhost></Link>
          <button onClick={() => setShowCancel(true)} className="w-full text-xs font-mono uppercase tracking-widest text-destructive/80 hover:text-destructive py-2">Cancel appointment</button>
        </aside>
      </div>

      {showCancel && <Modal onClose={() => setShowCancel(false)} title="Cancel this appointment?">
        <p className="text-sm text-navy/70 mb-4">Please share a brief reason so your care team can follow up.</p>
        <label className="block eyebrow text-navy/50 mb-2">Reason</label>
        <textarea rows={4} className="w-full border border-navy/15 rounded-sm p-3 text-sm outline-none focus:border-teal" placeholder="Optional…" />
        <Disclaim>Our cancellation policy allows changes up to 24 hours before your visit at no cost.</Disclaim>
        <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-end">
          <BtnGhost onClick={() => setShowCancel(false)}>Keep appointment</BtnGhost>
          <BtnPrimary onClick={() => { setShowCancel(false); toast.success("Cancellation request sent (demo)"); }}>Confirm cancellation</BtnPrimary>
        </div>
      </Modal>}

      {showReschedule && <Modal onClose={() => setShowReschedule(false)} title="Reschedule appointment">
        <p className="text-sm text-navy/70 mb-4">Choose a new date and time. Availability is illustrative.</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
          {["Jul 28", "Jul 29", "Jul 30", "Jul 31", "Aug 04"].map((d, i) => (
            <button key={d} className={`border rounded-sm p-2 text-xs ${i === 1 ? "border-gold bg-gold/10 text-navy" : "border-navy/15 text-navy/70 hover:border-navy/30"}`}>{d}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"].map((t, i) => (
            <button key={t} className={`border rounded-sm p-2 text-xs ${i === 1 ? "border-gold bg-gold/10" : "border-navy/15 text-navy/70 hover:border-navy/30"}`}>{t}</button>
          ))}
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-end">
          <BtnGhost onClick={() => setShowReschedule(false)}>Cancel</BtnGhost>
          <BtnPrimary onClick={() => { setShowReschedule(false); toast.success("Reschedule request sent (demo)"); }}>Confirm reschedule</BtnPrimary>
        </div>
      </Modal>}
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <dt className="eyebrow text-navy/50 text-[10px] mb-1">{label}</dt>
      <dd className="text-navy inline-flex items-center gap-1.5">{icon}{value}</dd>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="bg-paper border border-navy/15 rounded-sm max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-navy">{title}</h2>
          <button onClick={onClose} className="text-navy/50 hover:text-navy"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
