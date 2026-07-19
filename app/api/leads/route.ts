import { NextRequest, NextResponse } from "next/server";
import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

/**
 * Records an enquiry that was started but not submitted.
 *
 * Called when a guest finishes entering their email in the booking form, along
 * with whatever they had selected at that point, so the owner can follow up on
 * drop-offs. One row per email: a repeat visit updates the existing record and
 * only ever moves `stage` forward.
 */
const schema = z.object({
  email: z.string().email().max(200),
  name: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests: z.number().int().min(1).max(20).optional(),
  stage: z.enum(["typed_email", "filled_details", "submitted"]).default("typed_email"),
  sessionId: z.string().max(100).optional(),
  locale: z.string().max(10).optional(),
  referrer: z.string().max(500).optional(),
});

const STAGE_RANK = { typed_email: 0, filled_details: 1, submitted: 2 } as const;

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const input = parsed.data;
    const email = input.email.trim().toLowerCase();

    const { db } = await import("@/lib/db");
    const [existing] = await db.select().from(leads).where(eq(leads.email, email)).limit(1);

    if (!existing) {
      await db.insert(leads).values({ ...input, email });
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // Someone who already unsubscribed must not be revived by a later visit.
    if (existing.status === "unsubscribed") {
      return NextResponse.json({ ok: true });
    }

    await db
      .update(leads)
      .set({
        name: input.name ?? existing.name,
        phone: input.phone ?? existing.phone,
        checkIn: input.checkIn ?? existing.checkIn,
        checkOut: input.checkOut ?? existing.checkOut,
        guests: input.guests ?? existing.guests,
        stage:
          STAGE_RANK[input.stage] > STAGE_RANK[existing.stage as keyof typeof STAGE_RANK]
            ? input.stage
            : existing.stage,
        sessionId: input.sessionId ?? existing.sessionId,
        locale: input.locale ?? existing.locale,
        referrer: input.referrer ?? existing.referrer,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, existing.id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead capture error:", error);
    // Never block the booking flow because a lead failed to save.
    return NextResponse.json({ ok: true });
  }
}
