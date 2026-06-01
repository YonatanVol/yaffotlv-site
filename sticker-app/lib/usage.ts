import { db } from "@/lib/db";
import { spUsage } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const FREE_MONTHLY_LIMIT = 5;
export const PRO_MONTHLY_LIMIT = 300; // soft cap to deter abuse

export function currentPeriodKey(date = new Date()): string {
  return date.toISOString().slice(0, 7); // "YYYY-MM"
}

export function limitForPlan(plan: "free" | "pro"): number {
  return plan === "pro" ? PRO_MONTHLY_LIMIT : FREE_MONTHLY_LIMIT;
}

export async function getStickersConverted(
  userId: string,
  periodKey = currentPeriodKey()
): Promise<number> {
  const [row] = await db
    .select({ count: spUsage.stickersConverted })
    .from(spUsage)
    .where(and(eq(spUsage.userId, userId), eq(spUsage.periodKey, periodKey)))
    .limit(1);
  return row?.count ?? 0;
}

export interface QuotaResult {
  ok: boolean;
  limit: number;
  used: number;
  remaining: number;
}

/**
 * Check whether `count` more conversions fit within the user's monthly quota,
 * and if so, atomically increment the usage counter. Returns a structured result;
 * callers translate a failure into HTTP 402.
 */
export async function reserveStickerQuota(
  userId: string,
  plan: "free" | "pro",
  count: number
): Promise<QuotaResult> {
  const periodKey = currentPeriodKey();
  const limit = limitForPlan(plan);
  const used = await getStickersConverted(userId, periodKey);

  if (used + count > limit) {
    return { ok: false, limit, used, remaining: Math.max(0, limit - used) };
  }

  await db
    .insert(spUsage)
    .values({ userId, periodKey, stickersConverted: count })
    .onConflictDoUpdate({
      target: [spUsage.userId, spUsage.periodKey],
      set: {
        stickersConverted: sql`${spUsage.stickersConverted} + ${count}`,
        updatedAt: new Date(),
      },
    });

  return { ok: true, limit, used: used + count, remaining: limit - used - count };
}

export async function incrementPacksCreated(userId: string): Promise<void> {
  const periodKey = currentPeriodKey();
  await db
    .insert(spUsage)
    .values({ userId, periodKey, packsCreated: 1 })
    .onConflictDoUpdate({
      target: [spUsage.userId, spUsage.periodKey],
      set: {
        packsCreated: sql`${spUsage.packsCreated} + 1`,
        updatedAt: new Date(),
      },
    });
}
