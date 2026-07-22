import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PortalPageHeader, PortalCard, StatusPill, BtnPrimary, BtnGhost, Disclaim } from "./patient";
import { useAppointment, useAppointmentsStatus } from "@/lib/appointmentStore";
import { formatLongDate, formatTime } from "@/lib/datetime";
import { Video, MapPin, Clock, Globe, ArrowLeft, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/appointments/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Appointment ${params.id} — Patient Portal` }, { name: "robots", content: "noindex" }],
  }),
  component: AppointmentDetail,
});

function AppointmentDetail() {
  const { id } = useParams({ from: "/_authenticated/patient/appointments/$id" });
  const { ready } = useAppointmentsStatus();
  const appt = useAppointment(id);

  if (!ready) {
    return <div className="py-16 text-center text-sm text-navy/55">Loading…</div>;
  }

  if (!appt) {
    return (
      <div className="py-16 text-center">
        <div className="eyebrow text-gold">Not found</div>
        <h1 className="font-serif text-3xl text-navy mt-2">Appointment unavailable</h1>
        <Link to="/patient/appointments" className="inline-block mt-6"><BtnPrimary>Back to Appointments</BtnPrimary></Link>
      </div>
    );
  }

  const isTele = appt.format === "Telehealth";

  return (
    <div>
      <Link to="/patient/appointments" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-navy/50 hover:text-navy mb-4">
        <ArrowLeft size={12} /> All appointments
      </Link>

      <PortalPageHeader
        eyebrow={`Visit · ${appt.id}`}
        title={appt.type}
        lede={appt.service || undefined}
        actions={
          <>
            <StatusPill tone={appt.status === "Confirmed" ? "success" : appt.status === "Pending" ? "warn" : appt.status === "Completed" ? "info" : appt.status === "Cancelled" || appt.status === "No Show" ? "danger" : "neutral"}>{appt.status}</StatusPill>
            <StatusPill tone={appt.pay === "Paid" ? "success" : "neutral"}>{appt.pay}</StatusPill>
          </>
        }
      />

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        <div className="space-y-5">
          <PortalCard title="Visit details">
            <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <Field label="Date" value={formatLongDate(appt.date)} />
              <Field label="Time" value={formatTime(appt.time)} icon={<Clock size={12} />} />
              <Field label="Format" value={appt.format} icon={isTele ? <Video size={12} /> : <MapPin size={12} />} />
              <Field label="Language" value={appt.lang} icon={<Globe size={12} />} />
              <Field label="Duration" value={`${appt.duration} min`} />
              {appt.service && <Field label="Service" value={appt.service} />}
            </dl>
          </PortalCard>

          {appt.notes && (
            <PortalCard title="Notes from your care team">
              <p className="text-sm text-navy/70 leading-relaxed whitespace-pre-wrap">{appt.notes}</p>
            </PortalCard>
          )}

          <Disclaim>If you are experiencing a medical emergency, do not use this portal. Call 911 or your local emergency services.</Disclaim>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24 h-fit">
          {isTele && appt.status === "Confirmed" && appt.meetingLink && (
            <a href={appt.meetingLink} target="_blank" rel="noreferrer">
              <BtnPrimary className="w-full"><Video size={13} /> Join Visit</BtnPrimary>
            </a>
          )}
          {isTele && appt.status === "Confirmed" && !appt.meetingLink && (
            <div className="border border-navy/10 bg-mist/40 rounded-sm p-3 text-[12px] text-navy/60">
              Your telehealth join link will appear here once the clinic adds it.
            </div>
          )}
          <a href="mailto:info@jcintegrativehealth.com" className="block">
            <BtnGhost className="w-full"><Mail size={13} /> Contact Clinic</BtnGhost>
          </a>
          <p className="text-[11px] text-navy/50 leading-relaxed px-1">
            To reschedule or cancel, contact the clinic. Changes are handled by the clinical team.
          </p>
        </aside>
      </div>
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
