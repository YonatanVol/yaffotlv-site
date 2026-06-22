import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pricingRules } from "@/lib/db/schema";
import { calculatePrice } from "@/lib/pricing";
import { countNights, todayJerusalem } from "@/lib/dates";
import { eq } from "drizzle-orm";
import { priceQuoteSchema, firstError } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = priceQuoteSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
    }
    const { checkIn, checkOut } = parsed.data;

    if (checkIn < todayJerusalem()) {
      return NextResponse.json({ error: "Check-in must be today or later" }, { status: 400 });
    }

    const [rule] = await db
      .select()
      .from(pricingRules)
      .where(eq(pricingRules.isActive, true))
      .limit(1);

    if (!rule) {
      return NextResponse.json({ error: "No pricing rule configured" }, { status: 500 });
    }

    const nights = countNights(checkIn, checkOut);
    if (nights < rule.minNights) {
      return NextResponse.json(
        { error: `Minimum stay is ${rule.minNights} night(s)` },
        { status: 400 }
      );
    }

    const quote = calculatePrice(checkIn, checkOut, rule);
    return NextResponse.json(quote);
  } catch (error) {
    console.error("Price quote error:", error);
    return NextResponse.json({ error: "Failed to calculate price" }, { status: 500 });
  }
}
