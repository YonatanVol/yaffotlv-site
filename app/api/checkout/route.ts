import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { reservationId } = await request.json();

    if (!reservationId) {
      return NextResponse.json({ error: "Reservation ID required" }, { status: 400 });
    }

    const [reservation] = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId))
      .limit(1);

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    if (reservation.status !== "draft") {
      return NextResponse.json({ error: "Reservation already processed" }, { status: 400 });
    }

    if (reservation.expiresAt && new Date(reservation.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Reservation expired. Please start again." }, { status: 410 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      currency: "ils",
      line_items: [
        {
          price_data: {
            currency: "ils",
            unit_amount: reservation.baseTotal,
            product_data: {
              name: `YaffoTLV - ${reservation.nights} night${reservation.nights > 1 ? "s" : ""}`,
              description: `${reservation.checkIn} to ${reservation.checkOut}`,
            },
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "ils",
            unit_amount: reservation.cleaningFee,
            product_data: {
              name: "Cleaning fee",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        reservationId: reservation.id,
      },
      customer_email: reservation.guestEmail,
      success_url: `${siteUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/booking/cancel?reservation_id=${reservation.id}`,
    });

    await db
      .update(reservations)
      .set({ status: "pending_payment", stripeSessionId: session.id })
      .where(eq(reservations.id, reservation.id));

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
