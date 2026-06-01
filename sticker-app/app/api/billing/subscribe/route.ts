import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { spUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Billing is not configured." },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Reuse or create the Stripe customer.
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await db
      .update(spUsers)
      .set({ stripeCustomerId: customerId, updatedAt: new Date() })
      .where(eq(spUsers.id, user.id));
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: user.id },
    subscription_data: { metadata: { userId: user.id } },
    success_url: `${siteUrl}/billing?success=1`,
    cancel_url: `${siteUrl}/billing?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
