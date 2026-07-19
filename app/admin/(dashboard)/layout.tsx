import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <nav className="border-b border-sand bg-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-serif text-xl font-light text-graphite">
            YaffoTLV Admin
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin/bookings" className="text-xs font-medium uppercase tracking-[0.15em] text-stone transition-colors hover:text-brass">
              Bookings
            </Link>
            <Link href="/admin/calendar" className="text-xs font-medium uppercase tracking-[0.15em] text-stone transition-colors hover:text-brass">
              Calendar
            </Link>
            <Link href="/admin/pricing" className="text-xs font-medium uppercase tracking-[0.15em] text-stone transition-colors hover:text-brass">
              Pricing
            </Link>
            <Link href="/admin/photos" className="text-xs font-medium uppercase tracking-[0.15em] text-stone transition-colors hover:text-brass">
              Photos
            </Link>
            <Link href="/" className="text-xs text-stone transition-colors hover:text-brass">
              View Site
            </Link>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
