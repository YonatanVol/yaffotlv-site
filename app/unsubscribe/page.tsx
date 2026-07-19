import { leads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe target for follow-up emails. Matching on the per-lead
 * token means no login is needed and one link can only ever affect one record.
 */
async function unsubscribe(token: string): Promise<boolean> {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return false;
  try {
    const { db } = await import("@/lib/db");
    const result = await db
      .update(leads)
      .set({ status: "unsubscribed", updatedAt: new Date() })
      .where(eq(leads.unsubscribeToken, token))
      .returning({ id: leads.id });
    return result.length > 0;
  } catch {
    return false;
  }
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const done = token ? await unsubscribe(token) : false;

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl font-light text-charcoal">
          {done ? "You're unsubscribed" : "Link not recognised"}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone">
          {done
            ? "We won't email you about your enquiry again. You're welcome back any time."
            : "That unsubscribe link is invalid or has already been used. If you keep receiving emails, reply to one and we'll remove you."}
        </p>
        <a
          href="/"
          className="mt-8 inline-block border border-accent px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-white"
        >
          Back to YaffoTLV
        </a>
      </div>
    </main>
  );
}
