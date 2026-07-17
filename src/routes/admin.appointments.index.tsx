import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Toolbar, DataTable, Badge, Btn, Chip, ExportBtn, Pagination } from "@/components/admin/primitives";
import { appointments } from "@/data/admin";
import { CalendarPlus } from "lucide-react";

export const Route = createFileRoute("/admin/appointments/")({
  head: () => ({ meta: [{ title: "Appointments — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: AppointmentsList,
});

function AppointmentsList() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [format, setFormat] = useState("All");
  const rows = appointments.filter((a) =>
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
          {["All", "Confirmed", "Checked In", "In Progress", "Completed", "Cancelled", "No Show"].map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>
          ))}
          <span className="mx-2 h-4 w-px bg-navy/15" />
          {["All", "Telehealth", "In-person"].map((s) => (
            <Chip key={s} active={format === s} onClick={() => setFormat(s)}>{s}</Chip>
          ))}
        </>}
      />
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
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
          { key: "pay", label: "Payment", render: (r) => <Badge tone={r.pay}>{r.pay}</Badge> },
        ]}
      />
      <Pagination page={1} total={2} />
    </div>
  );
}
