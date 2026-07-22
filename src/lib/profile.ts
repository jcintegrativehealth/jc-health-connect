// Client hook over the profile server functions (portal Home + Profile screens).
import { useCallback, useEffect, useState } from "react";
import { getMyProfileFn, updateMyProfileFn, type Profile } from "@/lib/profile.functions";

export type { Profile };

export function displayName(p: Profile | null): string {
  if (!p) return "";
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ").trim();
  return name || (p.email ? p.email.split("@")[0] : "");
}

export function initials(p: Profile | null): string {
  if (!p) return "··";
  const parts = [p.firstName, p.lastName].filter(Boolean) as string[];
  if (parts.length) return parts.map((s) => s[0]!.toUpperCase()).join("").slice(0, 2);
  if (p.email) return p.email.slice(0, 2).toUpperCase();
  return "··";
}

export function useMyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const p = await getMyProfileFn();
      setProfile(p);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(async (patch: Parameters<typeof updateMyProfileFn>[0]["data"]) => {
    const updated = await updateMyProfileFn({ data: patch });
    setProfile(updated);
    return updated;
  }, []);

  return { profile, loading, error, reload, save };
}
