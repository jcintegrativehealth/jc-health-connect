import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable, Badge, Btn, ExportBtn } from "@/components/admin/primitives";
import { insightsContent } from "@/data/admin";

export const Route = createFileRoute("/admin/insights")({
  head: () => ({ meta: [{ title: "Medical Insights — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Insights,
});

function Insights() {
  return (
    <div>
      <PageHeader eyebrow="Editorial" title="Medical Insights CMS" description="Short-form updates: medications, FDA changes, technology, digests." actions={<><ExportBtn /><Btn>New insight</Btn></>} />
      <DataTable
        rows={insightsContent}
        columns={[
          { key: "id", label: "Ref", render: (r) => <span className="font-mono text-xs text-navy/70">{r.id}</span> },
          { key: "title", label: "Title" },
          { key: "type", label: "Type" },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
          { key: "views", label: "Views", align: "right", render: (r) => r.views > 0 ? r.views.toLocaleString() : <span className="text-navy/30">—</span> },
        ]}
      />
    </div>
  );
}
