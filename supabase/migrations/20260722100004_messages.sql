-- HANDOFF §2.6 — messages (in-platform patient ↔ clinic messaging).
-- One flat thread per patient. Writes run RLS-scoped (no service role needed);
-- policies enforce who may read/insert/mark-read. GRANT + RLS + policies here.

create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid not null references public.profiles (id) on delete cascade,
  sender_id   uuid references public.profiles (id) on delete set null,
  sender_role text not null check (sender_role in ('patient', 'staff')),
  body        text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index messages_patient_id_created_idx on public.messages (patient_id, created_at);
create index messages_unread_idx on public.messages (patient_id) where read_at is null;

alter table public.messages enable row level security;

grant select, insert, update on public.messages to authenticated;
grant all on public.messages to service_role;

-- Read: patient sees their own thread; staff see everything.
create policy "Read own thread or staff"
  on public.messages
  for select
  to authenticated
  using (
    patient_id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

-- Insert: patient writes into their own thread as 'patient'; staff write into
-- any thread as 'staff'. sender_id must be the caller in both cases.
create policy "Patient or staff sends"
  on public.messages
  for insert
  to authenticated
  with check (
    sender_id = (select auth.uid())
    and (
      (sender_role = 'patient' and patient_id = (select auth.uid()))
      or (
        sender_role = 'staff'
        and (
          public.has_role((select auth.uid()), 'admin')
          or public.has_role((select auth.uid()), 'clinician')
        )
      )
    )
  );

-- Update: used only to stamp read_at. Patient on own thread; staff on any.
create policy "Mark read own thread or staff"
  on public.messages
  for update
  to authenticated
  using (
    patient_id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  )
  with check (
    patient_id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );
