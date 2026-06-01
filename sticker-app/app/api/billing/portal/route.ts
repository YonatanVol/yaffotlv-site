import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "No subscription to manage." },
      { status: 400 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const session = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${siteUrl}/billing`,
  });

  return NextResponse.json({ url: session.url });
}
