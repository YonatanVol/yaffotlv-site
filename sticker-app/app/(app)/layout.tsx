import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/logout-button";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "StickerPack";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/extract", label: "Extract" },
  { href: "/builder", label: "Build pack" },
  { href: "/billing", label: "Billing" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold tracking-tight">
              {appName}
            </Link>
            <nav className="hidden gap-4 text-sm text-slate-600 sm:flex">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-slate-900">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              {user.email}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase">
              {user.plan}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
