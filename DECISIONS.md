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

## Pending (future phases) — noted, not yet decided
- Cancellation/refund **policy** values (Phase 4.2) — will ask before encoding.
- Local Israeli payment provider for **Bit** (Phase 2A.5) — will research + recommend,
  then wait for approval.
- Dynamic pricing **model** (Phase 5) — will propose options, then wait.
- Inbound iCal pull **frequency** (Phase 2B.4) — depends on your Vercel plan (Hobby =
  daily only; Pro = more frequent). Will confirm.
