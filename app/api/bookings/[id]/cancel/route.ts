import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reservations, blockedDates } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { sendCancellationConfirmation } from "@/lib/email";
import { getSession } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Money movement: admin-only. (Phase 4 will build the full admin-initiated
    // cancellation/refund UX on top of this guard.)
    if (!(await getSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [reservation] = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id))
      .limit(1);

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    if (reservation.status !== "confirmed") {
      return NextResponse.json({ error: "Only confirmed bookings can be cancelled" }, { status: 400 });
    }

    // Check cancellation policy: full refund up to 24h before check-in
    const checkInDate = new Date(reservation.checkIn + "T15:00:00+03:00"); // 3PM Jerusalem
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      return NextResponse.json(
        { error: "Cancellation is only available up to 24 hours before check-in" },
        { status: 400 }
      );
    }

    // Issue Stripe refund
    if (reservation.stripePaymentIntentId) {
      await getStripe().refunds.create({
        payment_intent: reservation.stripePaymentIntentId,
      });
    }

    // Update reservation
    await db
      .update(reservations)
      .set({ status: "cancelled", cancelledAt: new Date() })
      .where(eq(reservations.id, id));

    // Release blocked dates
    await db
      .delete(blockedDates)
      .where(eq(blockedDates.externalUid, id));

    // Send cancellation emails
    try {
      await sendCancellationConfirmation({
        guestEmail: reservation.guestEmail,
        guestName: reservation.guestName,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
      });
    } catch (emailError) {
      console.error("Failed to send cancellation email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancellation error:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
