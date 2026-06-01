"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function BillingActions({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go(endpoint: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.url) {
        setError(body.error || "Could not open billing. Try again later.");
        return;
      }
      window.location.href = body.url;
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {isPro ? (
        <Button onClick={() => go("/api/billing/portal")} disabled={loading}>
          {loading && <Spinner />}
          Manage subscription
        </Button>
      ) : (
        <Button onClick={() => go("/api/billing/subscribe")} disabled={loading}>
          {loading && <Spinner />}
          Upgrade to Pro — $4.99/mo
        </Button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
