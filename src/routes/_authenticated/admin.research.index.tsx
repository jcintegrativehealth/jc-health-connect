import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Toolbar, DataTable, Badge, Btn, Chip, ExportBtn } from "@/components/admin/primitives";
import { research } from "@/data/admin";

export const Route = createFileRoute("/_authenticated/admin/research/")({
  head: () => ({ meta: [{ title: "Research — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: ResearchList,
});

function ResearchList() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const rows = research.filter((r) =>
    (status === "All" || r.status === status) &&
    (q === "" || r.title.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        eyebrow="Editorial"
        title="Research Hub CMS"
        description="Long-form scientific articles by Dr. Chen and invited physicians."
        actions={<><ExportBtn /><Btn>New research post</Btn></>}
      />
      <Toolbar
        searchPlaceholder="Search title…"
        onSearch={setQ}
        filters={<>
          {["All", "Draft", "In Review", "Approved", "Scheduled", "Published", "Archived"].map((s) => (
            <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>
          ))}
        </>}
      />
      <DataTable
        rows={rows}
        onRowClick={(r) => nav({ to: "/admin/research/$id", params: { id: r.id } })}
        columns={[
          { key: "id", label: "Ref", render: (r) => <span className="font-mono text-xs text-navy/70">{r.id}</span> },
          { key: "title", label: "Title" },
          { key: "author", label: "Author" },
          { key: "guest", label: "Guest" },
          { key: "category", label: "Category" },
          { key: "evidence", label: "Evidence level" },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
          { key: "views", label: "Views", align: "right", render: (r) => r.views > 0 ? r.views.toLocaleString() : <span className="text-navy/30">—</span> },
        ]}
      />
    </div>
  );
}
