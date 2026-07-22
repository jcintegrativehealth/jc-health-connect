import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PortalPageHeader, PortalCard, BtnPrimary, Disclaim } from "./patient";
import { useMyProfile } from "@/lib/profile";
import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — Patient Portal" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "pt", label: "Portuguese" },
  { code: "zh", label: "Mandarin Chinese" },
] as const;

function ProfilePage() {
  const { profile, loading, error, save } = useMyProfile();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "es" | "pt" | "zh">("en");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setPhone(profile.phone ?? "");
    setState(profile.state ?? "");
    setPreferredLanguage((["en", "es", "pt", "zh"].includes(profile.preferredLanguage) ? profile.preferredLanguage : "en") as typeof preferredLanguage);
  }, [profile]);

  async function onSave() {
    if (saving) return;
    setSaving(true);
    try {
      await save({ firstName, lastName, phone, state, preferredLanguage });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PortalPageHeader
        eyebrow="Account"
        title="Profile"
        lede="Manage your personal information and language preference."
        actions={
          <button
            onClick={async () => { await signOut(); window.location.assign("/portal"); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-navy/15 text-navy text-xs font-semibold uppercase tracking-[0.16em] hover:bg-mist rounded-sm"
          >
            <LogOut size={13} /> Sign out
          </button>
        }
      />

      {loading ? (
        <PortalCard><div className="py-10 text-center text-sm text-navy/50">Loading your profile…</div></PortalCard>
      ) : error ? (
        <PortalCard><div className="py-10 text-center text-sm text-navy/60">{error}</div></PortalCard>
      ) : (
        <div className="max-w-2xl space-y-5">
          <PortalCard title="Personal information">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First name" value={firstName} onChange={setFirstName} />
              <Field label="Last name" value={lastName} onChange={setLastName} />
              <Field label="Email" value={profile?.email ?? ""} readOnly hint="Managed by your sign-in account" />
              <Field label="Phone" value={phone} onChange={setPhone} />
              <Field label="State" value={state} onChange={setState} />
              <label className="block">
                <span className="eyebrow text-navy/50 text-[10px] mb-1 block">Preferred language</span>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as typeof preferredLanguage)}
                  className="w-full border border-navy/15 rounded-sm p-2.5 text-sm text-navy outline-none focus:border-teal bg-card"
                >
                  {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <BtnPrimary onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save changes"}</BtnPrimary>
            </div>
          </PortalCard>

          <Disclaim>Your contact details help the clinic reach you about your care. This portal is not for emergencies — call 911 if you are experiencing one.</Disclaim>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, readOnly, hint }: { label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean; hint?: string }) {
  return (
    <label className="block">
      <span className="eyebrow text-navy/50 text-[10px] mb-1 block">{label}</span>
      <input
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={`w-full border border-navy/15 rounded-sm p-2.5 text-sm text-navy outline-none focus:border-teal ${readOnly ? "bg-mist/40 text-navy/60" : "bg-card"}`}
      />
      {hint && <span className="mt-1 block text-[11px] text-navy/45">{hint}</span>}
    </label>
  );
}
