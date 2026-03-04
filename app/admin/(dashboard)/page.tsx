import Link from "next/link";
import { getDashboardStats, getUpcomingBookings } from "../actions";
import { formatILS } from "@/lib/pricing";

export default async function AdminDashboard() {
  let stats = { upcomingCount: 0, totalRevenue: 0, totalBookings: 0 };
  let upcoming: Awaited<ReturnType<typeof getUpcomingBookings>> = [];

  try {
    [stats, upcoming] = await Promise.all([getDashboardStats(), getUpcomingBookings()]);
  } catch {
    // DB not connected yet — show empty state
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-graphite">Dashboard</h1>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-sand bg-cream p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone">Upcoming</p>
          <p className="mt-2 font-serif text-3xl text-brass">{stats.upcomingCount}</p>
        </div>
        <div className="border border-sand bg-cream p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone">Total Bookings</p>
          <p className="mt-2 font-serif text-3xl text-brass">{stats.totalBookings}</p>
        </div>
        <div className="border border-sand bg-cream p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone">Total Revenue</p>
          <p className="mt-2 font-serif text-3xl text-brass">{formatILS(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-light text-graphite">Upcoming Bookings</h2>
          <Link
            href="/admin/bookings"
            className="text-xs font-medium uppercase tracking-[0.15em] text-brass hover:text-brass-dark"
          >
            View All
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <p className="mt-4 text-sm text-stone">No upcoming bookings.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {upcoming.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border border-sand bg-cream px-5 py-4">
                <div>
                  <p className="font-medium text-graphite">{booking.guestName}</p>
                  <p className="text-sm text-stone">
                    {booking.checkIn} → {booking.checkOut} · {booking.nights} night{booking.nights > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="font-medium text-brass">{formatILS(booking.totalAmount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/calendar"
          className="border border-brass/40 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-brass transition-colors hover:bg-brass hover:text-white"
        >
          Manage Calendar
        </Link>
        <Link
          href="/admin/pricing"
          className="border border-brass/40 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-brass transition-colors hover:bg-brass hover:text-white"
        >
          Edit Pricing
        </Link>
      </div>
    </div>
  );
}
