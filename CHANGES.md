# CHANGES

Running log of what changed and why. Newest first.

---

## Phase 3 — Admin management platform

Turned the thin `/admin` into a real control center, all behind the Phase-1 hardened auth
(verified: unauthenticated `/admin/*` 307-redirects to login). No new dependencies.

- **Unified bookings view** ([app/admin/(dashboard)/bookings/page.tsx](app/admin/(dashboard)/bookings/page.tsx))
  — one list across **direct + Airbnb + Booking.com**, source-labelled, filterable by source
  and status. New `getUnifiedBookings()` action merges direct reservations with external
  platform blocks (coalesced per `(source, externalUid)` into date ranges). Direct rows link
  to a detail page; external rows show the platform + dates + whatever summary the iCal gave.
- **Booking detail** (new `app/admin/(dashboard)/bookings/[id]/page.tsx` + `getBookingDetail()`)
  — full guest/dates/payment detail for a direct reservation, with a clearly-marked
  **disabled** "Cancel & refund (Phase 4)" slot (it needs the live provider).
- **Sync-status panel** ([calendar page](app/admin/(dashboard)/calendar/page.tsx) + `getSyncStatus()`)
  — per platform: last run time, count, and an **OK / Stale (>2h) / Failed** flag read from
  `calendar_sync_log`. Plus a working **"Sync now"** button.
- **Fixed "Sync now" properly** — extracted the pull into **`lib/calendar-sync.ts`**
  (`runCalendarSync()`), called **directly** by both the cron and the admin action. This kills
  the Phase-0 operator-precedence bug (`https://undefined`) and the fragile self-HTTP call, and
  makes the pull **per-source resilient**: a transient failure on one platform now leaves its
  last-good blocks intact instead of wiping them (old code deleted both sources first).
- **Manual range blocking** — block a single date or a **From–To range**; flows into the
  published iCal so Airbnb/Booking pick it up (`blockDateRange()`).
- **Pricing slot** left as-is for Phase 5.

### Verification performed
- `tsc --noEmit` clean; `next build` green (new `/admin/bookings/[id]` route compiles).
- Runtime: `/admin/bookings` + `/admin/bookings/[id]` 307→`/admin/login` when unauthenticated;
  `/admin/login` serves 200. (The data-rendering UI — unified table, sync panel — needs an
  authenticated session + DB to view; verify on a preview deploy with env set.)

---

## Phase 2 — Payments + two-way calendar sync

### 2A — Payments: RESEARCH ONLY this turn (no code; gated on your decisions)
- **Stripe viability for an Israeli merchant** and **choice of a local Bit provider** are
  decision gates per the brief. Findings + a recommendation are in the chat report and in
  DECISIONS (D-P2.1, D-P2.2). **No payment code was written** — building waits on your
  answer about the Stripe account and your provider approval.

### 2B — Two-way calendar sync (BUILT)
- **Published iCal feed** — new `app/api/ical/[token]/route.ts` emits a valid RFC-5545
  `VCALENDAR`. Generator added to `lib/ical.ts` (`generateICalendar`), unit-tested:
  CRLF line endings, `DTEND` exclusive (checkout day stays free), escaped text, stable UIDs.
  - Publishes **only confirmed direct reservations + manual blocks**. Never echoes
    airbnb/booking-imported dates (no sync loop) and never transient drafts/holds.
  - Manual nights are coalesced into contiguous ranges.
- **Protected + subscribable** — token lives in the URL path and is compared
  (constant-time) to the `ICAL_TOKEN` env var. Unset/wrong token → 404. URL shape:
  `https://yaffotlv.com/api/ical/<ICAL_TOKEN>.ics` — this is what you paste into Airbnb
  and Booking as an *imported* calendar.
- **Atomic double-booking guard** — new **partial unique index**
  `blocked_reservation_date_unique` on `blocked_dates(date) WHERE source='reservation'`
  (migration `0002`). `/api/bookings` now claims dates under this constraint and, on a
  unique-violation, **rolls back the just-created draft** and returns 409. This fixes the
  Phase-0 race where two direct bookings could hold the same night (the old unique index
  keyed on `externalUid`, so it never blocked that). The pre-check SELECT stays as the
  fast UX path + the guard for airbnb/booking/manual dates.
  - *Apply note:* creating this index requires no pre-existing duplicate reservation holds
    on the same date. Extremely unlikely for one low-traffic apartment, but to be verified
    at apply time (a dedupe step is included in the deploy runbook later if needed).
- **Tighter inbound pull + logging** — `vercel.json` now proposes **hourly**
  `sync-calendars` and registers the **`expire-drafts` sweeper every 15 min** (it existed
  but was never scheduled — Phase-0 issue D; also the provider-agnostic hold-release the
  payments phase needs). New `calendar_sync_log` table (migration `0002`) records per-source
  status/count/timestamp on every run → feeds the Phase-3 sync-status panel.
  - ⚠️ **Needs your Vercel plan:** Hobby allows only daily crons (and 2 max); this hourly +
    15-min schedule needs **Pro**. See DECISIONS D-P2.3.

### Residual risk — documented (brief 2B.6)
iCal is **not real-time.** A direct booking closes our own availability instantly, but
Airbnb and Booking.com only re-import our published feed on *their* schedule (≈hourly to a
few times daily). So a same-window cross-platform collision (someone books the same nights
on Airbnb in the minutes/hours before it re-reads our feed) remains **physically possible
for anyone** over iCal — it cannot be fully eliminated.
**Operational mitigation (recommended):** keep a same-day check-in buffer / treat
same-week cross-platform overlaps as needing a quick manual confirm; the Phase-3 unified
calendar + sync-status panel makes a stale sync visible so you can react.

### Migrations
- `0002_calendar_publish_and_atomic_guard.sql` — `calendar_sync_log` table + the partial
  unique index. Apply to prod only after approval (hard stop), and after `0001`.

### Verification performed
- `tsc --noEmit` clean; `next build` green (the `/api/ical/[token]` route compiles).
- iCal generator unit-tested (output shown in chat): valid VCALENDAR, CRLF, exclusive DTEND.
- End-to-end feed output (with real confirmed reservations) verifies once `DATABASE_URL` +
  `ICAL_TOKEN` are set — steps provided in the report.

---

## Phase 1 — Security hardening

Goal: make the admin and payment surfaces safe to expose publicly. No secrets were
rotated, no webhooks registered, no migrations applied to production (all gated on
explicit approval).

### Secrets — fail loudly, no insecure fallback
- **New `lib/env.ts`** centralizes all security-critical secret access. Missing values
  now **throw** instead of silently using a known default.
- Removed the hardcoded `"dev-secret-change-me-in-production"` JWT fallback from
  `lib/auth.ts` and `middleware.ts` (it was duplicated in both). Both now call
  `getJwtSecretKey()`. If `JWT_SECRET` is unset, signing/verifying fails closed
  (admin becomes inaccessible rather than protected by a publicly-known key).
- `lib/stripe.ts` now uses `getStripeSecretKey()`; the webhook uses
  `getStripeWebhookSecret()` — replacing `process.env.X!` non-null assertions.
- Cron routes (`sync-calendars`, `expire-drafts`) now require `CRON_SECRET` via
  `getCronSecret()` and compare with a **constant-time** `safeEqual()`. Previously,
  if `CRON_SECRET` was unset the auth check accepted the literal `Bearer undefined`.

### Admin login rate-limiting / lockout
- **New table `admin_login_attempts`** (migration `0001`).
- `app/api/admin/login/route.ts` now throttles per IP: **5 failed attempts within
  15 minutes → 429 locked out** for the window. Successful login clears the IP's
  failures. Error messages are generic ("Invalid credentials" / "Too many attempts")
  and never reveal whether a password was close.
- `app/admin/login/page.tsx` surfaces the server's (generic) message so a lockout
  shows correctly.

### Webhook idempotency / replay guard
- **New table `processed_webhook_events`** (migration `0001`), provider-agnostic so
  the future local Israeli payment rail reuses it.
- `app/api/webhooks/stripe/route.ts` now **claims** each `event.id` via insert +
  `onConflictDoNothing`; duplicates/replays no-op. Signature verification and raw-body
  reading (correct for Next 16) are unchanged. If processing throws, the claim is
  **released** so Stripe's automatic retry can reprocess (avoids swallowing real failures).

### Input validation (zod)
- **New `lib/validation.ts`** with zod schemas. Added `zod@4` dependency.
- Validated at every money/DB-write boundary:
  - `POST /api/bookings` — dates are real `YYYY-MM-DD`, check-out > check-in,
    **guest count 1–`MAX_GUESTS`(6)**, email shape, name/phone bounds.
  - `POST /api/price-quote` — date shape + ordering.
  - `POST /api/contact` — name/email/message bounds.
  - Admin server actions — `updatePricingRule` (numeric agorot bounds, min-nights
    1–30) and `blockDateManually` (valid date; now also `onConflictDoNothing`).

### Security headers + CSP
- **`next.config.ts`** now sends, on every route: `Content-Security-Policy`,
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and
  (production only) `Strict-Transport-Security`.
- CSP is scoped to the origins actually used: CARTO basemap tiles, Leaflet CSS from
  unpkg, the same-origin Vercel Analytics beacon. `frame-ancestors 'none'` stops the
  admin (and whole site) from being iframed. `'unsafe-eval'` and
  `upgrade-insecure-requests`/HSTS are dev/prod-gated to avoid breaking local dev.
- **Verified** in a running dev server: headers present; Leaflet map tiles + CSS load
  under CSP; no console CSP violations; home page renders normally.

### Closed an out-of-scope security hole found in Phase 0
- `app/api/bookings/[id]/cancel/route.ts` issued **real Stripe refunds with no auth**.
  It is now gated behind `getSession()` (admin-only). The full admin-initiated
  cancellation/refund UX is Phase 4; this is the minimal stop-gap. No client flow used
  this route (verified), so nothing breaks.

### Database migrations introduced
- Added a `drizzle/` migrations folder (the project previously used `db:push`).
  - `0000_baseline_existing_schema.sql` — the 4 pre-existing tables. Represents what
    production **already has**; it is a baseline, not to be re-run against prod.
  - `0001_security_rate_limit_and_webhook_idempotency.sql` — the two new tables only.
    **This is the only file that needs applying to production**, and only after
    explicit approval (a hard stop).

### Verification performed
- `tsc --noEmit` — clean.
- `next build` (production) — succeeds, all 24 routes compile, middleware included.
- Dev-server runtime check — security headers present; map/CSP OK; page renders.
- Pre-existing ESLint `set-state-in-effect` errors remain in three files I did **not**
  touch (`booking-widget.tsx`, `admin/bookings/page.tsx`, `neighborhood-map.tsx`) and
  an unused-import warning in `actions.ts` — none introduced by Phase 1.

### Residual / explicitly NOT done in Phase 1 (gated on you)
- `JWT_SECRET` not rotated (you set it — see DECISIONS D-P1.2).
- Migration `0001` not applied to any database.
- The double-booking race + `blocked_dates` uniqueness hole (Phase 0 issue B) is a
  **Phase 2B** item — not addressed here.

---

## Phase 0 — Recon & audit (read-only)

No code changed. Produced a full audit: repo-map verification, confirmation of the
nine known issues, fifteen newly-found issues (incl. the unauthenticated refund route,
the double-booking race, the neon-http no-transactions constraint), the env-var
inventory, and two corrections to the brief (six locales not three; more pre-existing
functionality than the map implied). See the chat report.
