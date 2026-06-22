import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blockedDates, reservations, pricingRules } from "@/lib/db/schema";
import { calculatePrice } from "@/lib/pricing";
import { dateRange, todayJerusalem, countNights } from "@/lib/dates";
import { inArray, eq } from "drizzle-orm";
import { bookingSchema, firstError } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = bookingSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
    }
    const { checkIn, checkOut, guestName, guestEmail, guestPhone, guestCount } = parsed.data;

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

    // --- Price calculation ---
    const [rule] = await db
      .select()
      .from(pricingRules)
      .where(eq(pricingRules.isActive, true))
      .limit(1);

    if (!rule) {
      return NextResponse.json({ error: "Pricing not configured" }, { status: 500 });
    }

    const nights = countNights(checkIn, checkOut);
    if (nights < rule.minNights) {
      return NextResponse.json(
        { error: `Minimum stay is ${rule.minNights} night(s)` },
        { status: 400 }
      );
    }

    const quote = calculatePrice(checkIn, checkOut, rule);

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

    // --- Block dates immediately ---
    await db.insert(blockedDates).values(
      requestedDates.map((date) => ({
        date,
        source: "reservation" as const,
        externalUid: reservation.id,
        summary: `Draft: ${guestName}`,
      }))
    );

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
