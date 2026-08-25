# YaffoTLV — working notes

Direct-booking site for a short-stay apartment in Jaffa, Tel Aviv. Next.js 16
(App Router) + TypeScript + Tailwind v4, Drizzle on Neon Postgres, deployed on
Vercel. Six languages, client-side toggle, RTL for Hebrew and Arabic.

**Follow [AI_DRIVEN_DEVELOPMENT.md](AI_DRIVEN_DEVELOPMENT.md) — the 12 steps —
for any change beyond a typo.**

## Commands

```bash
npm run dev          # dev server on :3000
npm test             # node --test over lib/*.test.ts
npx tsc --noEmit     # typecheck
npm run lint         # eslint (see the note on pre-existing problems below)
npm run build        # needs DATABASE_URL and JWT_SECRET set, even for a check
npm run db:generate  # drizzle migration from schema changes
npm run db:migrate   # apply migrations
```

## Conventions that are load-bearing

- **Secrets only through [`lib/env.ts`](lib/env.ts).** It throws on a missing
  value. Never add a fallback there — an insecure default that silently works is
  the failure mode it exists to prevent.
- **Admin routes are gated twice** — in [`middleware.ts`](middleware.ts) *and*
  per-route in the handler. Don't rely on the matcher alone.
- **Money is in agorot** (ILS cents), integers only.
- **Dates are Asia/Jerusalem.** See [`lib/dates.ts`](lib/dates.ts); don't reach
  for `new Date()` in business logic.
- **Two logs, every change:** what changed and why in
  [CHANGES.md](CHANGES.md) (newest first), and every judgement call as a `D-` record
  in [DECISIONS.md](DECISIONS.md). Owner-gated questions are marked `⏳ NEEDS YOU`
  and waited on, not guessed.
- **Pure logic separate from I/O**, so it can be tested without mocks —
  [`lib/pricing.ts`](lib/pricing.ts) and [`lib/music/match.ts`](lib/music/match.ts)
  are the pattern.
- **Input validation with `zod`** on every route that takes a body.

## Known state

- `npm run lint` reports **8 pre-existing problems** (7 errors, 1 warning) in
  `app/admin/(dashboard)/bookings/page.tsx`, `lib/i18n/context.tsx` and
  `components/ui/reveal.tsx` — all `react-hooks` rules. They predate current work.
  When you report lint results, say which problems are yours and which are these.
- Payments run in **inquiry mode** (WhatsApp hand-off) unless
  `NEXT_PUBLIC_PAYMENTS_ENABLED` is true — see DECISIONS D-LAUNCH.
- The admin **music mover** (YouTube → Spotify) is an owner-only tool; setup and
  limits are in [MUSIC_MOVER.md](MUSIC_MOVER.md).
