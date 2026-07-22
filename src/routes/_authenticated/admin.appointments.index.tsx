import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Toolbar, DataTable, Badge, Btn, Chip, ExportBtn, Pagination } from "@/components/admin/primitives";
import { APPOINTMENT_STATUSES, updateAppointmentStatus, useAppointments, useAppointmentsStatus, type AppointmentStatus } from "@/lib/appointmentStore";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/appointments/")({
  head: () => ({ meta: [{ title: "Appointments — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: AppointmentsList,
});

function AppointmentsList() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [format, setFormat] = useState("All");
  const stored = useAppointments();
  const { ready, error } = useAppointmentsStatus();

  const merged = useMemo(
    () =>
      stored.map((r) => ({
        id: r.id,
        date: r.date,
        time: r.time,
        patient: r.patient,
        type: r.type,
        service: r.service,
        state: r.state,
        lang: r.lang,
        format: r.format,
        duration: r.duration,
        status: r.status,
        pay: r.pay,
      })),
    [stored],
  );

  const rows = merged.filter((a) =>
    (status === "All" || a.status === status) &&
    (format === "All" || a.format === format) &&
    (q === "" || a.patient.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Appointments"
        description="All scheduled visits — in-person and telehealth."
        actions={<>
          <ExportBtn />
          <Btn onClick={() => nav({ to: "/admin/appointments/new" })}><CalendarPlus size={13} /> Schedule</Btn>
        </>}
      />
      <Toolbar
        searchPlaceholder="Search patient or appointment ID…"
        onSearch={setQ}
        filters={<>
          {["All", ...APPOINTMENT_STATUSES].map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>
          ))}
          <span className="mx-2 h-4 w-px bg-navy/15" />
          {["All", "Telehealth", "In-person"].map((s) => (
            <Chip key={s} active={format === s} onClick={() => setFormat(s)}>{s}</Chip>
          ))}
        </>}
      />
      {!ready && (
        <div className="py-12 text-center text-sm text-navy/50">Loading appointments…</div>
      )}
      {ready && error && (
        <div className="py-4 px-4 mb-4 border border-gold/40 bg-gold/5 text-sm text-navy/70">{error}</div>
      )}
      <DataTable
        rows={rows}
        onRowClick={(r) => nav({ to: "/admin/appointments/$id", params: { id: r.id } })}
        columns={[
          { key: "id", label: "Ref", render: (r) => <span className="font-mono text-xs text-navy/70">{r.id}</span> },
          { key: "date", label: "Date" },
          { key: "time", label: "Time" },
          { key: "patient", label: "Patient" },
          { key: "type", label: "Type" },
          { key: "state", label: "State" },
          { key: "lang", label: "Lang" },
          { key: "format", label: "Format" },
          { key: "duration", label: "Min", align: "right" },
          { key: "status", label: "Status", render: (r) => (
            <select
              value={r.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                const v = e.target.value as AppointmentStatus;
                updateAppointmentStatus(r.id, v)
                  .then(() => toast.success(`${r.id} → ${v}`))
                  .catch(() => toast.error(`Could not update ${r.id}`));
              }}
              className="h-8 border border-navy/15 bg-card px-2 text-xs text-navy outline-none focus:border-teal"
            >
              {APPOINTMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) },
          { key: "pay", label: "Payment", render: (r) => <Badge tone={r.pay}>{r.pay}</Badge> },
        ]}
      />
      <Pagination page={1} total={2} />
    </div>
  );
}
