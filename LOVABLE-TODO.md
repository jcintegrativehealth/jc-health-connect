# LOVABLE-TODO — apply the HANDOFF backend

> **APPLIED 2026-07-23.** The Lovable agent applied the full backend and
> consolidated the schema into its own migrations
> (`20260723000220_*` = all tables + RLS, `20260723000245_*` = `has_role`
> execute hardening). Auth (email/password + Google + HIBP), secrets
> (`RESEND_API_KEY`, `APP_ORIGIN=https://jc-health-connect.lovable.app`,
> `CRON_SECRET`, `CLINIC_TZ`) and the reminder pg_cron are live. The original
> `20260722100001–004` files were removed as redundant duplicates. The steps
> below are kept for reference / re-provisioning.

## 1. Apply migrations (in order)

Schema (all tables + GRANT + RLS + policies) — now in
`supabase/migrations/20260723000220_*.sql` (+ `…000245_*` hardening):
profiles, `app_role`, user_roles, `has_role()`, signup trigger, seed admin
(`jcintegrativehealth3@gmail.com`); appointments (§2.3 + `reminder_sent_at`,
sequence `A-9001…`, validation trigger); comments + contact_submissions;
messages (§2.6, patient ↔ clinic).

Then **regenerate `src/integrations/supabase/types.ts`** so the client picks up
the new tables, and run `supabase--linter`; fix any warnings it reports.

## 2. Auth configuration

- Enable **email/password** auth. Create the admin user
  `jcintegrativehealth3@gmail.com` (invite or set password) — the signup
  trigger assigns the `admin` role automatically.
- Enable **Google OAuth** via `supabase--configure_social_auth`. This is what
  powers the patient portal sign-in at `/portal` (Google + email/password →
  `/patient`). Without it, the "Continue with Google" button errors; email/
  password still works once email auth is on.
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

## Patient portal (phase 1 — already wired, just needs auth on)

The portal is live for **Home, Appointments, Messages, Profile** and needs
nothing beyond the auth + secrets above. Quick check after enabling auth:
1. `/portal` → create account / Google → lands on `/patient`.
2. `/patient/profile` → edit name/phone/language → Save persists to `profiles`.
3. Sign in as a patient, book via `/book` → the visit appears under
   `/patient/appointments` (RLS-scoped by `patient_id`).
4. `/patient/messages` → send a message → clinic gets an email; reply from
   `/admin/messages` → patient gets a "new message" email (no body) and sees
   it in the portal thread.

## Deferred (do NOT start yet)

- §9 Billing/Finance — blocked until §1–§8 are green (owner's decision, 2026-07-22).
- Other portal sections (labs, care plans, medications, documents, forms) —
  unlinked mock routes; add tables to HANDOFF §2 before wiring.
- Frontend nicety: optional name/email fields on the article comment box
  (submissions currently post as "Anonymous").
