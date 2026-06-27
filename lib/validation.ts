import { z } from "zod";

/** Maximum guests the apartment sleeps — matches the booking UI <select> (1–8). */
export const MAX_GUESTS = 8;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A calendar date string "YYYY-MM-DD" that resolves to a real date. */
const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine((s) => !Number.isNaN(new Date(`${s}T12:00:00`).getTime()), "Invalid date");

const email = z.string().trim().max(200).regex(EMAIL_RE, "Invalid email address");

/** POST /api/bookings — creates a draft reservation + payment hold. */
export const bookingSchema = z
  .object({
    checkIn: dateString,
    checkOut: dateString,
    guestName: z.string().trim().min(1, "Name is required").max(100),
    guestEmail: email,
    guestPhone: z.string().trim().max(40).optional().nullable(),
    guestCount: z.coerce.number().int().min(1).max(MAX_GUESTS).default(1),
    promoCode: z.string().trim().max(40).optional(),
  })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

/** POST /api/price-quote — server-authoritative price calculation. */
export const priceQuoteSchema = z
  .object({ checkIn: dateString, checkOut: dateString, promoCode: z.string().trim().max(40).optional() })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

/** POST /api/contact — contact form. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email,
  message: z.string().trim().min(1, "Message is required").max(5000),
});

// Money bounds expressed in agorot (ILS cents): 0 .. 100,000 ILS.
const agorot = z.coerce.number().int().min(0).max(10_000_000);
const pct = z.coerce.number().int().min(0).max(90);

/** Admin: update pricing rule (server action). */
export const pricingUpdateSchema = z.object({
  baseRateNight: agorot,
  thursdayRate: agorot,
  fridayRate: agorot,
  saturdayRate: agorot,
  cleaningFee: agorot,
  minNights: z.coerce.number().int().min(1).max(30),
  lastMinuteDiscountPct: pct,
  lastMinuteDays: z.coerce.number().int().min(0).max(60),
  longStay7Pct: pct,
  longStay28Pct: pct,
});

/** Admin: add a seasonal pricing window. */
export const seasonSchema = z
  .object({
    name: z.string().trim().min(1).max(60),
    startDate: dateString,
    endDate: dateString,
    adjustmentPct: z.coerce.number().int().min(-90).max(300),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

/** Admin: set a per-date price override (price in agorot). */
export const overrideSchema = z.object({
  date: dateString,
  price: agorot,
});

/** Admin: create a promo code. */
export const promoCodeCreateSchema = z.object({
  code: z.string().trim().min(2).max(40).regex(/^[A-Za-z0-9_-]+$/, "Use letters, numbers, - or _ only"),
  discountPct: z.coerce.number().int().min(1).max(90),
  maxUses: z.coerce.number().int().min(1).max(100000).optional().nullable(),
  expiresAt: dateString.optional().nullable(),
});

/** Admin: manually block a date (server action). */
export const manualBlockSchema = z.object({ date: dateString });

/** First human-readable error message from a ZodError, for API responses. */
export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input";
}
