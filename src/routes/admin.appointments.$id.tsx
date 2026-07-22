import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { PageHeader, Panel, Badge, Btn } from "@/components/admin/primitives";
import { appointments } from "@/data/admin";
import {
  APPOINTMENT_STATUSES,
  PATIENT_TAGS,
  PAYMENT_STATUSES,
  bookFollowUp,
  createAppointment,
  getAppointment,
  updateAppointment,
  useAppointment,
  type AppointmentRequest,
} from "@/lib/appointmentStore";
import { toast } from "sonner";
import { Copy, ExternalLink, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/appointments/$id")({
  loader: ({ params }) => {
    const stored = getAppointment(params.id);
    const mock = appointments.find((x) => x.id === params.id);
    if (!stored && !mock) throw notFound();
    return { id: params.id };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.id} — JC Admin`
          : "Appointment — JC Admin",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <div className="text-center py-24">
      <div className="eyebrow text-gold">404</div>
      <h1 className="font-serif text-3xl text-navy mt-2">
        Appointment not found
      </h1>
      <div className="mt-6">
        <Link
          to="/admin/appointments"
          className="text-xs uppercase tracking-widest text-navy/70 hover:text-navy"
        >
          ← Back
        </Link>
      </div>
    </div>
  ),
  component: AppointmentDetail,
});

// Ensure the appointment lives in the store so we can mutate it. If the id
// only exists in the static mock dataset, seed it into localStorage the first
// time the user opens the detail page.
function useHydratedAppointment(id: string): AppointmentRequest | undefined {
  const stored = useAppointment(id);
  useEffect(() => {
    if (stored) return;
    const mock = appointments.find((x) => x.id === id);
    if (!mock) return;
    if (getAppointment(id)) return;
    // Reuse the mock's id when seeding so links stay stable.
    const seeded: AppointmentRequest = {
      id: mock.id,
      createdAt: new Date().toISOString(),
      source: "admin",
      date: mock.date,
      time: mock.time,
      patient: mock.patient,
      type: mock.type,
      service: mock.service,
      state: mock.state,
      lang: mock.lang,
      format: mock.format as AppointmentRequest["format"],
      duration: mock.duration,
      status: mock.status as AppointmentRequest["status"],
      pay: mock.pay as AppointmentRequest["pay"],
    };
    // Bypass nextId by writing directly through createAppointment then rewriting id.
    // Simpler: just write via localStorage-aware helper.
    createAppointment({ ...seeded });
    // Fix id back to mock.id (createAppointment assigns a new one).
    const raw = window.localStorage.getItem("jc.appointments.v1");
    if (raw) {
      const rows = JSON.parse(raw) as AppointmentRequest[];
      // Replace the newest row's id with mock.id
      if (rows[0]) rows[0].id = mock.id;
      window.localStorage.setItem("jc.appointments.v1", JSON.stringify(rows));
      window.dispatchEvent(new StorageEvent("storage", { key: "jc.appointments.v1" }));
    }
  }, [id, stored]);
  return stored;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] uppercase tracking-widest text-navy/50">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function AppointmentDetail() {
  const { id } = Route.useLoaderData();
  const a = useHydratedAppointment(id);

  if (!a) {
    return (
      <div className="py-24 text-center text-sm text-navy/60">Loading…</div>
    );
  }

  return <DetailBody a={a} />;
}

function DetailBody({ a }: { a: AppointmentRequest }) {
  const [notes, setNotes] = useState(a.notes ?? "");
  const [meetingLink, setMeetingLink] = useState(a.meetingLink ?? "");

  useEffect(() => setNotes(a.notes ?? ""), [a.id, a.notes]);
  useEffect(() => setMeetingLink(a.meetingLink ?? ""), [a.id, a.meetingLink]);

  const savedLink = a.meetingLink ?? "";
  const linkDirty = meetingLink !== savedLink;
  const notesDirty = notes !== (a.notes ?? "");

  return (
    <div>
      <PageHeader
        eyebrow={`Appointment · ${a.id}`}
        title={a.type}
        description={`${a.patient} · ${a.date} at ${a.time} · ${a.format} · ${a.duration} min`}
        crumbs={[
          { label: "Appointments", to: "/admin/appointments" },
          { label: a.id },
        ]}
        actions={
          <>
            <Badge tone={a.status}>{a.status}</Badge>
            {a.patientTag ? <Badge>{a.patientTag}</Badge> : null}
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Manual workflow panel */}
        <Panel title="Post-visit update" className="lg:col-span-2">
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Consultation status">
              <Select
                value={a.status}
                options={APPOINTMENT_STATUSES}
                onChange={(v) => {
                  updateAppointment(a.id, {
                    status: v as AppointmentRequest["status"],
                  });
                  toast.success(`Status set to ${v}`);
                }}
              />
            </Field>
            <Field label="Patient tag">
              <Select
                value={a.patientTag ?? "Returning patient"}
                options={PATIENT_TAGS}
                onChange={(v) => {
                  updateAppointment(a.id, {
                    patientTag: v as AppointmentRequest["patientTag"],
                  });
                  toast.success(`Tagged as ${v}`);
                }}
              />
            </Field>
            <Field label="Payment">
              <Select
                value={a.pay}
                options={PAYMENT_STATUSES}
                onChange={(v) => {
                  updateAppointment(a.id, {
                    pay: v as AppointmentRequest["pay"],
                  });
                  toast.success(`Payment: ${v}`);
                }}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-4">
            <Field label="Meeting link (Google Meet, Zoom, etc.)">
              <div className="flex flex-wrap gap-2">
                <input
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="flex-1 min-w-[240px] h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
                />
                <Btn
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const slug = Math.random().toString(36).slice(2, 5) +
                      "-" + Math.random().toString(36).slice(2, 6) +
                      "-" + Math.random().toString(36).slice(2, 5);
                    setMeetingLink(`https://meet.google.com/${slug}`);
                  }}
                >
                  <RefreshCw size={13} /> Generate
                </Btn>
                <Btn
                  size="sm"
                  variant="outline"
                  disabled={!savedLink}
                  onClick={() => {
                    if (!savedLink) return;
                    navigator.clipboard?.writeText(savedLink);
                    toast.success("Link copied");
                  }}
                >
                  <Copy size={13} /> Copy
                </Btn>
                {savedLink ? (
                  <a
                    href={savedLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-3 border border-navy/15 text-xs uppercase tracking-widest text-navy/70 hover:text-navy hover:border-navy/40"
                  >
                    <ExternalLink size={13} /> Open
                  </a>
                ) : null}
                <Btn
                  size="sm"
                  disabled={!linkDirty}
                  onClick={() => {
                    updateAppointment(a.id, {
                      meetingLink: meetingLink.trim() || undefined,
                    });
                    toast.success("Meeting link saved");
                  }}
                >
                  Save link
                </Btn>
              </div>
            </Field>

            <Field label="Clinical notes">
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Chief concern, assessment & plan…"
                className="border border-navy/15 bg-card p-3 text-sm text-navy outline-none focus:border-teal"
              />
              <div className="flex justify-end">
                <Btn
                  size="sm"
                  disabled={!notesDirty}
                  onClick={() => {
                    updateAppointment(a.id, { notes });
                    toast.success("Notes saved");
                  }}
                >
                  Save notes
                </Btn>
              </div>
            </Field>
          </div>
        </Panel>

        {/* Visit details */}
        <Panel title="Visit details">
          <dl className="grid gap-y-2 text-sm">
            {[
              ["Patient", a.patient],
              ["Email", a.email ?? "—"],
              ["Phone", a.phone ?? "—"],
              ["Date", a.date],
              ["Time", a.time],
              ["Format", a.format],
              ["Service", a.service],
              ["State", a.state],
              ["Language", a.lang],
              ["Duration", `${a.duration} min`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between border-b border-navy/10 py-1.5 gap-4"
              >
                <dt className="text-navy/50 uppercase tracking-widest text-[11px]">
                  {k}
                </dt>
                <dd className="text-navy text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        {/* Follow-up */}
        <FollowUpPanel a={a} />
      </div>
    </div>
  );
}

function FollowUpPanel({ a }: { a: AppointmentRequest }) {
  const linked = useAppointment(a.followUpId ?? "");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [format, setFormat] = useState<AppointmentRequest["format"]>(a.format);
  const [duration, setDuration] = useState(a.duration);
  const [link, setLink] = useState("");

  const canSubmit = date && time;

  if (linked) {
    return (
      <Panel title="Follow-up booked" className="lg:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-navy">
            <span className="text-navy/50 uppercase tracking-widest text-[11px] mr-2">
              Next visit
            </span>
            {linked.date} · {linked.time} · {linked.format} · {linked.duration} min
          </div>
          <Link
            to="/admin/appointments/$id"
            params={{ id: linked.id }}
            className="text-xs uppercase tracking-widest text-navy/70 hover:text-navy"
          >
            Open {linked.id} →
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Book follow-up"
      className="lg:col-span-3"
      action={
        !open ? (
          <Btn size="sm" variant="outline" onClick={() => setOpen(true)}>
            New follow-up
          </Btn>
        ) : null
      }
    >
      {!open ? (
        <p className="text-sm text-navy/60">
          Schedule the next appointment for {a.patient}. Sends nothing —
          manual workflow.
        </p>
      ) : (
        <div className="grid gap-4">
          <div className="grid sm:grid-cols-4 gap-3">
            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
              />
            </Field>
            <Field label="Format">
              <Select
                value={format}
                options={["Telehealth", "In-person"]}
                onChange={(v) => setFormat(v as AppointmentRequest["format"])}
              />
            </Field>
            <Field label="Duration (min)">
              <input
                type="number"
                min={15}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 30)}
                className="h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
              />
            </Field>
          </div>
          <Field label="Meeting link (optional)">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://meet.google.com/…"
              className="h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal"
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Btn size="sm" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Btn>
            <Btn
              size="sm"
              disabled={!canSubmit}
              onClick={() => {
                const created = bookFollowUp(a.id, {
                  date,
                  time,
                  type: a.type,
                  service: a.service,
                  format,
                  duration,
                  meetingLink: link.trim() || undefined,
                  patientTag: "Follow-up",
                });
                if (created) {
                  toast.success(`Follow-up ${created.id} booked`);
                  setOpen(false);
                }
              }}
            >
              Book follow-up
            </Btn>
          </div>
        </div>
      )}
    </Panel>
  );
}
