// Server-only helper: verify the caller's Supabase bearer token and return
// their user id IF they hold a staff role (admin/clinician). Used by the public
// appointment-create endpoint to (a) skip anonymous rate limiting for staff and
// (b) authorize the `source: 'admin'` flag.
//
// Roles are read through an RLS-scoped client built from the caller's own token
// — never through the service-role admin client (that would be the privilege-
// escalation pattern the house rules forbid). Load only via `await import()`.
import type { SupabaseClient } from "@supabase/supabase-js";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

export async function getRequestStaffUserId(): Promise<string | null> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const authHeader = getRequest()?.headers?.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.slice("Bearer ".length).trim();
    if (token.split(".").length !== 3) return null;

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;

    const { createClient } = await import("@supabase/supabase-js");
    const opaque = isNewSupabaseApiKey(SUPABASE_PUBLISHABLE_KEY);

    // Mirror the autogen auth-middleware fetch so opaque publishable keys are
    // sent as the `apikey` header, not a bearer.
    const fetchImpl: typeof fetch = (input, init) => {
      const headers = new Headers(
        typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
      );
      if (init?.headers) {
        new Headers(init.headers).forEach((value, key) => headers.set(key, value));
      }
      if (opaque && headers.get("Authorization") === `Bearer ${SUPABASE_PUBLISHABLE_KEY}`) {
        headers.delete("Authorization");
      }
      headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
      return fetch(input, { ...init, headers });
    };

    const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { fetch: fetchImpl, headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    }) as SupabaseClient<any, "public", any>;

    const { data, error } = await client.auth.getClaims(token);
    const uid = data?.claims?.sub as string | undefined;
    if (error || !uid) return null;

    const { data: roles } = await client.from("user_roles").select("role").eq("user_id", uid);
    const isStaff = (roles ?? []).some(
      (r: { role: string }) => r.role === "admin" || r.role === "clinician",
    );
    return isStaff ? uid : null;
  } catch {
    return null;
  }
}
