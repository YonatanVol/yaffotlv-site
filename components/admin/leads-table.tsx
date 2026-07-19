"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLead, sendFollowUp, setLeadStatus } from "@/app/admin/leads-actions";

interface Lead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  stage: string;
  status: "new" | "contacted" | "converted" | "unsubscribed";
  locale: string | null;
  referrer: string | null;
  followUpSentAt: Date | null;
  createdAt: Date;
}

const STAGE_LABEL: Record<string, string> = {
  typed_email: "Left after email",
  filled_details: "Filled details",
  submitted: "Submitted",
};

const STATUS_TONE: Record<Lead["status"], string> = {
  new: "bg-amber-50 text-amber-700 border-amber-200",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  converted: "bg-green-50 text-green-700 border-green-200",
  unsubscribed: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

function fmt(d: string | null) {
  return d ? new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const run = (id: string, fn: () => Promise<unknown>) => async () => {
    setBusyId(id);
    setMessage(null);
    try {
      const result = (await fn()) as { ok?: boolean; error?: string } | undefined;
      if (result && result.ok === false) setMessage(result.error ?? "Action failed.");
      startTransition(() => router.refresh());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={isPending ? "opacity-60" : undefined}>
      {message && (
        <p className="mb-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-sand text-left text-[11px] uppercase tracking-wider text-stone">
              <th className="py-2 pr-4 font-medium">Guest</th>
              <th className="py-2 pr-4 font-medium">Dates</th>
              <th className="py-2 pr-4 font-medium">Got to</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">When</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const busy = busyId === lead.id;
              return (
                <tr key={lead.id} className="border-b border-sand/60 align-top">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-graphite">{lead.name || "—"}</div>
                    <a href={`mailto:${lead.email}`} className="text-xs text-brass hover:underline">
                      {lead.email}
                    </a>
                    {lead.phone && <div className="text-xs text-stone">{lead.phone}</div>}
                  </td>
                  <td className="py-3 pr-4 text-graphite">
                    {fmt(lead.checkIn)} → {fmt(lead.checkOut)}
                    {lead.guests ? <div className="text-xs text-stone">{lead.guests} guests</div> : null}
                  </td>
                  <td className="py-3 pr-4 text-stone">{STAGE_LABEL[lead.stage] ?? lead.stage}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] ${STATUS_TONE[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-xs text-stone">
                    {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {lead.status !== "unsubscribed" && (
                        <button
                          onClick={run(lead.id, () => sendFollowUp(lead.id))}
                          disabled={busy}
                          className="rounded-sm bg-graphite px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-brass disabled:opacity-40"
                        >
                          {lead.followUpSentAt ? "Send again" : "Send follow-up"}
                        </button>
                      )}
                      {lead.status !== "converted" && (
                        <button
                          onClick={run(lead.id, () => setLeadStatus(lead.id, "converted"))}
                          disabled={busy}
                          className="rounded-sm border border-sand px-2.5 py-1 text-[11px] text-graphite transition-colors hover:border-brass hover:text-brass disabled:opacity-40"
                        >
                          Booked
                        </button>
                      )}
                      <button
                        onClick={run(lead.id, async () => {
                          if (!confirm("Delete this enquiry?")) return;
                          await deleteLead(lead.id);
                        })}
                        disabled={busy}
                        className="rounded-sm border border-red-200 px-2.5 py-1 text-[11px] text-red-600 transition-colors hover:bg-red-50 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
