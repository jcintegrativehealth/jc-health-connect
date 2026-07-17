import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PageHeader, Panel, Badge, Btn } from "@/components/admin/primitives";
import { appointments } from "@/data/admin";

export const Route = createFileRoute("/admin/appointments/$id")({
  loader: ({ params }) => {
    const a = appointments.find((x) => x.id === params.id);
    if (!a) throw notFound();
    return { appointment: a };
  },
  head: ({ loaderData }) => loaderData
    ? { meta: [{ title: `${loaderData.appointment.id} — JC Admin` }, { name: "robots", content: "noindex" }] }
    : { meta: [{ title: "Appointment — JC Admin" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="text-center py-24">
      <div className="eyebrow text-gold">404</div>
      <h1 className="font-serif text-3xl text-navy mt-2">Appointment not found</h1>
      <div className="mt-6"><Link to="/admin/appointments" className="text-xs uppercase tracking-widest text-navy/70 hover:text-navy">← Back</Link></div>
    </div>
  ),
  component: AppointmentDetail,
});

function AppointmentDetail() {
  const { appointment: a } = Route.useLoaderData();
  return (
    <div>
      <PageHeader
        eyebrow={`Appointment · ${a.id}`}
        title={a.type}
        description={`${a.patient} · ${a.date} at ${a.time} · ${a.format} · ${a.duration} min`}
        crumbs={[{ label: "Appointments", to: "/admin/appointments" }, { label: a.id }]}
        actions={<>
          <Btn variant="outline">Reschedule</Btn>
          <Btn>Start visit</Btn>
        </>}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Panel title="Visit details" className="lg:col-span-2">
          <dl className="grid sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
            {[
              ["Patient", a.patient], ["Status", <Badge tone={a.status}>{a.status}</Badge>],
              ["Date", a.date], ["Time", a.time],
              ["Format", a.format], ["Service", a.service],
              ["State", a.state], ["Language", a.lang],
              ["Duration", `${a.duration} min`], ["Payment", <Badge tone={a.pay}>{a.pay}</Badge>],
            ].map(([k, v], i) => (
              <div key={i} className="flex justify-between border-b border-navy/10 py-2 gap-4">
                <dt className="text-navy/50 uppercase tracking-widest text-[11px]">{k}</dt>
                <dd className="text-navy text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Actions">
          <div className="grid gap-2">
            {["Start visit", "Reschedule", "Cancel", "Mark no-show", "Send reminder", "Add clinical note", "Add payment", "Create follow-up", "Open patient profile"].map((x) => (
              <button key={x} className="text-left h-10 px-3 border border-navy/15 text-sm text-navy hover:border-navy/40">{x}</button>
            ))}
          </div>
        </Panel>

        <Panel title="Clinical notes (draft)" className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-4">
            <textarea rows={4} placeholder="Chief concern…" className="border border-navy/15 bg-card p-3 text-sm outline-none focus:border-teal" />
            <textarea rows={4} placeholder="Assessment & plan…" className="border border-navy/15 bg-card p-3 text-sm outline-none focus:border-teal" />
          </div>
          <div className="mt-3 flex justify-end"><Btn size="sm">Save note</Btn></div>
        </Panel>

        <Panel title="Intake & documents">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Intake form</span><span className="text-teal">Complete</span></li>
            <li className="flex justify-between"><span>Consent — telehealth</span><span className="text-teal">Signed</span></li>
            <li className="flex justify-between"><span>Latest labs</span><span className="text-navy/60">Aug 12</span></li>
            <li className="flex justify-between"><span>Care plan</span><span className="text-navy/60">Active</span></li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
