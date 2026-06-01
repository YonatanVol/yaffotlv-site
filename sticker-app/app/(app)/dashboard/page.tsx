import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { spPacks } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  getStickersConverted,
  limitForPlan,
  currentPeriodKey,
} from "@/lib/usage";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = (await getCurrentUser())!;
  const used = await getStickersConverted(user.id);
  const limit = limitForPlan(user.plan);
  const pct = Math.min(100, Math.round((used / limit) * 100));

  const packs = await db
    .select()
    .from(spPacks)
    .where(eq(spPacks.userId, user.id))
    .orderBy(desc(spPacks.createdAt))
    .limit(10);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/extract">
          <Button>New pack</Button>
        </Link>
      </div>

      {/* Usage */}
      <section className="rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Conversions this month ({currentPeriodKey()})
          </span>
          <span className="text-slate-500">
            {used} / {limit}
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600"
            style={{ width: `${pct}%` }}
          />
        </div>
        {user.plan === "free" && used >= limit && (
          <p className="mt-3 text-sm text-slate-600">
            You&apos;ve hit your free limit.{" "}
            <Link href="/billing" className="font-semibold text-indigo-600">
              Upgrade to Pro
            </Link>{" "}
            for more.
          </p>
        )}
      </section>

      {/* Recent packs */}
      <section>
        <h2 className="text-lg font-semibold">Recent packs</h2>
        {packs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No packs yet.{" "}
            <Link href="/extract" className="font-semibold text-indigo-600">
              Create your first one.
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200">
            {packs.map((p) => (
              <li key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.stickerCount} stickers · {p.status}
                  </p>
                </div>
                {p.status === "ready" && (
                  <Link href={`/download/${p.id}`}>
                    <Button variant="secondary">Download</Button>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
