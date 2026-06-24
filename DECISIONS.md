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

### D-P1.4 — MAX_GUESTS = 6 ⏳ CONFIRM
**Decided:** server-side guest-count bound is **1–6**, matching the existing booking
UI `<select>`. **Why:** no stated capacity anywhere in the code; 6 matches what guests
can already pick. If the apartment's real max is different, tell me and I'll change the
one constant (`MAX_GUESTS` in `lib/validation.ts`).

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

## Pending (future phases) — noted, not yet decided
- Cancellation/refund **policy** values (Phase 4.2) — will ask before encoding.
- Local Israeli payment provider for **Bit** (Phase 2A.5) — will research + recommend,
  then wait for approval.
- Dynamic pricing **model** (Phase 5) — will propose options, then wait.
- Inbound iCal pull **frequency** (Phase 2B.4) — depends on your Vercel plan (Hobby =
  daily only; Pro = more frequent). Will confirm.
