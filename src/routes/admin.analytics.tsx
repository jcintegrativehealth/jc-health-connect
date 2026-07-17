import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard, Panel, BarChart, LineChart, Donut } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: Analytics,
});

function Analytics() {
  return (
    <div>
      <PageHeader eyebrow="Operations" title="Analytics" description="Clinic-wide performance across patients, appointments, revenue and content." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Patient retention" value="92%" tone="teal" trend="↑ 1.4%" />
        <StatCard label="Appointment fill rate" value="88%" tone="teal" />
        <StatCard label="No-show rate" value="4.2%" tone="gold" />
        <StatCard label="Avg. revenue / patient" value="$1,240" trend="↑ 3.8%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Revenue · 12 months" className="lg:col-span-2"><LineChart data={[62, 71, 68, 82, 79, 91, 88, 105, 112, 121, 128, 132]} height={180} /></Panel>
        <Panel title="Service mix">
          <Donut segments={[
            { value: 38, color: "var(--navy)", label: "Longevity" },
            { value: 22, color: "var(--academic)", label: "Metabolic" },
            { value: 18, color: "var(--teal)", label: "Preventive" },
            { value: 14, color: "var(--gold)", label: "Cardio-metabolic" },
            { value: 8, color: "var(--mist)", label: "Weight" },
          ]} />
        </Panel>
        <Panel title="Appointments by day" className="lg:col-span-2"><BarChart data={[8, 12, 14, 18, 16, 20, 6]} /></Panel>
        <Panel title="Language mix">
          <Donut segments={[
            { value: 54, color: "var(--navy)", label: "English" },
            { value: 22, color: "var(--academic)", label: "Portuguese" },
            { value: 16, color: "var(--teal)", label: "Spanish" },
            { value: 8, color: "var(--gold)", label: "Mandarin" },
          ]} />
        </Panel>
        <Panel title="Content performance · views last 30d" className="lg:col-span-3">
          <BarChart data={[2100, 1180, 890, 2410, 1520, 1980, 3120, 4210]} tone="gold" />
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-navy/40 mt-2">
            <span>FDA update</span><span>Meds Aug</span><span>Wearables</span><span>CGM</span><span>ApoB</span><span>Fatigue</span><span>Adaptogens</span><span>mTOR</span>
          </div>
        </Panel>
      </div>
    </div>
  );
}
