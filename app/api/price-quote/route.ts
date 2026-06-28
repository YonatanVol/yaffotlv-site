import { NextRequest, NextResponse } from "next/server";
import { todayJerusalem } from "@/lib/dates";
import { priceQuoteSchema, firstError } from "@/lib/validation";
import { quoteForRange } from "@/lib/pricing-data";

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = priceQuoteSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
    }
    const { checkIn, checkOut, promoCode } = parsed.data;

    if (checkIn < todayJerusalem()) {
      return NextResponse.json({ error: "Check-in must be today or later" }, { status: 400 });
    }

    const result = await quoteForRange(checkIn, checkOut, promoCode);
    if (!result) {
      return NextResponse.json({ error: "No pricing rule configured" }, { status: 500 });
    }
    if (result.quote.nights < result.rule.minNights) {
      return NextResponse.json(
        { error: `Minimum stay is ${result.rule.minNights} night(s)` },
        { status: 400 }
      );
    }

    // promoValid distinguishes "no code" from "invalid code" for the UI.
    return NextResponse.json({ ...result.quote, promoValid: result.promoValid });
  } catch (error) {
    console.error("Price quote error:", error);
    return NextResponse.json({ error: "Failed to calculate price" }, { status: 500 });
  }
}
