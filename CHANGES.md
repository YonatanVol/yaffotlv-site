# CHANGES

Running log of what changed and why. Newest first.

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
