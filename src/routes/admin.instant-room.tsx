import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Panel, Badge, Btn } from "@/components/admin/primitives";
import { patients } from "@/data/admin";
import { Video, Copy, Mail, MessageSquare, Link2, Check, RefreshCw, ExternalLink, Shield, Clock, User, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/instant-room")({
  head: () => ({ meta: [{ title: "Instant Room — JC Admin" }, { name: "robots", content: "noindex" }] }),
  component: InstantRoom,
});

type Room = {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  duration: number;
  language: string;
  note: string;
  createdAt: string;
  expiresIn: number; // minutes
  status: "Waiting" | "Joined" | "Ended";
  provider: "JC Secure" | "Google Meet" | "Zoom" | "Microsoft Teams" | "Doxy.me" | "Other";
  externalLink?: string;
};

function makeRoomId() {
  const s = () => Math.random().toString(36).slice(2, 6);
  return `RM-${s()}-${s()}`.toUpperCase();
}

function originJoinUrl(id: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://jcintegrative.health";
  return `${origin}/join/${id}`;
}

const SEED: Room[] = [
  { id: "RM-A8F2-K91X", patientId: "P-1042", patientName: "Amelia Reyes", type: "Follow-up", duration: 30, language: "English", note: "Review labs from Aug 12.", createdAt: "Today · 09:12", expiresIn: 240, status: "Waiting" },
  { id: "RM-BX22-77QP", patientId: "P-1043", patientName: "Rafael Marques", type: "Quick check-in", duration: 15, language: "Portuguese", note: "Medication tolerance.", createdAt: "Today · 08:04", expiresIn: 0, status: "Ended" },
];

function InstantRoom() {
  const [rooms, setRooms] = useState<Room[]>(SEED);
  const [patientId, setPatientId] = useState<string>(patients[0].id);
  const [type, setType] = useState("Follow-up");
  const [duration, setDuration] = useState(30);
  const [language, setLanguage] = useState("English");
  const [expires, setExpires] = useState(120);
  const [note, setNote] = useState("");
  const [provider, setProvider] = useState<"JC Secure" | "Google Meet" | "Zoom" | "Microsoft Teams" | "Doxy.me" | "Other">("JC Secure");
  const [externalLink, setExternalLink] = useState("");
  const [created, setCreated] = useState<Room | null>(null);
  const [copied, setCopied] = useState(false);

  const patient = useMemo(() => patients.find((p) => p.id === patientId)!, [patientId]);

  const handleCreate = () => {
    const room: Room = {
      id: makeRoomId(),
      patientId: patient.id,
      patientName: patient.name,
      type,
      duration,
      language,
      note,
      createdAt: "Just now",
      expiresIn: expires,
      status: "Waiting",
    };
    setRooms((r) => [room, ...r]);
    setCreated(room);
    setNote("");
    toast.success("Instant Room created — share the secure link with your patient.");
  };

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(originJoinUrl(id));
      setCopied(true);
      toast.success("Secure link copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const revoke = (id: string) => {
    setRooms((r) => r.map((x) => (x.id === id ? { ...x, status: "Ended", expiresIn: 0 } : x)));
    if (created?.id === id) setCreated(null);
    toast.success("Room revoked");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Practice · Telehealth"
        title="Instant Room"
        description="Start an ad-hoc secure video consultation and share a one-time link with your patient."
        actions={<Btn variant="outline" onClick={() => { setCreated(null); }}>New Room</Btn>}
      />

      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-4">
        {/* LEFT — form / created panel */}
        {!created ? (
          <Panel title="Create manual consultation" action={<span className="text-[10px] uppercase tracking-widest text-navy/45">Secure · HIPAA</span>}>
            <div className="grid gap-4">
              <Field label="Patient">
                <div className="flex items-center gap-2">
                  <select value={patientId} onChange={(e) => setPatientId(e.target.value)}
                    className="w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} · {p.id} · {p.lang}</option>
                    ))}
                  </select>
                  <span className="text-[10px] uppercase tracking-widest text-navy/45 hidden md:inline">{patient.state} · {patient.service}</span>
                </div>
              </Field>

              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Visit type">
                  <select value={type} onChange={(e) => setType(e.target.value)}
                    className="w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                    {["Follow-up", "Quick check-in", "Lab review", "Second opinion", "Coaching"].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </Field>
                <Field label="Duration">
                  <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                    {[10, 15, 20, 30, 45, 60].map((x) => <option key={x} value={x}>{x} min</option>)}
                  </select>
                </Field>
                <Field label="Language">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-10 border border-navy/15 bg-card px-3 text-sm text-navy outline-none focus:border-teal">
                    {["English", "Spanish", "Portuguese", "Mandarin"].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Link valid for">
                <div className="flex flex-wrap gap-2">
                  {[30, 60, 120, 240, 1440].map((m) => (
                    <button key={m} onClick={() => setExpires(m)}
                      className={`h-9 px-3 border text-[11px] uppercase tracking-widest ${expires === m ? "border-navy text-navy bg-mist/40" : "border-navy/15 text-navy/60 hover:text-navy"}`}>
                      {m < 60 ? `${m} min` : m < 1440 ? `${m / 60} h` : "24 h"}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Note to patient (optional)">
                <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Please have your recent labs available."
                  className="w-full border border-navy/15 bg-card p-3 text-sm text-navy outline-none focus:border-teal" />
              </Field>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-navy/8">
                <div className="text-[11px] uppercase tracking-widest text-navy/45 flex items-center gap-2">
                  <Shield size={12} /> Encrypted end-to-end · Single-use link
                </div>
                <Btn onClick={handleCreate}><Video size={13} /> Create Instant Room</Btn>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="Room ready" action={<Badge tone="Active">Waiting for patient</Badge>}>
            <div className="border border-navy/10 bg-mist/30 p-4 rounded-sm">
              <div className="eyebrow text-gold text-[10px] mb-1">Secure join link</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 min-w-0 truncate text-sm text-navy font-mono bg-card border border-navy/10 px-3 h-10 flex items-center">{originJoinUrl(created.id)}</code>
                <button onClick={() => copyLink(created.id)} className="h-10 px-3 border border-navy/15 bg-card text-navy hover:border-navy/30 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest">
                  {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-widest text-navy/45 flex flex-wrap gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1"><User size={11} /> {created.patientName}</span>
                <span className="inline-flex items-center gap-1"><Clock size={11} /> Valid {created.expiresIn < 60 ? `${created.expiresIn} min` : `${created.expiresIn / 60} h`}</span>
                <span>{created.duration} min · {created.language}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-2 mt-4">
              <ShareBtn icon={<Mail size={13} />} label="Send by Email" onClick={() => toast.success(`Email sent to ${created.patientName} (demo)`)} />
              <ShareBtn icon={<MessageSquare size={13} />} label="Send by SMS" onClick={() => toast.success(`SMS sent to ${created.patientName} (demo)`)} />
              <ShareBtn icon={<Link2 size={13} />} label="Post to Portal" onClick={() => toast.success("Posted to patient portal inbox (demo)")} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-between">
              <a href={originJoinUrl(created.id)} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 h-10 px-3 text-[11px] uppercase tracking-widest text-navy/60 hover:text-navy">
                <ExternalLink size={13} /> Preview as patient
              </a>
              <div className="flex gap-2">
                <Btn variant="outline" onClick={() => revoke(created.id)}>Revoke link</Btn>
                <Btn onClick={() => toast.success("Opening physician console (demo)")}><Video size={13} /> Enter room</Btn>
              </div>
            </div>
          </Panel>
        )}

        {/* RIGHT — recent rooms */}
        <Panel title="Recent rooms" action={<span className="text-[10px] uppercase tracking-widest text-navy/45">{`${rooms.length} total`}</span>}>
          {rooms.length === 0 ? (
            <div className="text-center py-10 text-sm text-navy/50">No rooms yet.</div>
          ) : (
            <ul className="divide-y divide-navy/8">
              {rooms.map((r) => (
                <li key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-navy">{r.id}</span>
                      <Badge tone={r.status === "Waiting" ? "Active" : r.status === "Joined" ? "Confirmed" : "Inactive"}>{r.status}</Badge>
                    </div>
                    <div className="text-sm text-navy/75 truncate">{r.patientName} · {r.type} · {r.duration} min</div>
                    <div className="text-[10px] uppercase tracking-widest text-navy/45">{r.createdAt} · {r.expiresIn > 0 ? `expires in ${r.expiresIn} min` : "expired"}</div>
                  </div>
                  <div className="flex gap-1 sm:justify-end">
                    <button onClick={() => copyLink(r.id)} disabled={r.status === "Ended"}
                      className="h-8 px-2 border border-navy/15 text-[10px] uppercase tracking-widest text-navy/65 hover:text-navy disabled:opacity-40 inline-flex items-center gap-1">
                      <Copy size={11} /> Copy
                    </button>
                    <a href={originJoinUrl(r.id)} target="_blank" rel="noreferrer"
                       className={`h-8 px-2 border border-navy/15 text-[10px] uppercase tracking-widest inline-flex items-center gap-1 ${r.status === "Ended" ? "opacity-40 pointer-events-none" : "text-navy/65 hover:text-navy"}`}>
                      <ExternalLink size={11} /> Open
                    </a>
                    <button onClick={() => revoke(r.id)} disabled={r.status === "Ended"}
                      className="h-8 px-2 border border-navy/15 text-[10px] uppercase tracking-widest text-navy/65 hover:text-navy disabled:opacity-40 inline-flex items-center gap-1">
                      <RefreshCw size={11} /> Revoke
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Flow explainer */}
        <Panel title="How it works" className="lg:col-span-2">
          <ol className="grid md:grid-cols-4 gap-4 text-sm">
            {[
              ["01", "Create", "Select the patient, visit type and duration."],
              ["02", "Share", "Copy the secure single-use link or send via Email, SMS, or Portal."],
              ["03", "Patient joins", "Patient opens the link, accepts consents, and runs the device check."],
              ["04", "Consult", "Enter the room when the patient is in the waiting area."],
            ].map(([n, t, d]) => (
              <li key={n} className="border border-navy/10 bg-card p-4">
                <div className="eyebrow text-gold text-[10px]">Step {n}</div>
                <div className="font-serif text-lg text-navy mt-1">{t}</div>
                <p className="text-sm text-navy/60 mt-1">{d}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-navy/50 mb-1.5 font-medium">{label}</span>
      {children}
    </label>
  );
}

function ShareBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="h-11 border border-navy/15 bg-card hover:border-navy/30 text-sm text-navy inline-flex items-center justify-center gap-2 transition-colors">
      {icon} {label}
    </button>
  );
}
