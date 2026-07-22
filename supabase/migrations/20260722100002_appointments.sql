-- HANDOFF §2.3 — appointments. Contract locked by src/lib/appointmentStore.ts.
-- Column names match the doc verbatim (snake_case in DB, camelCase in the store).
-- Allowed values are enforced by a validation trigger (not enums, not CHECKs)
-- so the text columns stay 1:1 with the frontend-exported arrays.

-- "A-9001" style refs: frontend historically started at 9001.
create sequence public.appointment_ref_seq start with 9001;

create table public.appointments (
  id               text primary key default ('A-' || nextval('public.appointment_ref_seq')::text),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  source           text not null default 'public',          -- 'public' | 'admin'
  date             date not null,
  time             text not null,                           -- 'HH:mm' 24h
  patient_id       uuid references public.profiles (id) on delete set null, -- nullable: public/anonymous bookings
  patient_name     text not null,                           -- captured at booking
  patient_tag      text,
  email            text,
  phone            text,
  type             text not null,                           -- visit type label
  service          text not null default '',
  state            text not null default '',
  lang             text not null default 'English',
  format           text not null default 'Telehealth',      -- 'In-person' | 'Telehealth'
  duration         int  not null default 45,                -- minutes
  status           text not null default 'Pending',
  pay              text not null default 'Pending',
  notes            text,
  meeting_link     text,
  follow_up_id     text references public.appointments (id) on delete set null,
  reminder_sent_at timestamptz                              -- set by the 24h reminder cron (§8.7)
);

create index appointments_date_time_idx on public.appointments (date, time);
create index appointments_patient_id_idx on public.appointments (patient_id);
create index appointments_status_idx on public.appointments (status);

alter table public.appointments enable row level security;

-- No INSERT/DELETE grants for authenticated: creation goes through server
-- functions using the service role (public /book form and admin scheduling).
grant select, update on public.appointments to authenticated;
grant all on public.appointments to service_role;

create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- Mirror of APPOINTMENT_STATUSES / PATIENT_TAGS / PAYMENT_STATUSES from
-- src/lib/appointmentStore.ts — keep these lists in sync with that file.
create or replace function public.validate_appointment()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.source not in ('public', 'admin') then
    raise exception 'Invalid source: %', new.source;
  end if;

  if new.format not in ('In-person', 'Telehealth') then
    raise exception 'Invalid format: %', new.format;
  end if;

  if new.status not in (
    'Pending', 'Confirmed', 'Checked In', 'In Progress',
    'Completed', 'Cancelled', 'No Show', 'Rescheduled'
  ) then
    raise exception 'Invalid status: %', new.status;
  end if;

  if new.pay not in ('Pending', 'Paid', 'Partial', 'Overdue', 'Refunded', 'Waived') then
    raise exception 'Invalid payment status: %', new.pay;
  end if;

  if new.patient_tag is not null and new.patient_tag not in (
    'New patient', 'Returning patient', 'Follow-up',
    'Prospective', 'Past patient', 'VIP', 'Cancelled'
  ) then
    raise exception 'Invalid patient tag: %', new.patient_tag;
  end if;

  if new.time !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' then
    raise exception 'Invalid time (expected HH:mm 24h): %', new.time;
  end if;

  if new.duration < 5 or new.duration > 480 then
    raise exception 'Invalid duration: %', new.duration;
  end if;

  return new;
end;
$$;

create trigger appointments_validate
  before insert or update on public.appointments
  for each row execute function public.validate_appointment();

-- ---------------------------------------------------------------------------
-- Policies (§2.3):
--  - public INSERT only via server fn (service role) — no anon/authenticated insert policy
--  - SELECT: admin/clinician see all; patients see their own rows
--  - UPDATE: admin/clinician only
-- ---------------------------------------------------------------------------
create policy "Staff or owning patient can read"
  on public.appointments
  for select
  to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
    or patient_id = (select auth.uid())
  );

create policy "Staff can update"
  on public.appointments
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
