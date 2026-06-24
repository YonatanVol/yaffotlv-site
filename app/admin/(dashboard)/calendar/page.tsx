"use client";

import { useState, useEffect } from "react";
import {
  getBlockedDatesAdmin,
  blockDateRange,
  unblockDate,
  triggerCalendarSync,
  getSyncStatus,
} from "../../actions";

type BlockedDate = Awaited<ReturnType<typeof getBlockedDatesAdmin>>[number];
type SyncStatus = Awaited<ReturnType<typeof getSyncStatus>>[number];

const SOURCE_STYLES: Record<string, string> = {
  airbnb: "bg-red-50 text-red-600 border border-red-200",
  booking_com: "bg-blue-50 text-blue-600 border border-blue-200",
  manual: "bg-amber-50 text-amber-600 border border-amber-200",
  reservation: "bg-green-50 text-green-600 border border-green-200",
};

const SOURCE_LABELS: Record<string, string> = {
  airbnb: "Airbnb",
  booking_com: "Booking.com",
  manual: "Manual",
  reservation: "Direct",
};

const STALE_MS = 2 * 60 * 60 * 1000; // sync runs hourly → stale if >2h

function freshness(s: SyncStatus): { label: string; cls: string } {
  if (s.status === "error") return { label: "Failed", cls: "text-red-600" };
  if (s.at && Date.now() - new Date(s.at).getTime() > STALE_MS)
    return { label: "Stale", cls: "text-amber-600" };
  return { label: "OK", cls: "text-green-600" };
}

export default function CalendarPage() {
  const [dates, setDates] = useState<BlockedDate[]>([]);
  const [sync, setSync] = useState<SyncStatus[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    Promise.all([getBlockedDatesAdmin(), getSyncStatus()])
      .then(([d, s]) => {
        setDates(d);
        setSync(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleBlock() {
    if (!start) return;
    await blockDateRange(start, end || start);
    setStart("");
    setEnd("");
    load();
  }

  async function handleUnblock(id: string) {
    await unblockDate(id);
    load();
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await triggerCalendarSync();
      load();
    } finally {
      setSyncing(false);
    }
  }

  const grouped = dates.reduce<Record<string, BlockedDate[]>>((acc, d) => {
    const month = d.date.substring(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(d);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-light text-graphite">Calendar</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="border border-brass/40 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-brass transition-colors hover:bg-brass hover:text-white disabled:opacity-50"
        >
          {syncing ? "Syncing…" : "Sync now"}
        </button>
      </div>

      {/* Sync-status panel */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["airbnb", "booking_com"] as const).map((src) => {
          const s = sync.find((x) => x.source === src);
          const f = s ? freshness(s) : null;
          return (
            <div key={src} className="border border-sand bg-cream p-4">
              <div className="flex items-center justify-between">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${SOURCE_STYLES[src]}`}>
                  {SOURCE_LABELS[src]}
                </span>
                {f ? <span className={`text-xs font-medium ${f.cls}`}>{f.label}</span> : <span className="text-xs text-stone">No sync yet</span>}
              </div>
              {s ? (
                <p className="mt-2 text-xs text-stone">
                  Last run {s.at ? new Date(s.at).toLocaleString() : "—"} · {s.count} dates
                  {s.message ? ` · ${s.message}` : ""}
                </p>
              ) : (
                <p className="mt-2 text-xs text-stone">Run “Sync now”, or it runs hourly automatically.</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual block (single date or range) */}
      <div className="mt-8 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-stone">From</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="mt-1 border border-sand bg-cream px-4 py-2.5 text-sm text-graphite focus:border-brass focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-stone">To (optional)</label>
          <input
            type="date"
            value={end}
            min={start || undefined}
            onChange={(e) => setEnd(e.target.value)}
            className="mt-1 border border-sand bg-cream px-4 py-2.5 text-sm text-graphite focus:border-brass focus:outline-none"
          />
        </div>
        <button
          onClick={handleBlock}
          disabled={!start}
          className="bg-brass px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-brass-dark disabled:opacity-50"
        >
          Block dates
        </button>
      </div>
      <p className="mt-2 text-xs text-stone">Manual blocks publish to Airbnb &amp; Booking via your iCal feed.</p>

      {/* Blocked dates list */}
      {loading ? (
        <p className="mt-8 text-sm text-stone">Loading…</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="mt-8 text-sm text-stone">No blocked dates.</p>
      ) : (
        <div className="mt-8 space-y-8">
          {Object.entries(grouped).map(([month, monthDates]) => (
            <div key={month}>
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-stone">
                {new Date(month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </h3>
              <div className="mt-3 space-y-1">
                {monthDates.map((d) => (
                  <div key={d.id} className="flex items-center justify-between border border-sand/50 bg-cream px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-graphite">{d.date}</span>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SOURCE_STYLES[d.source] || "bg-sand/50 text-stone"}`}>
                        {SOURCE_LABELS[d.source] || d.source}
                      </span>
                      {d.summary && <span className="text-xs text-stone">{d.summary}</span>}
                    </div>
                    {d.source === "manual" && (
                      <button onClick={() => handleUnblock(d.id)} className="text-xs text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
