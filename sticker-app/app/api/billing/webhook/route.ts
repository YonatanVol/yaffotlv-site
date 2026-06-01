import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { spUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Stripe requires the raw request body for signature verification.
function subscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  // `current_period_end` lives on the subscription in older API versions and on
  // subscription items in newer ones; check both.
  const fromItem = sub.items?.data?.[0]?.current_period_end;
  const fromSub = (sub as unknown as { current_period_end?: number })
    .current_period_end;
  const ts = fromItem ?? fromSub;
  return ts ? new Date(ts * 1000) : null;
}

async function setPlanByCustomer(
  customerId: string,
  values: Partial<typeof spUsers.$inferInsert>
) {
  await db
    .update(spUsers)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(spUsers.stripeCustomerId, customerId));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string | null;
      const subscriptionId = session.subscription as string | null;
      if (!customerId || !subscriptionId) break;

      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      await setPlanByCustomer(customerId, {
        plan: "pro",
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: sub.status,
        subscriptionPeriodEnd: subscriptionPeriodEnd(sub),
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const active = sub.status === "active" || sub.status === "trialing";
      await setPlanByCustomer(customerId, {
        plan: active ? "pro" : "free",
        subscriptionStatus: sub.status,
        subscriptionPeriodEnd: subscriptionPeriodEnd(sub),
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      await setPlanByCustomer(customerId, {
        plan: "free",
        subscriptionStatus: "canceled",
        subscriptionPeriodEnd: null,
        stripeSubscriptionId: null,
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      await setPlanByCustomer(customerId, { subscriptionStatus: "past_due" });
      // Optional dunning email via Resend could be sent here.
      break;
    }
  }

  return NextResponse.json({ received: true });
}
