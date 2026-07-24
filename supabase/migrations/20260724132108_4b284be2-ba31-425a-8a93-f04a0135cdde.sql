
-- Move has_role() out of the exposed public schema so signed-in users cannot
-- invoke it through the Data API, while keeping RLS policies functional.

create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
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

revoke execute on function private.has_role(uuid, public.app_role) from public, anon;
grant execute on function private.has_role(uuid, public.app_role) to authenticated, service_role;

-- Drop dependent policies + the public helper in one shot.
drop function if exists public.has_role(uuid, public.app_role) cascade;

-- Recreate every policy that used public.has_role, now pointing at private.has_role.

-- profiles
create policy "Own profile or staff can read"
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  );

create policy "Own profile or admin can update"
  on public.profiles for update to authenticated
  using (
    id = (select auth.uid())
    or private.has_role((select auth.uid()), 'admin')
  )
  with check (
    id = (select auth.uid())
    or private.has_role((select auth.uid()), 'admin')
  );

-- user_roles
create policy "Own roles or admin can read"
  on public.user_roles for select to authenticated
  using (
    user_id = (select auth.uid())
    or private.has_role((select auth.uid()), 'admin')
  );

-- appointments
create policy "Staff or owning patient can read"
  on public.appointments for select to authenticated
  using (
    private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
    or patient_id = (select auth.uid())
  );

create policy "Staff can update"
  on public.appointments for update to authenticated
  using (
    private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  )
  with check (
    private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  );

-- comments
create policy "Approved are public, staff see all"
  on public.comments for select to anon, authenticated
  using (
    status = 'approved'
    or private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  );

create policy "Staff can moderate"
  on public.comments for update to authenticated
  using (
    private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  )
  with check (
    private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  );

create policy "Staff can delete"
  on public.comments for delete to authenticated
  using (
    private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  );

-- contact_submissions
create policy "Staff can read submissions"
  on public.contact_submissions for select to authenticated
  using (
    private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  );

-- messages
create policy "Read own thread or staff"
  on public.messages for select to authenticated
  using (
    patient_id = (select auth.uid())
    or private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
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
          private.has_role((select auth.uid()), 'admin')
          or private.has_role((select auth.uid()), 'clinician')
        )
      )
    )
  );

create policy "Mark read own thread or staff"
  on public.messages for update to authenticated
  using (
    patient_id = (select auth.uid())
    or private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  )
  with check (
    patient_id = (select auth.uid())
    or private.has_role((select auth.uid()), 'admin')
    or private.has_role((select auth.uid()), 'clinician')
  );
