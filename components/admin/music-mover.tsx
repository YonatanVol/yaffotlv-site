"use client";

/**
 * The YouTube → Spotify mover.
 *
 * Deliberately a review step, not a one-click import: the page scans a YouTube
 * playlist, shows what it believes each video is on Spotify, and only writes the
 * rows the owner leaves ticked. Nothing reaches Spotify until "Copy" is pressed.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { ScannedTrack, ScanStatus } from "@/lib/music/scan";
import type { SpotifyCandidate } from "@/lib/music/match";

type Connection = { label: string } | null;
type Connections = { google: Connection; spotify: Connection };

type YouTubePlaylistOption = { id: string; title: string; itemCount: number };
type SpotifyPlaylistOption = { id: string; name: string; trackCount: number };

type Row = ScannedTrack & { include: boolean; chosenId: string | null };

type Destination =
  | { mode: "new"; name: string }
  | { mode: "existing"; playlistId: string };

const STATUS_LABEL: Record<ScanStatus, string> = {
  matched: "Matched",
  review: "Check this one",
  unmatched: "Not found",
  skipped: "Skipped",
};

const STATUS_STYLE: Record<ScanStatus, string> = {
  matched: "bg-[#e8f0e6] text-[#3f6b3a]",
  review: "bg-[#f6efdd] text-[#8a6d1f]",
  unmatched: "bg-[#f4e6e4] text-[#8c4a41]",
  skipped: "bg-sand text-stone",
};

function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

/** All candidates for a row, best first, with the current pick resolvable by id. */
function candidatesFor(row: Row): (SpotifyCandidate & { score: number })[] {
  const primary = row.match ? [{ ...row.match, score: row.match.score }] : [];
  return [...primary, ...row.alternatives];
}

export default function MusicMover({ initial }: { initial: Connections }) {
  const [connections, setConnections] = useState<Connections>(initial);
  const [playlists, setPlaylists] = useState<YouTubePlaylistOption[]>([]);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylistOption[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [destination, setDestination] = useState<Destination>({ mode: "new", name: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ added: number; skipped: number; url: string } | null>(
    null
  );

  const bothConnected = Boolean(connections.google && connections.spotify);
  const sourcePlaylist = playlists.find((playlist) => playlist.id === sourceId);

  /** Turns a failed API call into a message, and flags a dropped connection. */
  const handleFailure = useCallback(async (response: Response) => {
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      reconnect?: "google" | "spotify";
    };
    if (data.reconnect) {
      setConnections((current) => ({ ...current, [data.reconnect!]: null }));
    }
    setError(data.error || "Something went wrong");
  }, []);

  const loadPlaylists = useCallback(async () => {
    if (!bothConnected) return;
    try {
      const [youtube, spotify] = await Promise.all([
        fetch("/api/music/playlists?source=youtube"),
        fetch("/api/music/playlists?source=spotify"),
      ]);
      if (youtube.ok) setPlaylists((await youtube.json()).playlists ?? []);
      else await handleFailure(youtube);
      if (spotify.ok) setSpotifyPlaylists((await spotify.json()).playlists ?? []);
    } catch {
      setError("Couldn't reach the server");
    }
  }, [bothConnected, handleFailure]);

  useEffect(() => {
    void loadPlaylists();
  }, [loadPlaylists]);

  async function disconnect(provider: "google" | "spotify") {
    await fetch("/api/music/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    setConnections((current) => ({ ...current, [provider]: null }));
    setRows([]);
  }

  async function scan() {
    if (!sourceId) return;
    setBusy(true);
    setError("");
    setResult(null);
    setRows([]);
    setProgress({ done: 0, total: 0 });

    try {
      const listed = await fetch(`/api/music/playlist-items?playlistId=${encodeURIComponent(sourceId)}`);
      if (!listed.ok) {
        await handleFailure(listed);
        return;
      }
      const { videoIds } = (await listed.json()) as { videoIds: string[] };
      setProgress({ done: 0, total: videoIds.length });

      // Batched on purpose: each request stays short, and rows appear as they
      // resolve instead of after a single long silence.
      for (let index = 0; index < videoIds.length; index += 25) {
        const batch = videoIds.slice(index, index + 25);
        const response = await fetch("/api/music/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoIds: batch }),
        });
        if (!response.ok) {
          await handleFailure(response);
          return;
        }
        const { tracks } = (await response.json()) as { tracks: ScannedTrack[] };
        setRows((current) => [
          ...current,
          ...tracks.map((track) => ({
            ...track,
            // Confident matches start ticked; anything needing a human doesn't.
            include: track.status === "matched",
            chosenId: track.match?.id ?? null,
          })),
        ]);
        setProgress({ done: Math.min(index + batch.length, videoIds.length), total: videoIds.length });
      }

      if (destination.mode === "new" && !destination.name && sourcePlaylist) {
        setDestination({ mode: "new", name: sourcePlaylist.title });
      }
    } catch {
      setError("Couldn't reach the server");
    } finally {
      setBusy(false);
    }
  }

  const selectedUris = useMemo(() => {
    const uris: string[] = [];
    for (const row of rows) {
      if (!row.include || !row.chosenId) continue;
      const chosen = candidatesFor(row).find((candidate) => candidate.id === row.chosenId);
      if (chosen) uris.push(chosen.uri);
    }
    return uris;
  }, [rows]);

  async function transfer() {
    if (!selectedUris.length) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/music/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uris: selectedUris,
          target:
            destination.mode === "new"
              ? { mode: "new", name: destination.name || sourcePlaylist?.title || "From YouTube" }
              : { mode: "existing", playlistId: destination.playlistId },
          sourceName: sourcePlaylist?.title,
        }),
      });
      if (!response.ok) {
        await handleFailure(response);
        return;
      }
      const data = (await response.json()) as { added: number; skipped: number; playlistUrl: string };
      setResult({ added: data.added, skipped: data.skipped, url: data.playlistUrl });
    } catch {
      setError("Couldn't reach the server");
    } finally {
      setBusy(false);
    }
  }

  function updateRow(videoId: string, change: Partial<Row>) {
    setRows((current) =>
      current.map((row) => (row.videoId === videoId ? { ...row, ...change } : row))
    );
  }

  function setAll(status: ScanStatus, include: boolean) {
    setRows((current) =>
      current.map((row) =>
        row.status === status && row.chosenId ? { ...row, include } : row
      )
    );
  }

  const counts = useMemo(() => {
    const tally: Record<ScanStatus, number> = { matched: 0, review: 0, unmatched: 0, skipped: 0 };
    for (const row of rows) tally[row.status]++;
    return tally;
  }, [rows]);

  return (
    <div className="space-y-8">
      <ConnectionCards connections={connections} onDisconnect={disconnect} />

      {error && (
        <p className="border border-[#d9b4ae] bg-[#f9efee] px-4 py-3 text-sm text-[#8c4a41]">
          {error}
        </p>
      )}

      {!bothConnected ? (
        <p className="text-sm text-stone">
          Connect both accounts to start. YouTube is read-only — the mover can list your
          playlists but never change them.
        </p>
      ) : (
        <>
          <section className="border border-sand bg-cream p-6">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">
              1 — Pick a YouTube playlist
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sourceId}
                onChange={(event) => setSourceId(event.target.value)}
                className="min-w-64 border border-sand bg-white px-3 py-2 text-sm text-graphite focus:border-brass focus:outline-none"
              >
                <option value="">Choose a playlist…</option>
                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.title} ({playlist.itemCount})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={scan}
                disabled={!sourceId || busy}
                className="bg-graphite px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-cream transition-colors hover:bg-charcoal disabled:opacity-40"
              >
                {busy && progress ? "Scanning…" : "Scan for music"}
              </button>
              {progress && progress.total > 0 && (
                <span className="text-xs text-stone">
                  {progress.done} / {progress.total} videos
                </span>
              )}
            </div>
          </section>

          {rows.length > 0 && (
            <>
              <section className="border border-sand bg-cream p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-stone">
                    2 — Review {rows.length} videos
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-stone">
                    <span>{counts.matched} matched</span>
                    <span>· {counts.review} to check</span>
                    <span>· {counts.unmatched} not found</span>
                    <span>· {counts.skipped} skipped (not music)</span>
                  </div>
                </div>
                <div className="mb-4 flex gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setAll("review", true)}
                    className="text-brass underline-offset-4 hover:underline"
                  >
                    Tick all “check this one”
                  </button>
                  <button
                    type="button"
                    onClick={() => setAll("review", false)}
                    className="text-stone underline-offset-4 hover:underline"
                  >
                    Untick them
                  </button>
                </div>

                <ul className="divide-y divide-sand">
                  {rows.map((row) => (
                    <TrackRow key={row.videoId} row={row} onChange={updateRow} />
                  ))}
                </ul>
              </section>

              <section className="border border-sand bg-cream p-6">
                <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">
                  3 — Copy {selectedUris.length} tracks to Spotify
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm text-graphite">
                    <input
                      type="radio"
                      checked={destination.mode === "new"}
                      onChange={() =>
                        setDestination({ mode: "new", name: sourcePlaylist?.title ?? "" })
                      }
                      className="accent-brass"
                    />
                    New private playlist
                    {destination.mode === "new" && (
                      <input
                        value={destination.name}
                        onChange={(event) =>
                          setDestination({ mode: "new", name: event.target.value })
                        }
                        placeholder={sourcePlaylist?.title ?? "Playlist name"}
                        className="min-w-56 border border-sand bg-white px-3 py-1.5 text-sm focus:border-brass focus:outline-none"
                      />
                    )}
                  </label>
                  <label className="flex items-center gap-3 text-sm text-graphite">
                    <input
                      type="radio"
                      checked={destination.mode === "existing"}
                      onChange={() =>
                        setDestination({
                          mode: "existing",
                          playlistId: spotifyPlaylists[0]?.id ?? "",
                        })
                      }
                      className="accent-brass"
                    />
                    Add to an existing playlist
                    {destination.mode === "existing" && (
                      <select
                        value={destination.playlistId}
                        onChange={(event) =>
                          setDestination({ mode: "existing", playlistId: event.target.value })
                        }
                        className="min-w-56 border border-sand bg-white px-3 py-1.5 text-sm focus:border-brass focus:outline-none"
                      >
                        {spotifyPlaylists.map((playlist) => (
                          <option key={playlist.id} value={playlist.id}>
                            {playlist.name} ({playlist.trackCount})
                          </option>
                        ))}
                      </select>
                    )}
                  </label>
                </div>

                <button
                  type="button"
                  onClick={transfer}
                  disabled={busy || selectedUris.length === 0}
                  className="mt-5 bg-brass px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-accent-dark disabled:opacity-40"
                >
                  {busy ? "Copying…" : `Copy ${selectedUris.length} tracks`}
                </button>

                {result && (
                  <p className="mt-4 text-sm text-graphite">
                    Added {result.added} tracks
                    {result.skipped > 0 && ` (${result.skipped} were already there)`}.{" "}
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brass underline underline-offset-4"
                    >
                      Open in Spotify
                    </a>
                  </p>
                )}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

function ConnectionCards({
  connections,
  onDisconnect,
}: {
  connections: Connections;
  onDisconnect: (provider: "google" | "spotify") => void;
}) {
  const cards = [
    { provider: "google" as const, name: "YouTube", connection: connections.google },
    { provider: "spotify" as const, name: "Spotify", connection: connections.spotify },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.provider}
          className="flex items-center justify-between border border-sand bg-cream px-5 py-4"
        >
          <div>
            <p className="text-sm font-medium text-graphite">{card.name}</p>
            <p className="text-xs text-stone">
              {card.connection ? card.connection.label : "Not connected"}
            </p>
          </div>
          {card.connection ? (
            <button
              type="button"
              onClick={() => onDisconnect(card.provider)}
              className="text-xs uppercase tracking-[0.15em] text-stone hover:text-brass"
            >
              Disconnect
            </button>
          ) : (
            <a
              href={`/api/music/connect/${card.provider}`}
              className="bg-graphite px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-cream transition-colors hover:bg-charcoal"
            >
              Connect
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function TrackRow({
  row,
  onChange,
}: {
  row: Row;
  onChange: (videoId: string, change: Partial<Row>) => void;
}) {
  const candidates = candidatesFor(row);
  const chosen = candidates.find((candidate) => candidate.id === row.chosenId);

  return (
    <li className="flex gap-4 py-3">
      <input
        type="checkbox"
        checked={row.include}
        disabled={!row.chosenId}
        onChange={(event) => onChange(row.videoId, { include: event.target.checked })}
        className="mt-1 accent-brass disabled:opacity-30"
      />

      {row.thumbnail && (
        <Image
          src={row.thumbnail}
          alt=""
          width={64}
          height={48}
          unoptimized
          className="h-12 w-16 shrink-0 object-cover"
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm text-graphite">{row.videoTitle}</p>
          <span
            className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${STATUS_STYLE[row.status]}`}
          >
            {STATUS_LABEL[row.status]}
          </span>
        </div>
        <p className="text-xs text-stone">
          {row.channelTitle}
          {row.durationSec ? ` · ${formatDuration(row.durationSec)}` : ""}
          {row.status === "skipped" || row.status === "unmatched" ? ` · ${row.note}` : ""}
        </p>

        {candidates.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone">→</span>
            <select
              value={row.chosenId ?? ""}
              onChange={(event) =>
                onChange(row.videoId, {
                  chosenId: event.target.value || null,
                  include: Boolean(event.target.value),
                })
              }
              className="max-w-full border border-sand bg-white px-2 py-1 text-xs text-graphite focus:border-brass focus:outline-none"
            >
              <option value="">Don’t copy this one</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.artists.join(", ")} — {candidate.name}
                  {candidate.album ? ` · ${candidate.album}` : ""} ({formatDuration(candidate.durationSec)}, {candidate.score}%)
                </option>
              ))}
            </select>
            {chosen && (
              <a
                href={`https://open.spotify.com/track/${chosen.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brass underline-offset-4 hover:underline"
              >
                listen
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
