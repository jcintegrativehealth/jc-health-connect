-- HANDOFF §2.1 + §2.2 — profiles, user_roles + has_role(), seed admin.
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

create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  email              text,
  first_name         text,
  last_name          text,
  phone              text,
  preferred_language text not null default 'en',
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

create type public.app_role as enum ('admin', 'clinician', 'patient');

create table public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;
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

create policy "Own profile or staff can read"
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));

create policy "Own profile or admin can update"
  on public.profiles for update to authenticated
  using (
    id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
  )
  with check (
    id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
  );

create policy "Own roles or admin can read"
  on public.user_roles for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
  );

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

insert into public.profiles (id, email)
select id, email from auth.users
where lower(email) = 'jcintegrativehealth3@gmail.com'
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role from auth.users
where lower(email) = 'jcintegrativehealth3@gmail.com'
on conflict (user_id, role) do nothing;

-- ===========================================================================
-- HANDOFF §2.3 — appointments
-- ===========================================================================
create sequence public.appointment_ref_seq start with 9001;

create table public.appointments (
  id               text primary key default ('A-' || nextval('public.appointment_ref_seq')::text),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  source           text not null default 'public',
  date             date not null,
  time             text not null,
  patient_id       uuid references public.profiles (id) on delete set null,
  patient_name     text not null,
  patient_tag      text,
  email            text,
  phone            text,
  type             text not null,
  service          text not null default '',
  state            text not null default '',
  lang             text not null default 'English',
  format           text not null default 'Telehealth',
  duration         int  not null default 45,
  status           text not null default 'Pending',
  pay              text not null default 'Pending',
  notes            text,
  meeting_link     text,
  follow_up_id     text references public.appointments (id) on delete set null,
  reminder_sent_at timestamptz
);

create index appointments_date_time_idx on public.appointments (date, time);
create index appointments_patient_id_idx on public.appointments (patient_id);
create index appointments_status_idx on public.appointments (status);

alter table public.appointments enable row level security;
grant select, update on public.appointments to authenticated;
grant all on public.appointments to service_role;
grant usage, select on sequence public.appointment_ref_seq to service_role;

create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

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

create policy "Staff or owning patient can read"
  on public.appointments for select to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
    or patient_id = (select auth.uid())
  );

create policy "Staff can update"
  on public.appointments for update to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  )
  with check (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

-- ===========================================================================
-- HANDOFF §2.4 + §2.5 — comments, contact_submissions
-- ===========================================================================
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
grant select on public.comments to anon, authenticated;
grant update, delete on public.comments to authenticated;
grant all on public.comments to service_role;

create policy "Approved are public, staff see all"
  on public.comments for select to anon, authenticated
  using (
    status = 'approved'
    or public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

create policy "Staff can moderate"
  on public.comments for update to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  )
  with check (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

create policy "Staff can delete"
  on public.comments for delete to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

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
  on public.contact_submissions for select to authenticated
  using (
    public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

-- ===========================================================================
-- HANDOFF §2.6 — messages
-- ===========================================================================
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

create policy "Read own thread or staff"
  on public.messages for select to authenticated
  using (
    patient_id = (select auth.uid())
    or public.has_role((select auth.uid()), 'admin')
    or public.has_role((select auth.uid()), 'clinician')
  );

create policy "Patient or staff sends"
  on public.messages for insert to authenticated
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

create policy "Mark read own thread or staff"
  on public.messages for update to authenticated
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