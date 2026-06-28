"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBookingDetail } from "../../../actions";
import { formatILS } from "@/lib/pricing";
import { formatDateDisplay } from "@/lib/dates";

type Detail = Awaited<ReturnType<typeof getBookingDetail>>;

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [b, setB] = useState<Detail>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingDetail(id)
      .then(setB)
      .catch(() => setB(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-stone">Loading…</p>;

  if (!b) {
    return (
      <div>
        <Link href="/admin/bookings" className="text-xs font-medium uppercase tracking-[0.15em] text-brass hover:text-brass-dark">
          ← Bookings
        </Link>
        <p className="mt-6 text-sm text-stone">Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/bookings" className="text-xs font-medium uppercase tracking-[0.15em] text-brass hover:text-brass-dark">
        ← Bookings
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-light text-graphite">{b.guestName}</h1>
      <p className="mt-1 text-sm text-stone">Direct booking · Ref {b.id.slice(0, 8).toUpperCase()}</p>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-sand bg-sand sm:grid-cols-2">
        <Row label="Status" value={b.status} />
        <Row label="Guests" value={String(b.guestCount ?? "—")} />
        <Row label="Check-in" value={formatDateDisplay(b.checkIn)} />
        <Row label="Check-out" value={formatDateDisplay(b.checkOut)} />
        <Row label="Nights" value={String(b.nights)} />
        <Row label="Email" value={b.guestEmail} />
        <Row label="Phone" value={b.guestPhone || "—"} />
        <Row label="Created" value={b.createdAt ? new Date(b.createdAt).toLocaleString() : "—"} />
      </div>

      <div className="mt-6 rounded-sm border border-sand bg-cream p-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-stone">Payment</h2>
        <div className="mt-3 space-y-1 text-sm text-graphite">
          <p>Base: {formatILS(b.baseTotal)} {b.currency}</p>
          <p>Cleaning: {formatILS(b.cleaningFee)} {b.currency}</p>
          <p className="font-medium">Total: {formatILS(b.totalAmount)} {b.currency}</p>
          {b.stripePaymentIntentId && <p className="break-all text-xs text-stone">Payment ref: {b.stripePaymentIntentId}</p>}
        </div>
      </div>

      {/* Cancel/refund is wired in Phase 4 (needs the live payment provider). */}
      <div className="mt-6 rounded-sm border border-dashed border-sand bg-ivory p-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-stone">Cancellation &amp; refund</h2>
        <p className="mt-2 text-sm text-stone">
          The admin-initiated cancel + refund flow is built in Phase 4 (it needs the live payment provider).
        </p>
        <button
          disabled
          className="mt-3 cursor-not-allowed border border-sand px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-stone opacity-60"
        >
          Cancel &amp; refund (Phase 4)
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-cream px-5 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-stone">{label}</p>
      <p className="mt-0.5 text-sm text-graphite">{value || "—"}</p>
    </div>
  );
}
