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

---

## 9. Billing & Finance (deferred module — do NOT block §1–§8)

This module is **out of scope for the initial launch** described in §8. It is documented here so any parallel work stays aligned with the same contract. Claude Code should only start §9 after §1–§7 are shipped and the primary clinical flow is live.

### 9.1 Scope

The clinic charges for:
- **Consultations** (one-off, per appointment) — Telehealth Consult, Follow-up, Extended Intake.
- **Care Plans / Memberships** — monthly or quarterly recurring.
- **Lab panels & add-ons** — one-off line items attached to an appointment.

Cash pay only in v1. **No insurance claim submission**, no CPT/ICD coding pipeline. Receipts are patient-facing PDFs; superbills for insurance reimbursement are a v2 concern.

### 9.2 Provider

**Stripe (seamless, Lovable-managed)** — enable via `payments--enable_stripe_payments`. Digital/professional services in a supported seller country → default to Stripe **managed_payments** (full compliance handling) with tax codes on every product. Do NOT enable Paddle (physical exclusions do not apply, but Stripe fits professional healthcare services better and supports recurring memberships cleanly). Do NOT wire the legacy BYOK `enable_stripe` path.

### 9.3 Tables (public schema — all require GRANTs + RLS per house rules)

Order of creation matters (FKs):

1. **`billing_products`** — catalog of purchasable items.
   - `id uuid pk`, `slug text unique`, `name text`, `description text`, `kind text check in ('consult','membership','lab','addon')`, `unit_amount_cents int`, `currency text default 'usd'`, `stripe_product_id text`, `stripe_price_id text`, `interval text null` (`month` | `quarter` | null for one-off), `tax_code text` (Stripe tax code), `active bool default true`, timestamps.
   - RLS: `SELECT` for `authenticated` where `active = true`; full CRUD for `admin` role only.

2. **`billing_customers`** — 1:1 with `auth.users` mirror of Stripe customer.
   - `user_id uuid pk references auth.users`, `stripe_customer_id text unique`, `default_payment_method text`, timestamps.
   - RLS: user reads own row; `admin` reads all; writes only via server functions using `supabaseAdmin`.

3. **`billing_invoices`** — one row per Stripe invoice (both one-off Checkout and subscription cycles).
   - `id uuid pk`, `user_id uuid references auth.users`, `stripe_invoice_id text unique`, `stripe_checkout_session_id text null`, `appointment_id uuid null references appointments`, `subscription_id uuid null references billing_subscriptions`, `status text check in ('draft','open','paid','void','uncollectible','refunded')`, `amount_subtotal_cents int`, `amount_tax_cents int`, `amount_total_cents int`, `currency text`, `hosted_invoice_url text`, `pdf_url text`, `issued_at timestamptz`, `paid_at timestamptz null`, timestamps.
   - RLS: user reads own; `admin` reads all; writes via webhook (`supabaseAdmin`).

4. **`billing_invoice_items`** — line items (denormalized snapshot; do not FK to `billing_products` because product prices can change).
   - `id uuid pk`, `invoice_id uuid references billing_invoices on delete cascade`, `product_slug text`, `description text`, `quantity int default 1`, `unit_amount_cents int`, `amount_cents int`, `tax_code text`.
   - RLS: inherit through invoice (policy: readable if parent invoice is readable).

5. **`billing_subscriptions`** — membership state mirror.
   - `id uuid pk`, `user_id uuid references auth.users`, `stripe_subscription_id text unique`, `product_slug text`, `status text check in ('trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid','paused')`, `current_period_start timestamptz`, `current_period_end timestamptz`, `cancel_at_period_end bool default false`, `canceled_at timestamptz null`, timestamps.
   - RLS: user reads own; `admin` reads all; writes via webhook.

6. **`billing_refunds`** — audit trail for refunds issued from admin.
   - `id uuid pk`, `invoice_id uuid references billing_invoices`, `stripe_refund_id text unique`, `amount_cents int`, `reason text`, `issued_by uuid references auth.users` (admin), `created_at`.
   - RLS: user reads own (through invoice); `admin` full CRUD.

**Cross-cutting:** every `CREATE TABLE` followed by `GRANT SELECT[, INSERT/UPDATE/DELETE where policy allows] TO authenticated; GRANT ALL TO service_role;`. No `anon` grants — billing is authenticated-only.

### 9.4 Server functions (create in `src/lib/billing.functions.ts`)

- `createCheckoutSession({ productSlug, appointmentId? })` — `requireSupabaseAuth`; creates or reuses `billing_customers.stripe_customer_id`; opens Stripe Checkout in `payment` or `subscription` mode based on product `interval`; returns `{ url }`. Uses `managed_payments: { enabled: true }` on the session.
- `createBillingPortalSession()` — `requireSupabaseAuth`; returns Stripe Customer Portal URL for the current user (manage payment method, cancel subscription, download invoices).
- `listMyInvoices()` — `requireSupabaseAuth`; reads `billing_invoices` scoped to `auth.uid()`.
- `listMySubscriptions()` — same shape.
- `adminIssueRefund({ invoiceId, amountCents, reason })` — `requireSupabaseAuth` + `has_role('admin')` check on `context.supabase`; only then imports `supabaseAdmin` for the Stripe call and audit insert.

**Do NOT** put any `stripe.*` secret access in a server function that isn't gated on an admin role check or on the caller's own `user_id`.

### 9.5 Webhook

Public route: `src/routes/api/public/webhooks/stripe.ts`. Verify signature with `STRIPE_WEBHOOK_SECRET` before any DB write. Handle:
- `checkout.session.completed` → upsert `billing_customers`, insert `billing_invoices` + items, link to `appointment_id` from `metadata`, mark appointment `paid = true`.
- `invoice.paid` / `invoice.payment_failed` → update `billing_invoices.status`.
- `customer.subscription.{created,updated,deleted}` → upsert `billing_subscriptions`.
- `charge.refunded` → insert `billing_refunds`, update invoice status.

Idempotency: use `stripe_invoice_id` / `stripe_subscription_id` unique constraints; upsert on conflict.

### 9.6 Frontend contract (already scaffolded / to scaffold — frontend responsibility)

Frontend will expose these surfaces; Claude Code fills the server side without renaming:
- `/patient/billing` — invoice history table + "Manage payment methods" button (opens `createBillingPortalSession`).
- `/patient/billing/plans` — subscription state + upgrade/cancel via portal.
- **Booking flow** — after appointment request is created, if the selected service has a `billing_products.slug`, redirect to `createCheckoutSession` before showing confirmation.
- `/admin/billing` — invoice list, subscription list, refund action.
- Email templates to add later: `receipt`, `payment-failed`, `subscription-canceled`. Not in v1 email set.

### 9.7 Emails triggered from billing (v2)

Add to `src/lib/email-templates/` when this module ships:
- `receipt.tsx` — sent on `invoice.paid`.
- `payment-failed.tsx` — sent on `invoice.payment_failed`.
- `subscription-canceled.tsx` — sent on `customer.subscription.deleted`.

Same layout wrapper, same `LOGO_URL`, same palette tokens as existing templates. Preview page `/admin/emails` must be extended with these three entries.

### 9.8 Ground rules specific to billing

1. **Never store card data.** Everything sensitive stays on Stripe; we mirror only IDs, statuses, and display amounts.
2. **Prices are snapshots.** `billing_invoice_items` copy the price at purchase time; do not join back to `billing_products` for historical display.
3. **Admin authorization for refunds must query `user_roles` via `context.supabase` (RLS-scoped) before touching `supabaseAdmin`.** Never authorize by reading roles through the admin client — that's the escalation pattern the house rules forbid.
4. **Tax codes are per product** and required when Stripe managed_payments is on. Look each product up in the Stripe tax code catalog; no single fallback.
5. **Do not enable billing until §1–§7 are green.** Booking + email flow is the launch blocker; billing is post-launch revenue enablement.

### 9.9 Suggested order (after §8 is done)

1. `payments--enable_stripe_payments` (Lovable agent runs this — Claude Code cannot).
2. Create Stripe products via `batch_create_product` with tax codes.
3. Migration for §9.3 tables + RLS + grants, in one file.
4. `billing.functions.ts` + Stripe webhook route.
5. Wire `/patient/billing`, `/admin/billing` to real data (frontend replaces mocks).
6. Add v2 email templates + preview entries.
7. End-to-end test: book → pay → receipt → refund → subscription cancel.
