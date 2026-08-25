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
- **Cancellation policy (CONFIRMED 2026-06-25):** measured against **14:00 Jerusalem** on the
  arrival date — **>5 days** before = **100%**; **1–5 days** = **50%** (incl. last-minute
  bookings for a check-in ≤3 days away); **<1 day** before / no-show = **0%**.
  `/legal/cancellation` updated to match; the refund LOGIC gets wired in **Phase 4** (partial
  50% refunds need the payment provider).
- **Sleeping arrangements + parking — BUILT (2026-06-27):** "The Space" section on the home
  page (2 doubles + living-room sofa-beds = up to 8, cot on request) + a short public parking
  note; en/he/ar. Full parking + check-in detail still goes in the Phase-4 guest email.
- **House rules — BUILT (2026-06-27):** `/legal/house-rules` page + a required agreement
  checkbox in the booking flow (blocks payment until ticked); en/he/ar + footer/sitemap links.
  ⚠️ The fines and "termination without refund" should be checked with the lawyer for
  enforceability (esp. for EU consumers via Booking.com).
- **Check-in instructions:** owner provided the automated check-in text (address, entry/
  safe/wifi codes, shower/heater notes, contacts). This is **Phase 4 confirmed-guest email**
  content and contains sensitive codes → must NOT be committed to git; store as config (env
  or a settings row) and reference from the email. (Codes intentionally not written here.)
- **Corrections applied (2026-06-25):** check-in time set to **14:00** (was 15:00) in
  structured-data + legal/terms + cancellation page; public address set to **Baruch Karo 24,
  Tel Aviv** (was "ברוך קרוא 100") in structured-data — owner confirmed publishing the exact
  address. OPEN: the visible map pin / structured-data geo is `32.0485, 34.7545` — owner to
  confirm it sits on the right building (offered to update the pin).
- **Parking (provided 2026-06-25):** free street parking 19:00–09:00 on the marked side;
  paid daytime 09:00–19:00 (~6₪/hr via the Cello app) on the building side; host assists on
  arrival. → short public note (neighbourhood/amenities) + full text in the Phase-4 check-in
  email.
- **Branding:** no logo yet — owner wants a YaffoTLV logo designed; brand/host photo coming.
- **Deferred:** improve SEO + web/social marketing later (owner: "don't forget").

---

## D-LAUNCH — Go live now as a marketing + inquiry site (Path A) ✅ 2026-06-28

Owner chose to launch immediately rather than wait for PayPlus. The booking flow runs in
**inquiry mode**: it collects dates + guest details + shows the price, then the final button
(**"Request to book on WhatsApp"**) opens a pre-filled WhatsApp message to the host instead of
a (non-existent) online-payment step. No draft reservation / no `/api/checkout` call in this
mode. The owner confirms availability + handles payment manually, and blocks the dates in admin.

Controlled by the `NEXT_PUBLIC_PAYMENTS_ENABLED` env var (unset/false = inquiry mode). When
PayPlus is wired and this is set to `true`, the full online-payment flow takes over with no
other change. WhatsApp number: 972528701670.

---

## Pending (future phases) — noted, not yet decided
- Cancellation/refund **policy** values (Phase 4.2) — will ask before encoding.
- Local Israeli payment provider for **Bit** (Phase 2A.5) — will research + recommend,
  then wait for approval.
- Dynamic pricing **model** (Phase 5) — will propose options, then wait.
- Inbound iCal pull **frequency** (Phase 2B.4) — depends on your Vercel plan (Hobby =
  daily only; Pro = more frequent). Will confirm.

---

## Music mover (YouTube → Spotify)

### D-MM.1 — Tokens live in an encrypted cookie, not in Neon
**Decided:** the connected YouTube/Spotify access + refresh tokens are stored in one
`httpOnly` AES-256-GCM cookie (`music_connections`), keyed by SHA-256 of the existing
`JWT_SECRET`. No new table, no migration, no new secret.
**Why:** the tool is single-user and fully interactive — nothing runs in the background,
so the server never needs tokens outside a request the owner made. Keeping them out of
the database means a database dump contains no keys to anyone's Google or Spotify
account. Cost: signing out or rotating `JWT_SECRET` drops the connections and the owner
reconnects (a few seconds, twice a year at most). Measured size with real tokens is well
under the 4 KB cookie limit.

### D-MM.2 — It lives inside /admin, not on the public site
**Decided:** the page is `/admin/music`, behind the existing admin session; the
`/api/music/*` routes are covered by the same middleware **and** re-check the session
themselves.
**Why:** it is the owner's personal tool with access to two of their accounts — it has no
place on a guest-facing apartment site, and reusing the admin gate means no second auth
system to get wrong. `/admin` and `/api` are already disallowed in robots.txt.

### D-MM.3 — "Only music" = YouTube's own category, not a guess
**Decided:** a video is treated as music when YouTube files it under category `10`, when
it sits on an auto-generated `Artist - Topic` channel, or when its topic metadata is
musical. Everything else is reported as skipped, with the reason shown.
**Why:** YouTube already classifies uploads, and its answer is far better than anything
inferable from a title. The two fallbacks catch songs filed under the wrong category.

### D-MM.4 — Mixes, DJ sets and full albums are skipped
**Decided:** music-category uploads that look long-form (title says mix/full album/DJ set,
or the video runs over 20 minutes) are skipped rather than matched.
**Why:** they are not a single recording, so any Spotify match would be an invented one.
Reporting them honestly beats silently adding the wrong track.

### D-MM.5 — Review before write, with confidence bands
**Decided:** a scan only proposes. Matches score 0–100; ≥ 78 is ticked automatically,
58–77 is shown as "check this one" with alternatives and starts unticked, below that is
reported as not found. The transfer route writes exactly the track uris the owner
confirmed — it never re-runs matching.
**Why:** a fuzzy title match is right most of the time, not all of the time, and a wrong
track quietly appearing in a playlist is worse than a row that asks a question. Keeping
the decision in the UI also means the write path has nothing to get creative about.

### D-MM.6 — Re-running a transfer can't duplicate tracks (sequentially)
**Decided:** when copying into an existing playlist, the tracks already there are read
first and filtered out; duplicates within one batch are collapsed too.
**Why:** scanning a playlist twice, or copying a playlist that shares songs with the
target, is normal use — it shouldn't leave a mess.
**Limit (owner-accepted, 2026-08-15):** the read is a point-in-time snapshot, so this
holds for *sequential* transfers, not concurrent ones. Two transfers fired at the same
playlist at the same moment — a double submit, or a second tab — can both see a uri as
absent and both append it. Raised by CodeRabbit on PR #29.
**Why not fixed:** closing it properly needs a durable per-playlist lock (a Postgres
advisory lock or an idempotency table plus a migration), which is disproportionate for a
single-user interactive tool where the failure needs a deliberate double submit. The
button disables while a transfer is in flight. Recorded here rather than papered over.

### D-MM.7 — "Liked videos" IS a source ✅ CORRECTED 2026-08-15
**Originally recorded:** that the API exposed neither Liked videos nor Liked Music, so
neither could be offered. **That was wrong**, and CodeRabbit caught it on PR #29.
**Decided:** `channels.list?part=contentDetails&mine=true` returns
`contentDetails.relatedPlaylists.likes`, which reads like any other playlist. Liked videos
now appear at the top of the picker.
**Why the top:** it is the list most people actually want moved, and the one that never
shows up in `playlists.list`.
**Still true:** YouTube *Music*'s separate "Liked Music" list has no API equivalent. The
likes playlist also publishes no item count, so the picker omits the count rather than
printing a misleading `(0)`, and a very long one can hit the 2000-entry read cap — which
the page now reports instead of silently truncating.

---

## Working process

### D-ADD.1 — The development process is written down, going forward only
**Decided:** added `AI_DRIVEN_DEVELOPMENT.md` (12 steps) and `CLAUDE.md`. They describe how
work is done from now on; earlier phases were **not** retrofitted to them.
**Why:** the conventions already existed — phase-gated delivery, a read-only recon pass,
`CHANGES.md` + `DECISIONS.md` on every change, a fixed verification gate, `⏳ NEEDS YOU`
rather than guessing — but only as a shape you could infer from the artifacts. Nothing
stated them, so each new session had to rediscover them or invent something else. Writing
them down costs nothing and makes the next session start where this one ended.
**Why no retrofit (owner's call, 2026-08-15):** rewriting history to look compliant would
be documentation theatre. The steps earn their place by being followed next time.
