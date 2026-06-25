# DECISIONS

Every choice that needed a judgement call, what was decided, and why. Items marked
**⏳ NEEDS YOU** are waiting on an explicit answer from Yonatan.

---

## Phase 1

### D-P1.1 — Rate-limit store: Neon table (not KV)
**Decided:** store login attempts in a new Neon table `admin_login_attempts`.
**Why:** zero new dependencies/integrations — Postgres is already wired. Vercel KV /
Upstash would add an account, env vars, and a new SDK for a very low-volume need
(one admin). A table is trivially queryable for the Phase 3 admin view too.

### D-P1.2 — JWT_SECRET rotation ⏳ NEEDS YOU
**Decided:** I will **not** generate or print a production secret into this chat
(it would land in logs/history). Instead you run, locally:
```
# generate a strong value AND set it in one step, without it being printed by me:
vercel env add JWT_SECRET production
# when prompted, paste the output of:  openssl rand -base64 48
```
**Warning:** rotating `JWT_SECRET` invalidates all existing admin sessions — you'll be
logged out of `/admin` and must sign in again. Also set it for `preview` and
`development` if you use those environments.
**Status:** awaiting your go / confirmation it's set.

### D-P1.3 — Validation library: zod v4
**Decided:** added `zod@4`. **Why:** explicitly sanctioned by the brief (Phase 1.6),
lightweight, and the standard choice. Used regex for email (not `.email()`) to stay
agnostic to the zod v3/v4 method change.

### D-P1.4 — MAX_GUESTS = 8 ✅ RESOLVED
**Owner answer (2026-06-25):** the apartment sleeps up to **8** (2 bedrooms + living room).
`MAX_GUESTS = 8` and the booking `<select>` now offers 1–8.

### D-P1.5 — Migration baseline strategy
**Decided:** introduced `drizzle/` with `0000` = a baseline of the **existing** schema
and `0001` = only the two new tables. **Why:** the project was built with `db:push`, so
production already has the base tables; re-running a full create would fail. At deploy
time we apply **only `0001`** to prod (the baseline represents already-present state).
Full reconciliation steps will go in the Phase 6 deploy runbook. No migration has been
run against any DB yet (hard stop).

### D-P1.6 — Locked the public refund route to admin now
**Decided:** added an admin-session check to `POST /api/bookings/[id]/cancel` in Phase 1
rather than waiting for Phase 4. **Why:** it issued real Stripe refunds to anyone with a
reservation UUID — a live money-movement hole, squarely a security concern. The proper
admin-initiated cancel/refund UX (partial refunds, policy, emails, iCal reopen) remains
Phase 4. Verified no client flow calls this route, so gating it breaks nothing.

---

## Phase 2

### D-P2.1 — Stripe viability for an Israeli merchant ✅ RESOLVED
**Research finding:** Stripe is **not** in its list of fully-supported merchant countries
for Israel; an Israeli-resident merchant generally needs the US-entity workaround for live
Stripe.
**Owner answer (2026-06-24):** **No Stripe account yet.** → Decision: **do not use Stripe.**
A single local provider becomes the primary (and only) rail. The existing Stripe code is
shelved (left in place, not wired in) and may be removed later.

### D-P2.2 — Payment provider: **PayPlus** (primary, single rail) ✅ APPROVED
**Owner answer (2026-06-24):** **PayPlus approved.** It handles **cards + Apple Pay +
Google Pay + Bit** in one rail, so it replaces Stripe entirely. Integration goes behind the
**same** booking pipeline (draft + 30-min hold + atomic date-block from Phase 1/2B), with
confirmation driven by PayPlus's IPN callback under the **same signature + idempotency
guards** as the Phase-1 Stripe webhook (reuses `processed_webhook_events`).
**Blocker:** no PayPlus account yet → no sandbox credentials → the integration cannot be
built-and-verified until onboarding is underway. Onboarding is the critical path (owner
action). I will not ship spec-guessed money-path code; I build + verify against sandbox.

### D-P2.3 — Cron frequency ✅ RESOLVED (Vercel Pro)
**Owner answer (2026-06-24):** **Pro.** → Keep `vercel.json` as set: **hourly**
`sync-calendars` + **15-min** `expire-drafts` sweeper. No fallback needed.

### D-P2.4 — Publish token: env var `ICAL_TOKEN` ⏳ NEEDS YOU (later)
The feed is gated by an unguessable token in the URL, read from `ICAL_TOKEN`. Like the JWT
secret, **you set it** (I won't print one): `vercel env add ICAL_TOKEN production`, paste
`openssl rand -hex 24`. Until set, the endpoint returns 404 (feature disabled).

### D-P2.5 — Atomic guard via partial unique index (decided)
**Decided:** enforce one-direct-reservation-per-date with a **partial unique index**
(`WHERE source='reservation'`) + insert-with-rollback, rather than an interactive
transaction. **Why:** the project uses the **neon-http** driver, which has no interactive
transactions / `SELECT … FOR UPDATE`. A partial unique index gives a true atomic guarantee
at the DB level and still lets airbnb/booking/manual blocks coexist on the same date.

---

## Phase 6

### D-P6.1 — Host photo: neutral placeholder for now ⏳ NEEDS YOU (image)
No photo was supplied, so the emoji is replaced with a tasteful silhouette + a
`TODO(host-photo)`. Drop a square photo at `public/images/host.jpg` (≥400×400) and it gets
swapped in.

### D-P6.2 — No hreflang (single-URL i18n) — decided
The site serves all languages from one URL via a client-side toggle (no `/en` `/he` routes),
so per-locale hreflang URLs don't apply. Added a self `canonical` instead and rely on the
client-set `<html lang>`/`dir`. Real hreflang would require restructuring to per-locale
routes — a larger change we can do later if SEO in he/ar becomes a priority.

### D-P6.3 — Social proof: removed the fabricated line (not a fake endpoint) — decided
"3 guests booked this week" was invented urgency. With no real booking data yet (payments
aren't live), a data endpoint would just return 0. So the honest move now is removal; the
remaining items (rating, discount, Superhost) are standing facts. We can add a real
recent-bookings count once PayPlus is live and bookings flow.

### D-P6.4 — Google Business Profile URL ✅ RESOLVED
Owner provided https://maps.app.goo.gl/MG8Hppe3vibuFLJb8 — footer link enabled.

### D-P6.5 — Legal pages are English DRAFT — decided + ⏳ NEEDS REVIEW
Generated substantive DRAFT Terms / Privacy / Cancellation behind a "not legal advice"
banner. Per the brief these are placeholders for **your lawyer**; they also need professional
**he/ar translation** before go-live. Do not treat as final.

### D-P6.6 — Cancellation policy baseline ⏳ CONFIRM
Used the code's existing rule — *full refund up to 24h before check-in* — as the draft
baseline (shown on /legal/cancellation with an owner-confirm note). Confirm or change; if
changed, I update the page AND the refund logic together so they always match (also a Phase-4
input).

### D-P6.7 — Error alerts via Resend email — decided
`alertHost()` emails on critical failures (no new dependency). Sentry/hosted tracking can be
added later if you want dashboards/grouping.

---

## Inputs received 2026-06-25 (to build / clarify next)

- **Calendar feeds:** owner provided the Airbnb + Booking.com iCal URLs (secrets → set as
  `ICAL_AIRBNB_URL` / `ICAL_BOOKING_URL` env vars, never committed). Verified both fetch +
  parse with our sync (Airbnb ≈21 nights, Booking ≈164 nights). GBP URL set.
- **Cancellation policy (Phase 4 baseline):** 100% refund if cancelled MORE than 5 days
  before check-in; 50% if within 5 days; last-minute bookings (made for check-in ≤3 days
  away) also get 50%. OPEN: is there a 0% / no-show / same-day window? (asked owner).
- **Sleeping arrangements:** 3 rooms = 2 bedrooms (double bed each) + living room (double
  sofa-bed, a non-folding sofa, a thick folding single) → up to 8 guests; baby cot on
  request. To add as a site section (needs 6-locale translation).
- **House rules:** guest must APPROVE before booking (required checkbox gate). No smoking
  ($200/day), no parties, quiet 21:00–08:00, $100/day per extra guest over booked count,
  valid phone required, $100 extra-cleaning, violation = termination w/o refund. Needs
  translation.
- **Check-in instructions:** owner provided the automated check-in text (address, entry/
  safe/wifi codes, shower/heater notes, contacts). This is **Phase 4 confirmed-guest email**
  content and contains sensitive codes → must NOT be committed to git; store as config (env
  or a settings row) and reference from the email. (Codes intentionally not written here.)
- **Corrections to publish:** check-in time is **14:00** (legal + structured-data currently
  say 15:00); street address is **Barukh Karo 24** (structured-data says "ברוך קרוא 100").
  Confirm whether to publish the exact address or keep it neighbourhood-level.
- **Branding:** no logo yet — owner wants a YaffoTLV logo designed; brand/host photo coming.
- **Deferred:** improve SEO + web/social marketing later (owner: "don't forget").

---

## Pending (future phases) — noted, not yet decided
- Cancellation/refund **policy** values (Phase 4.2) — will ask before encoding.
- Local Israeli payment provider for **Bit** (Phase 2A.5) — will research + recommend,
  then wait for approval.
- Dynamic pricing **model** (Phase 5) — will propose options, then wait.
- Inbound iCal pull **frequency** (Phase 2B.4) — depends on your Vercel plan (Hobby =
  daily only; Pro = more frequent). Will confirm.
