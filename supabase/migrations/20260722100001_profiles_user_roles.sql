-- HANDOFF §2.1 + §2.2 — profiles, user_roles + has_role(), seed admin.
-- Every table ships with GRANTs + RLS + policies in this same migration (§7.4).

-- ---------------------------------------------------------------------------
-- Shared helper: keep updated_at fresh on any row update.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- §2.1 profiles — mirrors auth.users. Nothing else FKs auth.users directly.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text,
  first_name         text,
  last_name          text,
  phone              text,
  preferred_language text not null default 'en', -- 'en' | 'es' | 'pt' | 'zh'
  state              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- §2.2 user_roles — RBAC in a separate table (mandatory pattern).
-- user_id FKs profiles, not auth.users (§2.1 rule).
-- ---------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'clinician', 'patient');

create table public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Role writes happen only through the service role (server functions / triggers).
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- ---------------------------------------------------------------------------
-- Policies (single permissive policy per action to keep the linter quiet).
-- ---------------------------------------------------------------------------
create policy "Own profile or staff can read"
  on public.profiles
  for select
  to authenticated
  using (
    id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

create policy "Users insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (id = (select auth.uid()));

create policy "Own profile or admin can update"
  on public.profiles
  for update
  to authenticated
  using (
    id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
  )
  with check (
    id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
  );

create policy "Own roles or admin can read"
  on public.user_roles
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
  );

-- ---------------------------------------------------------------------------
-- Auto-provision profile + role on signup. The seed admin email gets 'admin';
-- everyone else starts as 'patient'.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'first_name',
      nullif(split_part(coalesce(new.raw_user_meta_data ->> 'full_name', ''), ' ', 1), '')
    ),
    coalesce(
      new.raw_user_meta_data ->> 'last_name',
      nullif(regexp_replace(coalesce(new.raw_user_meta_data ->> 'full_name', ''), '^\S+\s*', ''), '')
    )
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (
    new.id,
    case
      when lower(new.email) = 'jcintegrativehealth3@gmail.com' then 'admin'::public.app_role
      else 'patient'::public.app_role
    end
  )
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Seed admin (§6): if the auth user already exists, backfill profile + role.
-- If it does not exist yet, the trigger above assigns 'admin' on first signup.
-- ---------------------------------------------------------------------------
insert into public.profiles (id, email)
select id, email
from auth.users
where lower(email) = 'jcintegrativehealth3@gmail.com'
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where lower(email) = 'jcintegrativehealth3@gmail.com'
on conflict (user_id, role) do nothing;
