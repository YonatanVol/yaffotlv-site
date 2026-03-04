"use client";

import { useState, useEffect } from "react";
import { getAllBookings } from "../../actions";
import { formatILS } from "@/lib/pricing";

type Booking = Awaited<ReturnType<typeof getAllBookings>>[number];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-green-50 text-green-700 border border-green-200",
  draft: "bg-amber-50 text-amber-700 border border-amber-200",
  pending_payment: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  expired: "bg-sand/50 text-stone border border-sand",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllBookings(filter || undefined)
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const filters = ["", "confirmed", "draft", "pending_payment", "cancelled", "expired"];

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-graphite">Bookings</h1>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
              filter === f
                ? "bg-brass text-white"
                : "border border-sand text-stone hover:border-brass hover:text-brass"
            }`}
          >
            {f || "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="mt-8 text-sm text-stone">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="mt-8 text-sm text-stone">No bookings found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sand">
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Guest</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Dates</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Nights</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Amount</th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-[0.15em] text-stone">Status</th>
                <th className="pb-3 text-xs font-medium uppercase tracking-[0.15em] text-stone">Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-sand/50">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-graphite">{b.guestName}</p>
                    <p className="text-xs text-stone">{b.guestEmail}</p>
                  </td>
                  <td className="py-3 pr-4 text-graphite">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="py-3 pr-4 text-graphite">{b.nights}</td>
                  <td className="py-3 pr-4 font-medium text-brass">{formatILS(b.totalAmount)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status] || "bg-sand/50 text-stone"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-stone">
                    {new Date(b.createdAt).toLocaleDateString()}
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
