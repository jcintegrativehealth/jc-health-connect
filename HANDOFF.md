# JC Integrative Health — Frontend ↔ Backend Handoff

**Owners:** Frontend (Lovable) · Backend (Claude Code)
**Stack:** TanStack Start · Lovable Cloud (Supabase) · React Email · Resend (or Lovable Emails)
**Goal:** zero divergence between the UI contract already shipped and the backend Claude Code will build.

---

## 1. Environment — already wired

| Piece | Path | Status |
|---|---|---|
| Supabase URL / publishable key | `.env` (`VITE_*` + server names) | ✅ present |
| Browser client | `src/integrations/supabase/client.ts` | ✅ autogen — do not edit |
| Admin (service role) client | `src/integrations/supabase/client.server.ts` | ✅ autogen |
| Auth middleware for server fns | `src/integrations/supabase/auth-middleware.ts` | ✅ |
| Bearer attacher | `src/integrations/supabase/auth-attacher.ts` registered in `src/start.ts` | ✅ |
| Server secrets | `LOVABLE_API_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` | ✅ |

**Nothing in the database yet.** `public` schema is empty. No RLS, no policies, no server functions calling the DB. All app data currently lives in `localStorage` (see §3).

---

## 2. Schema Claude Code should create

Every table below **must** ship with GRANTs + RLS + policies in the same migration. Column names below are the exact shape the frontend already reads/writes — keep them 1:1 so the swap is drop-in.

### 2.1 `profiles` (patient + admin identity)
Mirrors `auth.users`. Do **not** FK anything else directly to `auth.users`.

```
id            uuid PK  → auth.users.id
email         text
first_name    text
last_name     text
phone         text
preferred_language text default 'en'   -- 'en' | 'es' | 'pt' | 'zh'
state         text
created_at    timestamptz default now()
updated_at    timestamptz default now()
```

### 2.2 `user_roles` (RBAC — separate table, mandatory)
Follow the `<user-roles>` pattern exactly (enum `app_role` + `has_role()` security-definer). Roles: `admin`, `clinician`, `patient`.

### 2.3 `appointments` — **contract locked by `src/lib/appointmentStore.ts`**

Match these field names verbatim (snake_case in DB, camelCase in the store — pick one convention and map in the server fn):

```
id                text PK           -- format "A-9001" (frontend generates today; DB can switch to uuid + display code)
created_at        timestamptz
updated_at        timestamptz
source            text   -- 'public' | 'admin'
date              date
time              text   -- 'HH:mm' 24h
patient_id        uuid   → profiles.id (nullable for public/anonymous bookings)
patient_name      text   -- captured at booking
patient_tag       text   -- New patient | Returning patient | Follow-up | Prospective | Past patient | VIP | Cancelled
email             text
phone             text
type              text   -- visit type label
service           text
state             text
lang              text
format            text   -- 'In-person' | 'Telehealth'
duration          int    -- minutes
status            text   -- Pending | Confirmed | Checked In | In Progress | Completed | Cancelled | No Show | Rescheduled
pay               text   -- Pending | Paid | Partial | Overdue | Refunded | Waived
notes             text
meeting_link      text
follow_up_id      text   → appointments.id (nullable)
```

Allowed values are exported as `APPOINTMENT_STATUSES`, `PATIENT_TAGS`, `PAYMENT_STATUSES` from `src/lib/appointmentStore.ts` — mirror them as Postgres enums or `CHECK`-less validation triggers.

**Policies:**
- Public `INSERT` allowed via a server fn (no direct anon insert) — the `/book` form calls a `createServerFn` that inserts as service role after validating input.
- `SELECT / UPDATE` restricted to `admin` / `clinician` via `has_role()`.
- Patients read their own via `patient_id = auth.uid()`.

### 2.4 `comments` (article moderation queue — UI in `/admin/comments`)

```
id           uuid PK
article_slug text
author_name  text
author_email text
body         text
status       text   -- 'pending' | 'approved' | 'rejected'
moderator_id uuid   → profiles.id
moderated_at timestamptz
created_at   timestamptz
```

- Anon `INSERT` allowed with rate-limit at server-fn layer.
- Anon `SELECT` **only** where `status = 'approved'`.
- Admin/clinician full access via `has_role()`.

### 2.5 `contact_submissions` (from `/contact`)
`id, name, email, inquiry_type, message, created_at`. Anon `INSERT` via server fn only.

---

## 3. Where the frontend currently fakes it

| Feature | File | Storage today | Swap target |
|---|---|---|---|
| Booking + admin appointment CRUD | `src/lib/appointmentStore.ts` | `localStorage` key `jc.appointments.v1` | `createServerFn` reading/writing `appointments` |
| Comment moderation queue | `src/routes/admin.comments.tsx` | in-memory mock array | `comments` table |
| Admin auth gate | none (footer "Dev Preview" link in dev only) | — | Supabase Auth + `user_roles` |
| Patient portal data | `src/data/patient.ts` | static mocks | real tables (labs, care plans, messages — schema TBD after auth) |

Contract for the swap: **keep the exported types and function names in `appointmentStore.ts`** (`listAppointments`, `getAppointment`, `createAppointment`, `updateAppointment`, `updateAppointmentStatus`, `bookFollowUp`, hooks `useAppointments` / `useAppointment`). Replace the body only. Every route that touches appointments already imports from this module — no route changes needed.

---

## 4. Email templates — ready to plug in

All templates live in `src/lib/email-templates/` and are previewable at `/admin/emails`.

| Template file | Trigger | Recipient |
|---|---|---|
| `welcome.tsx` | Portal registration success | Patient |
| `appointment-request-received.tsx` | `/book` submission | Patient |
| `new-appointment-request-admin.tsx` | `/book` submission | **Clinic inbox** |
| `appointment-confirmed.tsx` | Admin sets status → `Confirmed` | Patient |
| `appointment-reminder.tsx` | 24h before appointment (cron / pg_cron) | Patient |
| `appointment-cancellation.tsx` | Status → `Cancelled` | Patient |
| `appointment-rescheduled.tsx` | Date/time changed on existing appointment | Patient |
| `contact-confirmation.tsx` | `/contact` submission | Sender |
| `password-reset.tsx` | Supabase Auth reset (audience prop: `patient` or `admin`) | User |

Each exports a default component with typed props. Render with `@react-email/render` inside the server fn / route, then hand off to Lovable Emails (`sendTemplateEmail`) **or** Resend (already available as connector). Recommendation: Lovable Emails — one less secret, no domain wiring, unsubscribe handled automatically.

The `new-appointment-request-admin` template is the one the user specifically wants dispatched every time `/book` succeeds.

---

## 5. Server functions to create (`src/lib/*.functions.ts`)

Keep files in `src/lib/` (NOT `src/server/` — blocked from client bundle). Load `client.server` only inside `.handler()` via `await import(...)`.

- `appointments.functions.ts` — `list`, `get`, `create` (public), `update`, `updateStatus`, `bookFollowUp`. Public `create` uses server publishable client + narrow validation; the rest use `requireSupabaseAuth` + admin role check.
- `comments.functions.ts` — `submit` (public), `listForModeration`, `approve`, `reject` (admin).
- `contact.functions.ts` — `submit` (public) + fires confirmation + admin notification emails.
- `emails.functions.ts` — internal helper that renders a template by name and sends. Called from the fns above.

**No Supabase Edge Functions.** All app logic goes through `createServerFn`. Webhooks (Resend events, pg_cron reminder trigger) go under `src/routes/api/public/*` with signature verification.

---

## 6. Auth flow to implement

- Enable Google OAuth via `supabase--configure_social_auth` (frontend already uses the Lovable broker helper pattern).
- Email/password for admin (`jcintegrativehealth3@gmail.com` is the seed admin — insert into `user_roles` with role `admin` in the same migration that creates the table).
- Patient portal routes (`/patient/*`) must move under `src/routes/_authenticated/` when auth goes live. Today they're public with mock data. When moving, the file names change from `patient.*.tsx` → `_authenticated/patient.*.tsx`.
- Admin routes (`/admin/*`) same treatment + role check in each server fn.

---

## 7. Ground rules for zero divergence

1. **Frontend never changes column names or enum values in the tables above without updating this file first.**
2. **Backend never renames the exported functions in `appointmentStore.ts`** — replaces their bodies only.
3. Email template props are the contract for `templateData` — do not rename props; add new optional ones freely.
4. New tables → append to §2 here + open a migration; do not create schema outside this doc.
5. Any RLS policy must be listed in §2 so the frontend knows what audience can read what.

---

## 8. Suggested order of work for Claude Code

1. Migration: `profiles`, `user_roles` + `has_role()`, seed admin.
2. Enable Google + email/password auth; move `/admin/*` and `/patient/*` under `_authenticated/`.
3. Migration: `appointments` + policies.
4. Replace body of `src/lib/appointmentStore.ts` functions with `createServerFn` calls.
5. Wire booking emails (`appointment-request-received` + `new-appointment-request-admin`).
6. Migration: `comments`, `contact_submissions`.
7. pg_cron → server route → send `appointment-reminder` 24h out.
8. Real patient portal data (labs, care plans) — schema to be defined in a follow-up section here.
