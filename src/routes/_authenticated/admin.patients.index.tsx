import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Toolbar, DataTable, Pagination, Badge, Btn, Chip, ExportBtn } from "@/components/admin/primitives";
import { patients } from "@/data/admin";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/patients/")({
  head: () => ({ meta: [{ title: "Patients — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: PatientsList,
});

function PatientsList() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const rows = patients.filter((p) =>
    (status === "All" || p.status === status) &&
    (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.id.includes(q))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Patients"
        description={`${patients.length} total · ${patients.filter((p) => p.status === "Active").length} active · ${patients.filter((p) => p.status === "New").length} new this month`}
        actions={<>
          <ExportBtn />
          <Btn onClick={() => nav({ to: "/admin/patients/new" })}><UserPlus size={13} /> New patient</Btn>
        </>}
      />
      <Toolbar
        searchPlaceholder="Search by name or patient ID…"
        onSearch={setQ}
        filters={<>
          {["All", "Active", "New", "Follow-Up", "Inactive", "Archived"].map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>
          ))}
          <div className="ml-auto text-[11px] uppercase tracking-widest text-navy/45">{rows.length} results</div>
        </>}
      />
      <DataTable
        rows={rows}
        onRowClick={(r) => nav({ to: "/admin/patients/$id", params: { id: r.id } })}
        columns={[
          { key: "name", label: "Name", render: (r) => (
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-full border border-navy/15 grid place-items-center text-[10px] font-semibold text-navy shrink-0">
                {r.name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <div className="text-navy truncate">{r.name}</div>
                <div className="text-[11px] text-navy/50 font-mono">{r.id}</div>
              </div>
            </div>
          ) },
          { key: "age", label: "Age" },
          { key: "state", label: "State" },
          { key: "lang", label: "Lang" },
          { key: "service", label: "Service" },
          { key: "last", label: "Last visit" },
          { key: "next", label: "Next" },
          { key: "balance", label: "Balance", align: "right", render: (r) => r.balance > 0 ? <span className="text-gold">${r.balance}</span> : <span className="text-navy/40">—</span> },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
      <Pagination page={1} total={4} />
    </div>
  );
}
