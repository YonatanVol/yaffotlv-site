"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUnifiedBookings } from "../../actions";
import { formatILS } from "@/lib/pricing";

type Booking = Awaited<ReturnType<typeof getUnifiedBookings>>[number];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700 border border-green-200",
  draft: "bg-amber-50 text-amber-700 border border-amber-200",
  pending_payment: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  expired: "bg-sand/50 text-stone border border-sand",
};

const SOURCE_STYLES: Record<string, string> = {
  direct: "bg-brass/10 text-brass border border-brass/30",
  airbnb: "bg-red-50 text-red-600 border border-red-200",
  booking_com: "bg-blue-50 text-blue-600 border border-blue-200",
};

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct",
  airbnb: "Airbnb",
  booking_com: "Booking.com",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [source, setSource] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUnifiedBookings({ source: source || undefined, status: status || undefined })
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [source, status]);

  const sources = ["", "direct", "airbnb", "booking_com"];
  const statuses = ["", "confirmed", "draft", "pending_payment", "cancelled", "expired"];

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-graphite">Bookings</h1>
      <p className="mt-1 text-sm text-stone">All reservations across direct, Airbnb and Booking.com.</p>

      {/* Source filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {sources.map((s) => (
          <button
            key={s || "all"}
            onClick={() => setSource(s)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
              source === s ? "bg-brass text-white" : "border border-sand text-stone hover:border-brass hover:text-brass"
            }`}
          >
            {s ? SOURCE_LABELS[s] : "All sources"}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="mt-3 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s || "all"}
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors ${
              status === s ? "bg-graphite text-white" : "border border-sand text-stone hover:border-graphite hover:text-graphite"
            }`}
          >
            {s || "Any status"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-stone">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="mt-8 text-sm text-stone">No bookings found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sand">
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Source</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Guest</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Dates</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Nights</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Amount</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Status</th>
                <th className="pb-3 text-xs font-medium uppercase tracking-[0.15em] text-stone"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-sand/50">
                  <td className="py-3 pr-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${SOURCE_STYLES[b.source] || ""}`}>
                      {SOURCE_LABELS[b.source] || b.source}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-graphite">{b.guestName || "—"}</p>
                    {b.guestEmail && <p className="text-xs text-stone">{b.guestEmail}</p>}
                  </td>
                  <td className="py-3 pr-4 text-graphite">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="py-3 pr-4 text-graphite">{b.nights}</td>
                  <td className="py-3 pr-4 font-medium text-brass">
                    {b.amount != null ? formatILS(b.amount) : "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status || ""] || "bg-sand/50 text-stone"}`}>
                      {b.status || "—"}
                    </span>
                  </td>
                  <td className="py-3">
                    {b.kind === "direct" ? (
                      <Link href={`/admin/bookings/${b.id}`} className="text-xs font-medium text-brass hover:text-brass-dark">
                        View
                      </Link>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
