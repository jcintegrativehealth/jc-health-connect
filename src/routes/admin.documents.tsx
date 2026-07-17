import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Toolbar, DataTable, Btn, Chip, ExportBtn } from "@/components/admin/primitives";
import { documents } from "@/data/admin";

export const Route = createFileRoute("/admin/documents")({
  head: () => ({ meta: [{ title: "Documents — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Documents,
});

function Documents() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", "Intake Forms", "Lab Reports", "Clinical Files", "Research Files", "Templates"];
  const rows = documents.filter((d) =>
    (cat === "All" || d.cat === cat) &&
    (q === "" || d.name.toLowerCase().includes(q.toLowerCase()) || d.patient.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <PageHeader eyebrow="Operations" title="Documents" description="Encrypted document library — intake, labs, clinical, templates, research." actions={<><ExportBtn /><Btn>Upload</Btn></>} />
      <Toolbar
        searchPlaceholder="Search filename or patient…"
        onSearch={setQ}
        filters={<>{cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</>}
      />
      <DataTable
        rows={rows}
        columns={[
          { key: "name", label: "File" },
          { key: "patient", label: "Patient" },
          { key: "cat", label: "Category" },
          { key: "date", label: "Uploaded" },
          { key: "by", label: "By" },
          { key: "size", label: "Size" },
          { key: "version", label: "Version" },
          { key: "status", label: "Status" },
        ]}
      />
    </div>
  );
}
