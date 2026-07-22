import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Toolbar, DataTable, Badge, Btn, Chip, ExportBtn } from "@/components/admin/primitives";
import { labs } from "@/data/admin";

export const Route = createFileRoute("/_authenticated/admin/labs")({
  head: () => ({ meta: [{ title: "Lab Results — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Labs,
});

function Labs() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [flagged, setFlagged] = useState(false);
  const rows = labs.filter((l) =>
    (status === "All" || l.status === status) &&
    (!flagged || l.flag) &&
    (q === "" || l.patient.toLowerCase().includes(q.toLowerCase()) || l.test.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Clinical"
        title="Lab results"
        description="Uploaded results across Quest, LabCorp, and Function Health integrations."
        actions={<><ExportBtn /><Btn>Upload result</Btn></>}
      />
      <Toolbar
        searchPlaceholder="Search patient, test or lab…"
        onSearch={setQ}
        filters={<>
          {["All", "New", "Reviewed", "Requires Follow-Up"].map((s) => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>)}
          <span className="mx-2 h-4 w-px bg-navy/15" />
          <Chip active={flagged} onClick={() => setFlagged(!flagged)}>Flagged only</Chip>
        </>}
      />
      <DataTable
        rows={rows}
        columns={[
          { key: "id", label: "Ref", render: (r) => <span className="font-mono text-xs text-navy/70">{r.id}</span> },
          { key: "patient", label: "Patient" },
          { key: "test", label: "Test" },
          { key: "lab", label: "Lab" },
          { key: "cat", label: "Category" },
          { key: "date", label: "Date" },
          { key: "flag", label: "Flag", render: (r) => r.flag ? <span className="text-[10px] uppercase tracking-widest text-gold">Flag</span> : <span className="text-navy/30">—</span> },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
        ]}
      />
    </div>
  );
}
