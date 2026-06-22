"use server";

import { db } from "@/lib/db";
import { reservations, blockedDates, pricingRules } from "@/lib/db/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { todayJerusalem, dateRange } from "@/lib/dates";
import { pricingUpdateSchema, manualBlockSchema } from "@/lib/validation";

async function requireAdmin() {
  const isAdmin = await getSession();
  if (!isAdmin) throw new Error("Unauthorized");
}

export async function getUpcomingBookings() {
  await requireAdmin();
  const today = todayJerusalem();
  return db
    .select()
    .from(reservations)
    .where(and(eq(reservations.status, "confirmed"), gte(reservations.checkIn, today)))
    .orderBy(reservations.checkIn);
}

export async function getAllBookings(statusFilter?: string) {
  await requireAdmin();
  const conditions = statusFilter ? [eq(reservations.status, statusFilter as "draft" | "pending_payment" | "confirmed" | "cancelled" | "expired")] : [];
  return db
    .select()
    .from(reservations)
    .where(conditions.length ? conditions[0] : undefined)
    .orderBy(desc(reservations.createdAt));
}

export async function getDashboardStats() {
  await requireAdmin();
  const today = todayJerusalem();

  const [upcoming] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reservations)
    .where(and(eq(reservations.status, "confirmed"), gte(reservations.checkIn, today)));

  const [totalRevenue] = await db
    .select({ total: sql<number>`coalesce(sum(${reservations.totalAmount}), 0)` })
    .from(reservations)
    .where(eq(reservations.status, "confirmed"));

  const [totalBookings] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reservations)
    .where(eq(reservations.status, "confirmed"));

  return {
    upcomingCount: Number(upcoming.count),
    totalRevenue: Number(totalRevenue.total),
    totalBookings: Number(totalBookings.count),
  };
}

export async function getBlockedDatesAdmin() {
  await requireAdmin();
  return db.select().from(blockedDates).orderBy(blockedDates.date);
}

export async function blockDateManually(dateStr: string) {
  await requireAdmin();
  const { date } = manualBlockSchema.parse({ date: dateStr });
  await db
    .insert(blockedDates)
    .values({
      date,
      source: "manual",
      externalUid: `manual-${date}`,
      summary: "Manually blocked",
    })
    .onConflictDoNothing();
}

export async function unblockDate(id: string) {
  await requireAdmin();
  await db.delete(blockedDates).where(and(eq(blockedDates.id, id), eq(blockedDates.source, "manual")));
}

export async function triggerCalendarSync() {
  await requireAdmin();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/cron/sync-calendars`, {
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  return res.json();
}

export async function getPricingRules() {
  await requireAdmin();
  return db.select().from(pricingRules).where(eq(pricingRules.isActive, true));
}

export async function updatePricingRule(
  id: string,
  data: {
    baseRateNight: number;
    thursdayRate: number;
    fridayRate: number;
    cleaningFee: number;
    minNights: number;
  }
) {
  await requireAdmin();
  const clean = pricingUpdateSchema.parse(data);
  await db
    .update(pricingRules)
    .set({
      ...clean,
      updatedAt: new Date(),
    })
    .where(eq(pricingRules.id, id));
}
