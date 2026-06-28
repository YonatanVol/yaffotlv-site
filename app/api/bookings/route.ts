import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blockedDates, reservations } from "@/lib/db/schema";
import { dateRange, todayJerusalem } from "@/lib/dates";
import { inArray, eq } from "drizzle-orm";
import { bookingSchema, firstError } from "@/lib/validation";
import { quoteForRange } from "@/lib/pricing-data";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = bookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
    }
    const { checkIn, checkOut, guestName, guestEmail, guestPhone, guestCount, promoCode } = parsed.data;

    // Check-in must be today or later (Jerusalem). Date ordering + guest-count
    // bounds + email shape are enforced by bookingSchema.
    if (checkIn < todayJerusalem()) {
      return NextResponse.json({ error: "Check-in must be today or later" }, { status: 400 });
    }

    // --- Double-booking prevention ---
    const requestedDates = dateRange(checkIn, checkOut);

    const existingBlocks = await db
      .select({ date: blockedDates.date })
      .from(blockedDates)
      .where(inArray(blockedDates.date, requestedDates));

    if (existingBlocks.length > 0) {
      return NextResponse.json(
        { error: "Some of your selected dates are no longer available. Please refresh and try again." },
        { status: 409 }
      );
    }

    // --- Price calculation (server-authoritative: seasons + overrides + discounts) ---
    const priced = await quoteForRange(checkIn, checkOut, promoCode);
    if (!priced) {
      return NextResponse.json({ error: "Pricing not configured" }, { status: 500 });
    }
    if (priced.quote.nights < priced.rule.minNights) {
      return NextResponse.json(
        { error: `Minimum stay is ${priced.rule.minNights} night(s)` },
        { status: 400 }
      );
    }
    const quote = priced.quote;

    // --- Create draft reservation ---
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const [reservation] = await db
      .insert(reservations)
      .values({
        status: "draft",
        checkIn,
        checkOut,
        nights: quote.nights,
        guestName,
        guestEmail,
        guestPhone: guestPhone || null,
        guestCount: guestCount || 1,
        baseTotal: quote.baseTotal,
        cleaningFee: quote.cleaningFee,
        totalAmount: quote.totalAmount,
        currency: quote.currency,
        expiresAt,
      })
      .returning();

    // --- Block dates atomically ---
    // The partial unique index `blocked_reservation_date_unique` enforces at most
    // one direct-reservation hold per date. A concurrent booking that slips past the
    // pre-check above will collide here; on conflict we roll back the just-created
    // draft and return 409. This is the real concurrency guard (the SELECT above is
    // only a fast UX path and also catches airbnb/booking/manual blocks).
    try {
      await db.insert(blockedDates).values(
        requestedDates.map((date) => ({
          date,
          source: "reservation" as const,
          externalUid: reservation.id,
          summary: `Draft: ${guestName}`,
        }))
      );
    } catch (e) {
      await db.delete(reservations).where(eq(reservations.id, reservation.id)).catch(() => {});
      const err = e as { code?: string; message?: string };
      const isUnique = err?.code === "23505" || /duplicate key|unique/i.test(err?.message ?? "");
      if (isUnique) {
        return NextResponse.json(
          { error: "Some of your selected dates are no longer available. Please refresh and try again." },
          { status: 409 }
        );
      }
      throw e; // unexpected — bubble to the 500 handler (draft already cleaned up)
    }

    return NextResponse.json({
      reservationId: reservation.id,
      quote,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
