import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getStripeWebhookSecret } from "@/lib/env";
import { db } from "@/lib/db";
import { reservations, blockedDates, processedWebhookEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendBookingConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
  // Next 16: read the RAW body for signature verification (do not parse first).
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, getStripeWebhookSecret());
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // --- Idempotency / replay guard ---
  // Atomically "claim" this event id. If the row already exists, this is a
  // duplicate or replay → no-op. The claim is released below if processing
  // throws, so Stripe's automatic retry can reprocess a genuinely failed event.
  const [claim] = await db
    .insert(processedWebhookEvents)
    .values({ eventId: event.id, provider: "stripe" })
    .onConflictDoNothing()
    .returning({ eventId: processedWebhookEvents.eventId });

  if (!claim) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
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

        // Send confirmation emails (non-fatal — a mail failure must not 500 the webhook)
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
  } catch (err) {
    // Release the idempotency claim so Stripe's retry can reprocess this event.
    console.error("Webhook processing error:", err);
    await db
      .delete(processedWebhookEvents)
      .where(eq(processedWebhookEvents.eventId, event.id))
      .catch(() => {});
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
