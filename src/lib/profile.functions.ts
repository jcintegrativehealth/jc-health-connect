// HANDOFF §2.1 — patient profile server functions (portal Profile screen).
// Read/update the caller's OWN profile row, RLS-scoped (the profiles policies
// already limit a patient to their own id).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Db = SupabaseClient<any, "public", any>;

export type Profile = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  preferredLanguage: string;
  state: string | null;
};

type ProfileRow = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  preferred_language: string | null;
  state: string | null;
};

function rowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    preferredLanguage: row.preferred_language ?? "en",
    state: row.state,
  };
}

export const getMyProfileFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as { supabase: unknown; userId: string };
    const db = ctx.supabase as Db;
    const { data, error } = await db
      .from("profiles")
      .select("id, email, first_name, last_name, phone, preferred_language, state")
      .eq("id", ctx.userId)
      .maybeSingle();
    if (error) throw new Error("Could not load your profile.");
    // The signup trigger normally creates the row; fall back to a bare shape.
    if (!data) {
      return {
        id: ctx.userId,
        email: null,
        firstName: null,
        lastName: null,
        phone: null,
        preferredLanguage: "en",
        state: null,
      } satisfies Profile;
    }
    return rowToProfile(data as ProfileRow);
  });

export const updateMyProfileFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      firstName: z.string().trim().max(120).optional(),
      lastName: z.string().trim().max(120).optional(),
      phone: z.string().trim().max(40).optional(),
      preferredLanguage: z.enum(["en", "es", "pt", "zh"]).optional(),
      state: z.string().trim().max(120).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const ctx = context as { supabase: unknown; userId: string };
    const db = ctx.supabase as Db;

    const patch: Record<string, unknown> = {};
    if (data.firstName !== undefined) patch.first_name = data.firstName || null;
    if (data.lastName !== undefined) patch.last_name = data.lastName || null;
    if (data.phone !== undefined) patch.phone = data.phone || null;
    if (data.preferredLanguage !== undefined) patch.preferred_language = data.preferredLanguage;
    if (data.state !== undefined) patch.state = data.state || null;

    // Upsert so a profile is created if the signup trigger hasn't run yet.
    const { data: row, error } = await db
      .from("profiles")
      .upsert({ id: ctx.userId, ...patch }, { onConflict: "id" })
      .select("id, email, first_name, last_name, phone, preferred_language, state")
      .single();
    if (error || !row) throw new Error("Could not save your profile.");
    return rowToProfile(row as ProfileRow);
  });
