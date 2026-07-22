import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Badge, Btn, Chip } from "@/components/admin/primitives";
import { appointments } from "@/data/admin";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/calendar")({
  head: () => ({ meta: [{ title: "Calendar — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: CalendarView,
});

function CalendarView() {
  const [view, setView] = useState<"Week" | "Day" | "Month">("Week");
  const days = ["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22", "Sat 23", "Sun 24"];
  const hours = Array.from({ length: 10 }, (_, i) => 8 + i);

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Clinical calendar"
        description="Week of Aug 18 · 2026"
        actions={<>
          <Btn variant="outline" size="sm"><ChevronLeft size={12} /></Btn>
          <Btn variant="outline" size="sm">Today</Btn>
          <Btn variant="outline" size="sm"><ChevronRight size={12} /></Btn>
        </>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["Day", "Week", "Month"] as const).map((v) => <Chip key={v} active={view === v} onClick={() => setView(v)}>{v}</Chip>)}
        <span className="mx-2 h-4 w-px bg-navy/15" />
        <Chip active>All services</Chip>
        <Chip>Telehealth</Chip>
        <Chip>In-person</Chip>
        <Chip>Blocks</Chip>
      </div>

      <Panel className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Day headers */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-navy/10">
            <div />
            {days.map((d) => <div key={d} className="p-2 eyebrow text-navy/50 border-l border-navy/10">{d}</div>)}
          </div>
          {/* Time grid */}
          {hours.map((h) => (
            <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-navy/5 min-h-[68px]">
              <div className="p-2 text-[10px] font-mono text-navy/40">{String(h).padStart(2, "0")}:00</div>
              {days.map((d, di) => {
                const events = appointments.filter((a) => a.time.startsWith(String(h).padStart(2, "0")) && di === 1);
                return (
                  <div key={d} className="border-l border-navy/10 p-1.5 relative">
                    {events.map((e) => (
                      <div key={e.id} className={`text-[11px] p-1.5 border-l-2 ${e.format === "Telehealth" ? "border-teal bg-teal/5" : "border-gold bg-gold/5"} text-navy leading-tight`}>
                        <div className="font-medium truncate">{e.patient}</div>
                        <div className="text-navy/50 truncate">{e.type}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-widest text-navy/50">
        <span className="flex items-center gap-2"><span className="h-2 w-2 bg-teal" /> Telehealth</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 bg-gold" /> In-person</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 bg-navy/40" /> Blocked</span>
      </div>
    </div>
  );
}
