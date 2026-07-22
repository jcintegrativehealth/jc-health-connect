// HANDOFF §5 — comments server functions.
// Public submit (rate-limited, service-role insert into the moderation queue),
// public read of approved comments, staff moderation via the RLS-scoped client.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Db = SupabaseClient<any, "public", any>;

export type CommentRecord = {
  id: string;
  articleSlug: string;
  authorName: string;
  authorEmail?: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  moderatedAt?: string;
};

type CommentRow = {
  id: string;
  article_slug: string;
  author_name: string;
  author_email: string | null;
  body: string;
  status: string;
  moderator_id: string | null;
  moderated_at: string | null;
  created_at: string;
};

function rowToComment(row: CommentRow): CommentRecord {
  return {
    id: row.id,
    articleSlug: row.article_slug,
    authorName: row.author_name,
    authorEmail: row.author_email ?? undefined,
    body: row.body,
    status: row.status as CommentRecord["status"],
    createdAt: row.created_at,
    moderatedAt: row.moderated_at ?? undefined,
  };
}

async function assertStaff(context: { supabase: unknown; userId: string }): Promise<Db> {
  const db = context.supabase as Db;
  const { data, error } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error("Could not verify permissions.");
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin") && !roles.includes("clinician")) {
    throw new Error("Forbidden: staff access required.");
  }
  return db;
}

// ---------------------------------------------------------------------------
// Public: submit a comment into the moderation queue (§2.4).
// ---------------------------------------------------------------------------
export const submitCommentFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      articleSlug: z.string().trim().min(1).max(200),
      authorName: z.string().trim().max(120).optional(),
      authorEmail: z.string().trim().email().max(320).optional().or(z.literal("").transform(() => undefined)),
      body: z.string().trim().min(2).max(4000),
    }),
  )
  .handler(async ({ data }) => {
    const { assertRateLimit, clientIp } = await import("@/lib/rate-limit.server");
    assertRateLimit(`comment:${clientIp()}`, 3, 10 * 60_000);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as Db;

    const { data: row, error } = await db
      .from("comments")
      .insert({
        article_slug: data.articleSlug,
        author_name: data.authorName || "Anonymous",
        author_email: data.authorEmail ?? null,
        body: data.body,
        status: "pending",
      })
      .select("*")
      .single();

    if (error || !row) {
      console.error("[comments] insert failed:", error);
      throw new Error("Could not submit your comment.");
    }
    return rowToComment(row as CommentRow);
  });

// ---------------------------------------------------------------------------
// Public: approved comments for an article page.
// ---------------------------------------------------------------------------
export const listApprovedCommentsFn = createServerFn({ method: "GET" })
  .validator(z.object({ articleSlug: z.string().trim().min(1).max(200) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as Db;
    const { data: rows, error } = await db
      .from("comments")
      .select("*")
      .eq("article_slug", data.articleSlug)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load comments.");
    return (rows as CommentRow[]).map(rowToComment);
  });

// ---------------------------------------------------------------------------
// Staff: moderation queue (reads/updates run RLS-scoped as the caller).
// ---------------------------------------------------------------------------
export const listCommentsForModerationFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await assertStaff(context as { supabase: unknown; userId: string });
    const { data: rows, error } = await db
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Could not load the moderation queue.");
    return (rows as CommentRow[]).map(rowToComment);
  });

export const moderateCommentFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "approved", "rejected"]),
    }),
  )
  .handler(async ({ data, context }) => {
    const ctx = context as { supabase: unknown; userId: string };
    const db = await assertStaff(ctx);
    const { data: row, error } = await db
      .from("comments")
      .update({
        status: data.status,
        moderator_id: data.status === "pending" ? null : ctx.userId,
        moderated_at: data.status === "pending" ? null : new Date().toISOString(),
      })
      .eq("id", data.id)
      .select("*")
      .single();
    if (error || !row) throw new Error("Could not update the comment.");
    return rowToComment(row as CommentRow);
  });
