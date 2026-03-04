"use client";

import { useState, useEffect } from "react";
import { getBlockedDatesAdmin, blockDateManually, unblockDate, triggerCalendarSync } from "../../actions";

type BlockedDate = Awaited<ReturnType<typeof getBlockedDatesAdmin>>[number];

const SOURCE_STYLES: Record<string, string> = {
  airbnb: "bg-red-50 text-red-600 border border-red-200",
  booking_com: "bg-blue-50 text-blue-600 border border-blue-200",
  manual: "bg-amber-50 text-amber-600 border border-amber-200",
  reservation: "bg-green-50 text-green-600 border border-green-200",
};

export default function CalendarPage() {
  const [dates, setDates] = useState<BlockedDate[]>([]);
  const [newDate, setNewDate] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadDates() {
    setLoading(true);
    getBlockedDatesAdmin()
      .then(setDates)
      .catch(() => setDates([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadDates(); }, []);

  async function handleBlock() {
    if (!newDate) return;
    await blockDateManually(newDate);
    setNewDate("");
    loadDates();
  }

  async function handleUnblock(id: string) {
    await unblockDate(id);
    loadDates();
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await triggerCalendarSync();
      loadDates();
    } finally {
      setSyncing(false);
    }
  }

  // Group dates by month for display
  const grouped = dates.reduce<Record<string, BlockedDate[]>>((acc, d) => {
    const month = d.date.substring(0, 7); // YYYY-MM
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
          {syncing ? "Syncing…" : "Sync Calendars"}
        </button>
      </div>

      {/* Manual block */}
      <div className="mt-6 flex items-center gap-3">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border border-sand bg-cream px-4 py-2.5 text-sm text-graphite focus:border-brass focus:outline-none"
        />
        <button
          onClick={handleBlock}
          disabled={!newDate}
          className="bg-brass px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-brass-dark disabled:opacity-50"
        >
          Block Date
        </button>
      </div>

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
                        {d.source}
                      </span>
                      {d.summary && <span className="text-xs text-stone">{d.summary}</span>}
                    </div>
                    {d.source === "manual" && (
                      <button
                        onClick={() => handleUnblock(d.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
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
