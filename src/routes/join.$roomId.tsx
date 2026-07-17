import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Video, Mic, Volume2, Wifi, Shield, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/join/$roomId")({
  head: ({ params }) => ({
    meta: [
      { title: `Join Consultation · ${params.roomId} — JC Integrative Health` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: JoinRoom,
});

type Phase = "identify" | "device-check" | "waiting" | "in-visit" | "ended";

function JoinRoom() {
  const { roomId } = Route.useParams();
  const [phase, setPhase] = useState<Phase>("identify");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [consents, setConsents] = useState({ tele: false, priv: false, emerg: false });
  const [devices, setDevices] = useState({ cam: true, mic: true, spk: true, net: true });
  const [physicianReady, setPhysicianReady] = useState(false);

  useEffect(() => {
    if (phase !== "waiting") return;
    const t = setTimeout(() => setPhysicianReady(true), 4500);
    return () => clearTimeout(t);
  }, [phase]);

  const canIdentify = name.trim().length > 1 && dob.length > 0 && Object.values(consents).every(Boolean);
  const canJoin = phase === "waiting" && physicianReady && Object.values(devices).every(Boolean);

  return (
    <div className="min-h-screen bg-paper text-navy">
      <header className="border-b border-navy/8 bg-paper/90 backdrop-blur">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center gap-3">
          <div className="h-8 w-8 border border-navy/15 flex items-center justify-center font-serif text-xs text-navy bg-card">JC</div>
          <div className="min-w-0">
            <div className="font-serif text-sm text-navy leading-tight">JC Integrative Health</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-navy/45">Secure Telehealth · Room {roomId}</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-teal">
            <Lock size={11} /> Encrypted
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {(["identify", "device-check", "waiting", "in-visit"] as Phase[]).map((p, i) => {
            const active = phase === p;
            const done = ["identify", "device-check", "waiting", "in-visit"].indexOf(phase) > i;
            return (
              <div key={p} className="flex-1 flex items-center gap-2">
                <span className={`h-1 flex-1 ${active ? "bg-gold" : done ? "bg-teal" : "bg-navy/10"}`} />
              </div>
            );
          })}
        </div>

        {phase === "identify" && (
          <section>
            <div className="eyebrow text-gold mb-3">Step 01 · Confirm identity</div>
            <h1 className="font-serif text-3xl md:text-4xl text-navy mb-2">Welcome to your consultation</h1>
            <p className="text-sm text-navy/60 max-w-xl mb-8">Dr. Jason Chen has invited you to a secure video visit. Please confirm your identity and review the consents to continue.</p>

            <div className="grid gap-4 max-w-lg">
              <Field label="Full name">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last name"
                  className="w-full h-11 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" />
              </Field>
              <Field label="Date of birth">
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                  className="w-full h-11 border border-navy/15 bg-card px-3 text-sm outline-none focus:border-teal" />
              </Field>

              <div className="border border-navy/10 bg-card p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-navy/50 mb-2 font-medium">Consents</div>
                {[
                  { key: "tele", label: "I consent to receive care via telehealth." },
                  { key: "priv", label: "I acknowledge the Privacy Notice." },
                  { key: "emerg", label: "I understand telehealth is not for emergencies." },
                ].map((c) => (
                  <label key={c.key} className="flex items-start gap-3 py-1.5 cursor-pointer">
                    <input type="checkbox" checked={consents[c.key as keyof typeof consents]}
                      onChange={(e) => setConsents((p) => ({ ...p, [c.key]: e.target.checked }))}
                      className="mt-1 h-4 w-4 accent-navy" />
                    <span className="text-sm text-navy/75">{c.label}</span>
                  </label>
                ))}
              </div>

              <button disabled={!canIdentify} onClick={() => setPhase("device-check")}
                className="w-full h-12 bg-navy text-paper text-xs uppercase tracking-[0.2em] font-semibold hover:bg-academic transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Continue to device check
              </button>
              <div className="text-[11px] text-navy/45 flex items-center gap-2"><Shield size={11} /> Your information is encrypted and never shared.</div>
            </div>
          </section>
        )}

        {phase === "device-check" && (
          <section>
            <div className="eyebrow text-gold mb-3">Step 02 · Device check</div>
            <h1 className="font-serif text-3xl md:text-4xl text-navy mb-2">Let's make sure everything works</h1>
            <p className="text-sm text-navy/60 max-w-xl mb-8">We'll check your camera, microphone, speakers and connection.</p>

            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              <DeviceRow icon={<Video size={14} />} label="Camera" value="FaceTime HD Camera" ok={devices.cam} onToggle={() => setDevices((d) => ({ ...d, cam: !d.cam }))} />
              <DeviceRow icon={<Mic size={14} />} label="Microphone" value="Built-in Microphone" ok={devices.mic} onToggle={() => setDevices((d) => ({ ...d, mic: !d.mic }))} />
              <DeviceRow icon={<Volume2 size={14} />} label="Speakers" value="Internal speakers" ok={devices.spk} onToggle={() => setDevices((d) => ({ ...d, spk: !d.spk }))} />
              <DeviceRow icon={<Wifi size={14} />} label="Internet" value="Excellent · 74 Mbps" ok={devices.net} onToggle={() => setDevices((d) => ({ ...d, net: !d.net }))} />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <button onClick={() => setPhase("identify")} className="h-11 px-5 border border-navy/15 text-navy hover:border-navy/30 text-xs uppercase tracking-[0.18em]">Back</button>
              <button onClick={() => setPhase("waiting")}
                className="flex-1 h-11 bg-navy text-paper text-xs uppercase tracking-[0.2em] font-semibold hover:bg-academic transition-colors">
                Enter waiting room
              </button>
            </div>
          </section>
        )}

        {phase === "waiting" && (
          <section>
            <div className="eyebrow text-gold mb-3">Step 03 · Waiting room</div>
            <div className="bg-navy text-paper p-6 md:p-10 rounded-sm">
              <div className="aspect-video bg-academic/40 border border-paper/10 grid place-items-center rounded-sm mb-6">
                <div className="text-center">
                  <Video size={32} className="mx-auto text-paper/40" strokeWidth={1.3} />
                  <div className="mt-3 eyebrow text-paper/60 text-[10px]">Camera preview</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-widest text-paper/70">
                <span>Dr. Jason Chen</span>
                <span className="text-paper/40">·</span>
                <span>Room {roomId}</span>
                <span className="ml-auto text-gold inline-flex items-center gap-2">
                  {physicianReady ? <><CheckCircle2 size={12} /> Physician is ready</> : <><span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> Waiting for physician…</>}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
              <button onClick={() => setPhase("device-check")} className="h-11 px-5 border border-navy/15 text-navy hover:border-navy/30 text-xs uppercase tracking-[0.18em]">Re-run device check</button>
              <button disabled={!canJoin} onClick={() => { setPhase("in-visit"); toast.success("You are now in the consultation"); }}
                className="flex-1 h-11 bg-gold text-navy text-xs uppercase tracking-[0.2em] font-semibold hover:bg-terracota disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Join Consultation
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-navy/45">If you experience a medical emergency, disconnect and call 911.</p>
          </section>
        )}

        {phase === "in-visit" && (
          <section>
            <div className="eyebrow text-teal mb-3">Live · In visit</div>
            <div className="bg-navy text-paper p-6 md:p-10 rounded-sm">
              <div className="aspect-video bg-academic/40 border border-paper/10 grid place-items-center rounded-sm mb-6 relative">
                <div className="text-center">
                  <div className="h-14 w-14 rounded-full border border-paper/25 grid place-items-center mx-auto font-serif text-lg">JC</div>
                  <div className="mt-3 eyebrow text-paper/70 text-[10px]">Dr. Jason Chen</div>
                </div>
                <div className="absolute bottom-3 right-3 h-20 w-28 bg-navy/80 border border-paper/15 grid place-items-center text-[9px] uppercase tracking-widest text-paper/60">You</div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <CtlBtn label="Mute" icon={<Mic size={14} />} />
                <CtlBtn label="Camera" icon={<Video size={14} />} />
                <CtlBtn label="Chat" icon={<Volume2 size={14} />} />
                <button onClick={() => setPhase("ended")} className="h-10 px-4 bg-terracota text-paper text-[11px] uppercase tracking-widest">
                  End visit
                </button>
              </div>
            </div>
          </section>
        )}

        {phase === "ended" && (
          <section className="text-center py-10">
            <div className="eyebrow text-gold mb-3">Consultation ended</div>
            <h1 className="font-serif text-3xl text-navy mb-2">Thank you</h1>
            <p className="text-sm text-navy/60 max-w-md mx-auto mb-8">Dr. Chen will send a visit summary and any next steps to your patient portal.</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link to="/patient" className="h-11 px-5 border border-navy/15 text-navy hover:border-navy/30 text-xs uppercase tracking-[0.18em] inline-flex items-center justify-center">Open patient portal</Link>
              <Link to="/" className="h-11 px-5 bg-navy text-paper text-xs uppercase tracking-[0.2em] font-semibold hover:bg-academic inline-flex items-center justify-center">Return home</Link>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-navy/8 mt-16 py-6 px-5 text-center text-[10px] uppercase tracking-[0.2em] text-navy/40">
        © {new Date().getFullYear()} JC Integrative Health · HIPAA-conformant telehealth
      </footer>
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

function DeviceRow({ icon, label, value, ok, onToggle }: { icon: React.ReactNode; label: string; value: string; ok: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="border border-navy/10 bg-card rounded-sm p-3 flex items-center gap-3 text-left hover:border-navy/25 transition-colors">
      <div className="text-academic">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-widest text-navy/50">{label}</div>
        <div className="text-sm text-navy truncate">{value}</div>
      </div>
      {ok ? <CheckCircle2 size={15} className="text-teal shrink-0" /> : <AlertCircle size={15} className="text-terracota shrink-0" />}
    </button>
  );
}

function CtlBtn({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="h-10 px-3 border border-paper/20 text-paper/80 hover:text-paper hover:border-paper/40 text-[11px] uppercase tracking-widest inline-flex items-center gap-2">
      {icon} {label}
    </button>
  );
}
