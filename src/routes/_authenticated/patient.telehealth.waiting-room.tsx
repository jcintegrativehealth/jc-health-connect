import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PortalPageHeader, PortalCard, BtnPrimary, BtnGhost, StatusPill, Disclaim } from "./patient";
import { Video, Mic, Volume2, Wifi, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/patient/telehealth/waiting-room")({
  head: () => ({ meta: [{ title: "Waiting Room — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: WaitingRoom,
});

type State = "too-early" | "ready" | "late" | "physician-ready" | "connection-issue" | "completed";

function WaitingRoom() {
  const [state, setState] = useState<State>("too-early");
  const [countdown, setCountdown] = useState(300);
  const [consents, setConsents] = useState({ tele: false, priv: false, emerg: false });
  const canJoin = state === "ready" || state === "physician-ready";
  const allConsents = Object.values(consents).every(Boolean);

  useEffect(() => {
    if (state !== "too-early") return;
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [state]);

  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");

  return (
    <div>
      <PortalPageHeader
        eyebrow="Telehealth · Waiting Room"
        title="Preparing your visit"
        lede="Follow the checks below. Your visit will begin when your physician is ready."
      />

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="space-y-5">
          {/* Video placeholder */}
          <div className="bg-navy rounded-sm p-6 sm:p-10 text-paper relative overflow-hidden">
            <div className="aspect-video bg-academic/40 rounded-sm border border-paper/10 grid place-items-center">
              <div className="text-center">
                <Video size={32} className="mx-auto text-paper/40" strokeWidth={1.3} />
                <div className="mt-3 eyebrow text-paper/60 text-[10px]">Camera preview (demo)</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-paper/70">
              <span>Dr. Jason Chen</span>
              <span className="text-paper/40">·</span>
              <span>Follow-up · 30 min · English</span>
              <span className="ml-auto text-gold">
                {state === "too-early" && `Opens in ${mm}:${ss}`}
                {state === "ready" && "Ready to join"}
                {state === "late" && "Physician running late"}
                {state === "physician-ready" && "Physician is ready"}
                {state === "connection-issue" && "Connection issue"}
                {state === "completed" && "Visit completed"}
              </span>
            </div>
          </div>

          <PortalCard title="Device check">
            <div className="grid sm:grid-cols-2 gap-3">
              <DeviceRow icon={<Video size={14} />} label="Camera" value="FaceTime HD Camera" ok />
              <DeviceRow icon={<Mic size={14} />} label="Microphone" value="MacBook Pro Microphone" ok />
              <DeviceRow icon={<Volume2 size={14} />} label="Speakers" value="Internal speakers" ok />
              <DeviceRow icon={<Wifi size={14} />} label="Internet" value="Excellent · 82 Mbps" ok />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <BtnGhost onClick={() => toast.success("Camera test complete (demo)")}>Test Camera</BtnGhost>
              <BtnGhost onClick={() => toast.success("Microphone test complete (demo)")}>Test Microphone</BtnGhost>
            </div>
          </PortalCard>

          <PortalCard title="Pre-visit checklist">
            <ul className="space-y-2 text-sm text-navy/75">
              {["Quiet and private environment", "Identification available", "Medication list available", "Recent labs available", "Questions prepared", "Camera and microphone working"].map((c) => (
                <li key={c} className="flex items-center gap-2"><CheckCircle2 size={13} className="text-teal" /> {c}</li>
              ))}
            </ul>
          </PortalCard>

          <PortalCard title="Consents required">
            {[
              { key: "tele", label: "I consent to receive care via telehealth." },
              { key: "priv", label: "I acknowledge the Privacy Notice." },
              { key: "emerg", label: "I understand telehealth is not for emergencies." },
            ].map((c) => (
              <label key={c.key} className="flex items-start gap-3 py-2 cursor-pointer">
                <input type="checkbox" checked={consents[c.key as keyof typeof consents]} onChange={(e) => setConsents((p) => ({ ...p, [c.key]: e.target.checked }))} className="mt-1 h-4 w-4 accent-navy" />
                <span className="text-sm text-navy/75">{c.label}</span>
              </label>
            ))}
          </PortalCard>

          <Disclaim>If you are experiencing a medical emergency, disconnect immediately and call 911.</Disclaim>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit space-y-3">
          <PortalCard title="Status" meta="Live">
            <div className="flex items-center gap-2 mb-3">
              {state === "connection-issue" ? <AlertCircle size={14} className="text-destructive" /> : <Shield size={14} className="text-teal" />}
              <StatusPill tone={canJoin ? "success" : state === "connection-issue" ? "danger" : "warn"}>
                {state === "too-early" ? "Too early to join" : state === "ready" ? "Ready" : state === "late" ? "Physician late" : state === "physician-ready" ? "Physician ready" : state === "connection-issue" ? "Connection issue" : "Completed"}
              </StatusPill>
            </div>
            <BtnPrimary className="w-full" disabled={!canJoin || !allConsents} onClick={() => { setState("physician-ready"); toast.success("Joining visit (demo)"); }}>
              Join Visit
            </BtnPrimary>
            {!allConsents && <p className="mt-2 text-[11px] text-navy/50">Please accept all consents to enable Join Visit.</p>}
            {state === "too-early" && <p className="mt-2 text-[11px] font-mono uppercase tracking-widest text-navy/50">Opens in {mm}:{ss}</p>}
          </PortalCard>

          <PortalCard title="Simulate states" meta="Demo controls">
            <div className="flex flex-wrap gap-2">
              {(["too-early", "ready", "late", "physician-ready", "connection-issue", "completed"] as State[]).map((s) => (
                <button key={s} onClick={() => setState(s)} className="text-[10px] font-mono uppercase tracking-widest border border-navy/15 rounded-sm px-2 py-1 hover:bg-mist text-navy/70">{s}</button>
              ))}
            </div>
          </PortalCard>

          {state === "completed" && (
            <PortalCard title="Visit completed">
              <p className="text-sm text-navy/70 mb-3">Thank you for meeting with Dr. Chen today.</p>
              <div className="grid gap-2">
                <Link to="/patient/care-plan"><BtnGhost className="w-full">View care plan</BtnGhost></Link>
                <Link to="/patient/documents"><BtnGhost className="w-full">Visit summary</BtnGhost></Link>
                <Link to="/patient/messages"><BtnGhost className="w-full">Send a message</BtnGhost></Link>
                <Link to="/patient/billing"><BtnGhost className="w-full">View invoice</BtnGhost></Link>
              </div>
            </PortalCard>
          )}
        </aside>
      </div>
    </div>
  );
}

function DeviceRow({ icon, label, value, ok }: { icon: React.ReactNode; label: string; value: string; ok?: boolean }) {
  return (
    <div className="border border-navy/8 rounded-sm p-3 flex items-center gap-3">
      <div className="text-academic">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="eyebrow text-navy/50 text-[10px]">{label}</div>
        <div className="text-sm text-navy truncate">{value}</div>
      </div>
      {ok && <CheckCircle2 size={14} className="text-teal shrink-0" />}
    </div>
  );
}
