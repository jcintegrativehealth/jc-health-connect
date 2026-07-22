-- HANDOFF §2.4 + §2.5 — comments (article moderation queue) and
-- contact_submissions. GRANTs + RLS + policies in the same migration (§7.4).

-- ---------------------------------------------------------------------------
-- §2.4 comments — moderation UI lives at /admin/comments.
-- ---------------------------------------------------------------------------
create table public.comments (
  id           uuid primary key default gen_random_uuid(),
  article_slug text not null,
  author_name  text not null default 'Anonymous',
  author_email text,
  body         text not null,
  status       text not null default 'pending'
               check (status in ('pending', 'approved', 'rejected')),
  moderator_id uuid references public.profiles (id) on delete set null,
  moderated_at timestamptz,
  created_at   timestamptz not null default now()
);

create index comments_article_slug_idx on public.comments (article_slug);
create index comments_status_idx on public.comments (status);

alter table public.comments enable row level security;

-- Anon INSERT happens only through the server fn (service role) with a
-- rate limit at the fn layer — no direct anon insert grant.
grant select on public.comments to anon, authenticated;
grant update, delete on public.comments to authenticated;
grant all on public.comments to service_role;

-- Anyone sees approved comments; staff see everything.
-- (has_role(null, ...) is false, so anon only ever matches status = 'approved'.)
create policy "Approved are public, staff see all"
  on public.comments
  for select
  to anon, authenticated
  using (
    status = 'approved'
    or public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

create policy "Staff can moderate"
  on public.comments
  for update
  to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  )
  with check (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

create policy "Staff can delete"
  on public.comments
  for delete
  to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

-- ---------------------------------------------------------------------------
-- §2.5 contact_submissions — from /contact. Anon INSERT via server fn only.
-- ---------------------------------------------------------------------------
create table public.contact_submissions (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  inquiry_type text,
  message      text not null,
  created_at   timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

grant select on public.contact_submissions to authenticated;
grant all on public.contact_submissions to service_role;

create policy "Staff can read submissions"
  on public.contact_submissions
  for select
  to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );
