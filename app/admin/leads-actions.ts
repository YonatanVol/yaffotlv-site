"use server";

import { leads } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendEnquiryFollowUp } from "@/lib/email";

async function requireAdmin() {
  if (!(await getSession())) throw new Error("Unauthorized");
}

export async function getLeads() {
  await requireAdmin();
  try {
    const { db } = await import("@/lib/db");
    return await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(200);
  } catch {
    // Migration not applied yet — show an empty list rather than crashing.
    return [];
  }
}

export async function setLeadStatus(
  id: string,
  status: "new" | "contacted" | "converted" | "unsubscribed"
) {
  await requireAdmin();
  const { db } = await import("@/lib/db");
  await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id));
  revalidatePath("/admin/leads");
}

/** Send the one-off "you didn't finish" email, then mark the lead contacted. */
export async function sendFollowUp(id: string) {
  await requireAdmin();
  const { db } = await import("@/lib/db");
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) return { ok: false, error: "Lead not found" };
  if (lead.status === "unsubscribed") {
    return { ok: false, error: "This guest unsubscribed — not sending." };
  }

  const result = await sendEnquiryFollowUp({
    to: lead.email,
    name: lead.name,
    checkIn: lead.checkIn,
    checkOut: lead.checkOut,
    unsubscribeToken: lead.unsubscribeToken,
  });
  if (!result.ok) return result;

  await db
    .update(leads)
    .set({ status: "contacted", followUpSentAt: new Date(), updatedAt: new Date() })
    .where(eq(leads.id, id));
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function deleteLead(id: string) {
  await requireAdmin();
  const { db } = await import("@/lib/db");
  await db.delete(leads).where(eq(leads.id, id));
  revalidatePath("/admin/leads");
}
