# YouTube → Spotify mover

An owner-only tool at **/admin → Music**. It reads one of your YouTube playlists,
keeps only the entries that are actually music, finds each song on Spotify, shows
you what it found, and copies the ones you confirm into a Spotify playlist.

It is read-only on the YouTube side and only ever *adds* tracks on the Spotify
side. Nothing is written until you press **Copy**.

---

## What it does, step by step

1. **Lists your YouTube playlists** (`youtube.readonly`).
2. **Reads the playlist**, skipping private and deleted entries.
3. **Keeps only music.** A video counts as music if YouTube files it under the
   Music category (id `10`), if it sits on an auto-generated `Artist - Topic`
   channel, or if its topic metadata is musical. Anything else — vlogs,
   tutorials, podcasts — is listed as *skipped* with the reason.
4. **Drops long-form uploads.** Full albums, DJ sets, "1 hour mix" videos and
   anything over 20 minutes are skipped: they aren't a single track, so any
   Spotify match would be a guess.
5. **Finds each song on Spotify.** The video title is parsed into artist +
   track (`a-ha - Take On Me (Official Video)` → artist `a-ha`, track
   `Take On Me`), promo junk like `(Official Video)`/`[4K]` is stripped, while
   `(Illenium Remix)` or `(Live at Folsom)` is kept — those identify a
   *different recording*. Candidates are scored on title, artist and track
   length.
6. **Shows you everything** before writing:
   - **Matched** (score ≥ 78) — ticked by default.
   - **Check this one** (58–77) — shown with alternatives, unticked.
   - **Not found** — near-misses offered in a dropdown.
   - **Skipped** — not music, or a mix/album.
7. **Copies** the ticked tracks into a new private playlist or an existing one.
   Tracks already in the target playlist are not added twice, so re-running a
   transfer is safe.

---

## One-time setup

Both providers need an OAuth app, and each needs the exact redirect URI
registered. Replace `https://www.yaffotlv.com` with your own origin
(`http://localhost:3000` for local work — register both if you develop locally).

### Google (YouTube)

1. <https://console.cloud.google.com> → create or pick a project.
2. **APIs & Services → Library** → enable **YouTube Data API v3**.
3. **OAuth consent screen** → External. While the app is in *Testing*, add your
   own Google account under **Test users** — otherwise consent is refused.
4. **Credentials → Create credentials → OAuth client ID → Web application**.
   Authorised redirect URI:
   ```
   https://www.yaffotlv.com/api/music/connect/google/callback
   ```
5. Copy the client id and secret.

### Spotify

1. <https://developer.spotify.com/dashboard> → **Create app**.
2. Redirect URI:
   ```
   https://www.yaffotlv.com/api/music/connect/spotify/callback
   ```
3. Under **User Management**, add the Spotify account you'll connect (apps in
   development mode only work for listed users).
4. Copy the client id and secret.

### Environment variables

Set these in Vercel (and `.env.local` for development):

| Variable | Where it comes from |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Google OAuth client |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client |
| `SPOTIFY_CLIENT_ID` | Spotify app |
| `SPOTIFY_CLIENT_SECRET` | Spotify app |
| `NEXT_PUBLIC_SITE_URL` | already set — the redirect URIs are built from it |
| `JWT_SECRET` | already set — also encrypts the stored music tokens |

Nothing else is required: no new database tables, no migration.

---

## Where the tokens live

In one encrypted cookie in your browser (`music_connections`, AES-256-GCM,
`httpOnly`), never in the database. Access tokens are refreshed automatically
when they expire.

- **Disconnect** in the UI forgets them locally.
- To revoke access at the source: <https://myaccount.google.com/permissions>
  and <https://www.spotify.com/account/apps/>.
- Rotating `JWT_SECRET` invalidates the cookie — you simply reconnect.

---

## Known limits

- **"Liked videos" / "Liked Music" can't be copied.** The YouTube Data API does
  not expose them as playlists. Add the songs to a real playlist first.
- **YouTube API quota** is 10,000 units/day by default. A scan costs roughly
  1 unit per 50 playlist entries plus 1 per 50 videos, so this is not a practical
  limit for personal playlists.
- **Spotify rate limits** are handled by honouring `Retry-After` and retrying;
  a very large playlist just scans a little slower.
- The scan runs in batches of 25 videos so no single request outlives the
  serverless function limit. Progress is shown as it goes.
- Region-restricted or Spotify-absent tracks (unreleased remixes, YouTube-only
  uploads) will legitimately come back as *not found*.

---

## Code map

| File | Role |
| --- | --- |
| `lib/music/match.ts` | Title parsing and match scoring — pure, unit-tested |
| `lib/music/youtube.ts` | YouTube OAuth + read-only Data API client |
| `lib/music/spotify.ts` | Spotify OAuth + Web API client (search, create, add) |
| `lib/music/scan.ts` | Classify → parse → search → decide, per video |
| `lib/music/session.ts` | The encrypted token cookie |
| `lib/music/connections.ts` | Access tokens with automatic refresh |
| `app/api/music/*` | Admin-gated routes (connect, scan, transfer, …) |
| `components/admin/music-mover.tsx` | The review-and-copy UI |
| `lib/music-match.test.ts`, `lib/music-scan.test.ts` | `npm test` |
