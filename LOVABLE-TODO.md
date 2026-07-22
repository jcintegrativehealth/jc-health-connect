# LOVABLE-TODO — apply the HANDOFF backend

Claude Code wrote everything below into the repo; these are the steps only the
Lovable agent (with Lovable Cloud tools) can run. Work top to bottom. Do not
change schema, policy audiences, or `src/lib/appointmentStore.ts` exports —
HANDOFF.md §2/§7 is the contract.

## 1. Apply migrations (in order)

`supabase/migrations/`:

1. `20260722100001_profiles_user_roles.sql` — profiles, app_role enum, user_roles,
   `has_role()`, signup trigger, seed admin (`jcintegrativehealth3@gmail.com`).
2. `20260722100002_appointments.sql` — appointments (§2.3 exact columns +
   `reminder_sent_at`), sequence `A-9001…`, validation trigger, RLS.
3. `20260722100003_comments_contact.sql` — comments + contact_submissions, RLS.

Then **regenerate `src/integrations/supabase/types.ts`** so the client picks up
the new tables, and run `supabase--linter`; fix any warnings it reports.

## 2. Auth configuration

- Enable **email/password** auth. Create the admin user
  `jcintegrativehealth3@gmail.com` (invite or set password) — the signup
  trigger assigns the `admin` role automatically.
- Enable **Google OAuth** via `supabase--configure_social_auth`
  (patient portal sign-in; the helper `signInWithGoogle` in `src/lib/auth.ts`
  is ready).
- Enable **HIBP (leaked password protection)** in Auth settings.
- Do **not** enable auto-confirm without asking the owner first.

## 3. Email delivery secrets

`src/lib/emails.functions.ts` sends through Resend's REST API and degrades to a
console warning when unset (bookings never fail because of email).

- Set `RESEND_API_KEY` (Resend connector).
- Optional: `EMAIL_FROM` — defaults to `JC Integrative Health <onboarding@resend.dev>`
  until the clinic domain is verified in Resend.
- Optional: `ADMIN_NOTIFY_EMAILS` — defaults to
  `drjason@jcintegrativehealth.com,jcintegrativehealth3@gmail.com`.
- Set `APP_ORIGIN` to the deployed site origin (used for "Review in Admin"
  links in notification emails).

If you prefer Lovable Emails over Resend, swap only the body of
`sendRawEmail()` in `src/lib/emails.functions.ts` — every caller goes through it.

## 4. Reminder cron (§8.7)

The endpoint is `POST /api/public/cron/appointment-reminders`, guarded by a
shared secret. It reminds Confirmed visits 23–25h out and stamps
`reminder_sent_at` (idempotent).

- Set secrets: `CRON_SECRET` (random string) and optionally `CLINIC_TZ`
  (defaults to `America/Denver`).
- Enable `pg_cron` + `pg_net`, then schedule (replace URL + secret):

```sql
select cron.schedule(
  'appointment-reminders',
  '*/30 * * * *',
  $$
  select net.http_post(
    url     := 'https://<DEPLOYED-ORIGIN>/api/public/cron/appointment-reminders',
    headers := jsonb_build_object('x-cron-secret', '<CRON_SECRET>')
  );
  $$
);
```

## 5. Smoke test after applying

1. `/book` → submit → row appears in `/admin/appointments`; patient +
   clinic emails fire (once RESEND_API_KEY is set).
2. `/admin/login` with the admin user → console loads; non-staff users are
   redirected out of `/admin/*`.
3. `/admin/appointments/<id>` → change status to Confirmed → patient email.
4. Article page → submit comment → appears in `/admin/comments` (Pending) →
   Approve → shows publicly on the article.
5. `/contact` → submit → row in `contact_submissions`, confirmation + clinic
   notification emails.

## Deferred (do NOT start yet)

- §9 Billing/Finance — blocked until §1–§8 are green (owner's decision, 2026-07-22).
- Patient portal real data (§8.8) — schema must be added to HANDOFF §2 first.
- Frontend nicety: optional name/email fields on the article comment box
  (submissions currently post as "Anonymous").
