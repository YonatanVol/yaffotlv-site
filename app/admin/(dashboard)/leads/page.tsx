import { getLeads } from "@/app/admin/leads-actions";
import { LeadsTable } from "@/components/admin/leads-table";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await getLeads();
  const unfinished = leads.filter((l) => l.stage !== "submitted" && l.status === "new");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-light text-graphite">Enquiries</h1>
        <p className="mt-2 text-sm text-stone">
          People who started a booking and gave an email. {unfinished.length} still need following up.
        </p>
      </header>

      {leads.length === 0 ? (
        <p className="rounded-sm border border-dashed border-sand p-8 text-center text-sm text-stone">
          No enquiries recorded yet. They appear here as soon as a guest enters their email in the
          booking form.
        </p>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
