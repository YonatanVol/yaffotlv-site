import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { reservations, blockedDates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendBookingConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const reservationId = session.metadata?.reservationId;

      if (!reservationId) break;

      const [reservation] = await db
        .select()
        .from(reservations)
        .where(eq(reservations.id, reservationId))
        .limit(1);

      if (!reservation || reservation.status === "confirmed") break;

      // Confirm the reservation
      await db
        .update(reservations)
        .set({
          status: "confirmed",
          stripePaymentIntentId: session.payment_intent as string,
          confirmedAt: new Date(),
        })
        .where(eq(reservations.id, reservationId));

      // Update blocked dates source from "reservation" to permanent
      await db
        .update(blockedDates)
        .set({ summary: `Confirmed: ${reservation.guestName}` })
        .where(eq(blockedDates.externalUid, reservationId));

      // Send confirmation emails
      try {
        await sendBookingConfirmation({
          guestEmail: reservation.guestEmail,
          guestName: reservation.guestName,
          checkIn: reservation.checkIn,
          checkOut: reservation.checkOut,
          nights: reservation.nights,
          totalAmount: reservation.totalAmount,
          reservationId: reservation.id,
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      const reservationId = session.metadata?.reservationId;

      if (!reservationId) break;

      // Mark reservation as expired and release dates
      await db
        .update(reservations)
        .set({ status: "expired" })
        .where(eq(reservations.id, reservationId));

      await db
        .delete(blockedDates)
        .where(eq(blockedDates.externalUid, reservationId));

      break;
    }
  }

  return NextResponse.json({ received: true });
}
