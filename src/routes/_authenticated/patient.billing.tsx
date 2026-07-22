import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, StatusPill, BtnPrimary, BtnGhost, Disclaim } from "./patient";
import { invoices } from "@/data/patient";

export const Route = createFileRoute("/_authenticated/patient/billing")({
  head: () => ({ meta: [{ title: "Billing — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: BillingPage,
});

function BillingPage() {
  const balance = invoices.reduce((sum, i) => sum + i.balance, 0);

  return (
    <div>
      <PortalPageHeader eyebrow="Payments" title="Billing" lede="Invoices, receipts, and insurance-related documents." actions={<BtnPrimary onClick={() => toast("Payment placeholder (demo)")}>Pay balance</BtnPrimary>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { l: "Current balance", v: `$${balance.toFixed(2)}` },
          { l: "Upcoming payment", v: "$220.00" },
          { l: "Recent payment", v: "$480.00" },
          { l: "Payment method", v: "•••• 4242" },
        ].map((k) => (
          <div key={k.l} className="border border-navy/10 rounded-sm p-4 bg-card">
            <div className="eyebrow text-navy/50 text-[10px]">{k.l}</div>
            <div className="font-serif text-2xl text-navy mt-1">{k.v}</div>
          </div>
        ))}
      </div>

      <PortalCard title="Invoices" meta={`${invoices.length} total`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] font-mono uppercase tracking-widest text-navy/50 border-b border-navy/10">
              <tr><th className="py-2 pr-4">Invoice</th><th className="pr-4">Service</th><th className="pr-4">Date</th><th className="pr-4">Amount</th><th className="pr-4">Balance</th><th>Status</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-navy/8">
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td className="py-3 pr-4 font-mono text-navy text-[12px]">{i.id}</td>
                  <td className="pr-4 text-navy">{i.service}</td>
                  <td className="pr-4 text-navy/70">{i.date}</td>
                  <td className="pr-4 text-navy">${i.amount}</td>
                  <td className="pr-4 text-navy">${i.balance}</td>
                  <td><StatusPill tone={i.status === "Paid" ? "success" : i.status === "Overdue" ? "danger" : "warn"}>{i.status}</StatusPill></td>
                  <td className="pl-2">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => toast("Invoice opened (demo)")} className="text-[11px] font-mono uppercase tracking-widest text-navy/60 hover:text-navy">View</button>
                      {i.balance > 0 && <button onClick={() => toast.success("Payment initiated (demo)")} className="text-[11px] font-mono uppercase tracking-widest text-gold hover:text-navy">Pay</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>

      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <PortalCard title="Insurance & reimbursement">
          <p className="text-sm text-navy/70 mb-3">Superbills and reimbursement documents will appear here.</p>
          <div className="flex flex-wrap gap-2">
            <BtnGhost onClick={() => toast("Upload placeholder (demo)")}>Upload insurance card</BtnGhost>
            <BtnGhost onClick={() => toast("Superbill downloaded (demo)")}>Download superbill</BtnGhost>
          </div>
        </PortalCard>
        <PortalCard title="Contact billing">
          <p className="text-sm text-navy/70 mb-3">Questions about a charge? Reach our billing team.</p>
          <BtnGhost onClick={() => toast("Billing contacted (demo)")}>Send billing message</BtnGhost>
        </PortalCard>
      </div>

      <div className="mt-6"><Disclaim>Insurance coverage varies. We do not guarantee coverage or reimbursement; please verify benefits with your insurer.</Disclaim></div>
    </div>
  );
}
