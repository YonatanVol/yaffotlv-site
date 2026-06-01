# StickerPack — TikTok stickers → WhatsApp packs

A standalone Next.js 16 app that extracts **animated sticker replies from public
TikTok comments** and converts them into installable **WhatsApp sticker packs**.
Lives inside the `yaffotlv-site` monorepo but deploys as its own Vercel project.

- Free tier: **5** sticker conversions / month
- Pro tier: **$4.99/mo**, up to **300** conversions / month (Stripe subscription)

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · TailwindCSS v4 · Drizzle ORM
(Neon Postgres) · `sharp` (image conversion) · `jszip` (`.wastickers`) ·
Vercel Blob (storage) · `jose` + `bcryptjs` (auth) · Stripe (billing).

> **Note on Next.js 16:** the old `middleware.ts` convention is renamed to
> `proxy.ts` (Node.js runtime), and `cookies()` / `params` are async.

## Project layout

```
app/
  page.tsx                       Landing (hero / how-it-works / pricing / FAQ)
  (auth)/login | signup          Email + password auth
  (app)/dashboard                Usage meter + recent packs
  (app)/extract                  TikTok URL + manual upload
  (app)/builder                  Select 3–30 stickers, name the pack
  (app)/download/[packId]        Android .wastickers + iOS Sticker.ly guide
  (app)/billing                  Plan + Stripe upgrade / manage
  api/auth/*                     login / signup / logout
  api/stickers/{extract,upload}  TikTok extraction + manual upload
  api/packs, api/packs/[id]/download
  api/billing/{subscribe,portal,webhook}
  api/cron/cleanup               Deletes expired pack downloads
lib/
  auth/session.ts  db/{schema,index}.ts  usage.ts  stickers.ts  stripe.ts
  tiktok/api-fetcher.ts
  conversion/{image-pipeline,pack-builder,tray-icon}.ts
  storage/blob.ts
proxy.ts                         Route protection (renamed middleware)
```

## Setup

```bash
cd sticker-app
npm install
cp .env.example .env.local        # then fill in the values
npm run db:generate               # generate migration (already committed)
npm run db:migrate                # apply sp_* tables to your Neon database
npm run dev
```

The app shares the rental app's Neon database. `drizzle.config.ts` sets
`tablesFilter: ["sp_*"]`, so migrations only ever touch this app's tables.

### Required environment variables

See `.env.example`. Summary:

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres (shared; `sp_*` tables only) |
| `SP_JWT_SECRET` | Session signing secret (do not reuse the rental app's) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store token |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe API + webhook verification |
| `STRIPE_PRO_PRICE_ID` | Recurring price ID for the $4.99/mo plan |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `RESEND_API_KEY` | (optional) dunning emails |
| `CRON_SECRET` | Bearer token guarding `/api/cron/cleanup` |
| `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_NAME` | App URL + display name |

Missing service secrets degrade gracefully: billing returns `503` until Stripe
is configured, and TikTok extraction falls back to manual upload.

## Stripe setup

1. Create a **Product** with a recurring **$4.99/mo** price; copy the price ID to
   `STRIPE_PRO_PRICE_ID`.
2. Add a webhook endpoint → `https://YOUR_DOMAIN/api/billing/webhook` listening
   for `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.payment_failed`. Copy the signing
   secret to `STRIPE_WEBHOOK_SECRET`.
3. Local testing: `stripe listen --forward-to localhost:3000/api/billing/webhook`.

## Vercel cron

`vercel.json` runs `/api/cron/cleanup` daily at 03:00 UTC to delete expired
`.wastickers` downloads (24h TTL). Set `CRON_SECRET` in Vercel; the route
requires `Authorization: Bearer <CRON_SECRET>`.

## How extraction works

TikTok provides **no official API** for comment stickers. The fetcher makes a
best-effort request to TikTok's public web endpoint and downloads sticker bytes
immediately (CDN URLs expire). If TikTok blocks the request or the video has no
sticker replies, the API returns a structured reason and the UI prompts **manual
upload**. We only read public content and never bypass logins or anti-bot checks.

## Conversion & pack format

Each image is resized to **512×512 WebP** (`fit: contain`, transparent padding),
stepping quality 80→40 to stay under WhatsApp's 100KB (static) / 500KB (animated)
limits. APNG falls back to its first frame. A pack is a `.wastickers` ZIP
containing `contents.json`, a 96×96 `tray.webp`, and `01.webp … NN.webp`.

- **Android:** download `.wastickers` → opens directly in WhatsApp.
- **iOS:** WhatsApp can't sideload `.wastickers`; users save the individual
  WebPs and import them via the free Sticker.ly app.

## Quality checks

```bash
npm run typecheck   # tsc --noEmit
npm run build       # next build (Turbopack)
```

## Known limitations

- TikTok extraction is best-effort and may break when TikTok changes its site;
  manual upload is always available.
- APNG animation is not preserved (first frame only).
- iOS requires the Sticker.ly import step (no direct `.wastickers` support).
