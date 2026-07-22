import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatCard, Panel, Toolbar, DataTable, Badge, Btn, Chip, ExportBtn, BarChart } from "@/components/admin/primitives";
import { invoices, payments, kpi } from "@/data/admin";

export const Route = createFileRoute("/_authenticated/admin/billing")({
  head: () => ({ meta: [{ title: "Billing — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Billing,
});

function Billing() {
  const [tab, setTab] = useState<"Invoices" | "Payments" | "Refunds">("Invoices");
  const [status, setStatus] = useState("All");
  const rows = invoices.filter((i) => status === "All" || i.status === status);

  return (
    <div>
      <PageHeader eyebrow="Relations" title="Billing" description="Invoices, payments and reimbursement tracking." actions={<><ExportBtn /><Btn>New invoice</Btn></>} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Revenue MTD" value={`$${kpi.revenueMonth.toLocaleString()}`} tone="teal" />
        <StatCard label="Collected" value={`$${kpi.collected.toLocaleString()}`} />
        <StatCard label="Outstanding" value={`$${kpi.outstanding.toLocaleString()}`} tone="gold" />
        <StatCard label="Overdue" value={`$${kpi.overdue.toLocaleString()}`} tone="gold" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Panel title="Revenue trend · last 8 weeks" className="lg:col-span-2">
          <BarChart data={[22, 25, 28, 24, 31, 30, 34, 36]} tone="navy" />
        </Panel>
        <Panel title="Reimbursement pipeline">
          <ul className="text-sm divide-y divide-navy/10 -m-4">
            <li className="flex justify-between px-4 py-3"><span>Superbills issued</span><span className="text-navy">12</span></li>
            <li className="flex justify-between px-4 py-3"><span>Submitted by patients</span><span className="text-navy">7</span></li>
            <li className="flex justify-between px-4 py-3"><span>Reimbursed</span><span className="text-teal">4</span></li>
            <li className="flex justify-between px-4 py-3"><span>Denied</span><span className="text-navy/50">1</span></li>
          </ul>
        </Panel>
      </div>

      <div className="border-b border-navy/10 mb-4 flex gap-2">
        {(["Invoices", "Payments", "Refunds"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-xs uppercase tracking-widest ${tab === t ? "text-navy border-b-2 border-gold -mb-px" : "text-navy/50 hover:text-navy"}`}>{t}</button>
        ))}
      </div>

      {tab === "Invoices" && (
        <>
          <Toolbar
            searchPlaceholder="Search invoice or patient…"
            filters={<>
              {["All", "Sent", "Paid", "Partial", "Overdue", "Refunded"].map((s) => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>)}
            </>}
          />
          <DataTable
            rows={rows}
            columns={[
              { key: "id", label: "Ref", render: (r) => <span className="font-mono text-xs text-navy/70">{r.id}</span> },
              { key: "patient", label: "Patient" },
              { key: "service", label: "Service" },
              { key: "date", label: "Issued" },
              { key: "due", label: "Due" },
              { key: "amount", label: "Amount", align: "right", render: (r) => `$${r.amount}` },
              { key: "balance", label: "Balance", align: "right", render: (r) => r.balance > 0 ? <span className="text-gold">${r.balance}</span> : <span className="text-navy/40">—</span> },
              { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
            ]}
          />
        </>
      )}

      {tab === "Payments" && (
        <DataTable
          rows={payments}
          columns={[
            { key: "id", label: "Ref", render: (r) => <span className="font-mono text-xs text-navy/70">{r.id}</span> },
            { key: "patient", label: "Patient" },
            { key: "invoice", label: "Invoice" },
            { key: "method", label: "Method" },
            { key: "date", label: "Date" },
            { key: "amount", label: "Amount", align: "right", render: (r) => `$${r.amount}` },
            { key: "status", label: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
          ]}
        />
      )}

      {tab === "Refunds" && (
        <Panel><div className="p-8 text-center text-sm text-navy/55">No refunds this period.</div></Panel>
      )}
    </div>
  );
}
