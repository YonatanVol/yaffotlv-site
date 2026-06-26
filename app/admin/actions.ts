"use server";

import { db } from "@/lib/db";
import {
  reservations,
  blockedDates,
  pricingRules,
  calendarSyncLog,
  seasonalRates,
  priceOverrides,
} from "@/lib/db/schema";
import { eq, desc, and, gte, sql, inArray } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { todayJerusalem, dateRange, addDays } from "@/lib/dates";
import { pricingUpdateSchema, manualBlockSchema, seasonSchema, overrideSchema } from "@/lib/validation";
import { runCalendarSync } from "@/lib/calendar-sync";
import { quoteForRange } from "@/lib/pricing-data";

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

/** One row in the unified bookings view (direct reservations + external platform blocks). */
interface UnifiedBooking {
  id: string;
  kind: "direct" | "external";
  source: "direct" | "airbnb" | "booking_com";
  guestName: string | null;
  guestEmail: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number | null;
  status: string | null;
  createdAt: string | null;
}

/** All reservations across direct + Airbnb + Booking, in one labelled, filterable list. */
export async function getUnifiedBookings(filters?: {
  source?: string;
  status?: string;
}): Promise<UnifiedBooking[]> {
  await requireAdmin();

  // Direct reservations — full detail.
  const directRows = await db.select().from(reservations).orderBy(desc(reservations.createdAt));
  const direct: UnifiedBooking[] = directRows.map((r) => ({
    id: r.id,
    kind: "direct",
    source: "direct",
    guestName: r.guestName,
    guestEmail: r.guestEmail,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    nights: r.nights,
    amount: r.totalAmount,
    status: r.status,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
  }));

  // External blocks (Airbnb / Booking) — coalesce per (source, externalUid) into ranges.
  const ext = await db
    .select()
    .from(blockedDates)
    .where(inArray(blockedDates.source, ["airbnb", "booking_com"]));
  const groups = new Map<string, { source: string; uid: string; summary: string | null; dates: string[] }>();
  for (const b of ext) {
    const key = `${b.source}:${b.externalUid ?? ""}`;
    const g = groups.get(key);
    if (g) g.dates.push(b.date);
    else groups.set(key, { source: b.source, uid: b.externalUid ?? "", summary: b.summary, dates: [b.date] });
  }
  const external: UnifiedBooking[] = [...groups.values()].map((g) => {
    const sorted = [...g.dates].sort();
    return {
      id: `${g.source}:${g.uid}`,
      kind: "external" as const,
      source: g.source as "airbnb" | "booking_com",
      guestName: g.summary,
      guestEmail: null,
      checkIn: sorted[0],
      checkOut: addDays(sorted[sorted.length - 1], 1),
      nights: sorted.length,
      amount: null,
      status: "confirmed",
      createdAt: null,
    };
  });

  let all = [...direct, ...external];
  if (filters?.source) all = all.filter((b) => b.source === filters.source);
  if (filters?.status) all = all.filter((b) => b.status === filters.status);
  all.sort((a, b) => (a.checkIn < b.checkIn ? 1 : a.checkIn > b.checkIn ? -1 : 0));
  return all;
}

/** Full detail for a single direct reservation (external blocks have no extra detail). */
export async function getBookingDetail(
  id: string
): Promise<typeof reservations.$inferSelect | null> {
  await requireAdmin();
  const [r] = await db.select().from(reservations).where(eq(reservations.id, id)).limit(1);
  return r ?? null;
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
  // Call the sync directly — no self-HTTP round trip, no CRON_SECRET needed,
  // and no base-URL guessing (the old version had an operator-precedence bug).
  return runCalendarSync();
}

/** Latest sync result per source (for the admin sync-status panel). */
export async function getSyncStatus() {
  await requireAdmin();
  const rows = await db
    .select()
    .from(calendarSyncLog)
    .orderBy(desc(calendarSyncLog.createdAt))
    .limit(50);
  const latest: Record<string, (typeof rows)[number]> = {};
  for (const r of rows) {
    if (!latest[r.source]) latest[r.source] = r;
  }
  return Object.values(latest).map((r) => ({
    source: r.source,
    status: r.status,
    count: r.count,
    message: r.message,
    at: r.createdAt ? new Date(r.createdAt).toISOString() : null,
  }));
}

/** Manually block a contiguous range of nights [start, end] (inclusive). Flows to the published iCal. */
export async function blockDateRange(startStr: string, endStr: string) {
  await requireAdmin();
  const { date: start } = manualBlockSchema.parse({ date: startStr });
  const { date: end } = manualBlockSchema.parse({ date: endStr });
  const last = end >= start ? end : start; // tolerate reversed input
  const dates = dateRange(start, addDays(last, 1)); // inclusive of `last`
  if (dates.length === 0) return;
  await db
    .insert(blockedDates)
    .values(
      dates.map((d) => ({
        date: d,
        source: "manual" as const,
        externalUid: `manual-${d}`,
        summary: "Manually blocked",
      }))
    )
    .onConflictDoNothing();
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
    saturdayRate: number;
    cleaningFee: number;
    minNights: number;
    lastMinuteDiscountPct: number;
    lastMinuteDays: number;
    longStay7Pct: number;
    longStay28Pct: number;
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

// --- Seasonal pricing windows ---

export async function getSeasons() {
  await requireAdmin();
  return db.select().from(seasonalRates).orderBy(seasonalRates.startDate);
}

export async function addSeason(data: {
  name: string;
  startDate: string;
  endDate: string;
  adjustmentPct: number;
}) {
  await requireAdmin();
  const clean = seasonSchema.parse(data);
  await db.insert(seasonalRates).values({ ...clean, isActive: true });
}

export async function removeSeason(id: string) {
  await requireAdmin();
  await db.delete(seasonalRates).where(eq(seasonalRates.id, id));
}

// --- Per-date price overrides ---

export async function getOverrides() {
  await requireAdmin();
  return db.select().from(priceOverrides).orderBy(priceOverrides.date);
}

/** Set/replace the override price (given in ILS) for a single date. */
export async function setOverride(date: string, priceIls: number) {
  await requireAdmin();
  const clean = overrideSchema.parse({ date, price: Math.round(priceIls * 100) });
  await db
    .insert(priceOverrides)
    .values({ date: clean.date, price: clean.price })
    .onConflictDoUpdate({ target: priceOverrides.date, set: { price: clean.price } });
}

export async function removeOverride(id: string) {
  await requireAdmin();
  await db.delete(priceOverrides).where(eq(priceOverrides.id, id));
}

/** Admin price preview for a date range (uses the same server-authoritative engine). */
export async function previewQuote(checkIn: string, checkOut: string) {
  await requireAdmin();
  const result = await quoteForRange(checkIn, checkOut);
  return result?.quote ?? null;
}
