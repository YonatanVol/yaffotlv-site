"use client";

import { useState, useEffect } from "react";
import { getPricingRules, updatePricingRule } from "../../actions";

type PricingRule = Awaited<ReturnType<typeof getPricingRules>>[number];

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state (in ILS, not agorot)
  const [baseRate, setBaseRate] = useState(550);
  const [thursdayRate, setThursdayRate] = useState(1000);
  const [fridayRate, setFridayRate] = useState(1000);
  const [cleaningFee, setCleaningFee] = useState(300);
  const [minNights, setMinNights] = useState(1);

  useEffect(() => {
    getPricingRules()
      .then((data) => {
        setRules(data);
        if (data.length > 0) {
          const r = data[0];
          setBaseRate(r.baseRateNight / 100);
          setThursdayRate(r.thursdayRate / 100);
          setFridayRate(r.fridayRate / 100);
          setCleaningFee(r.cleaningFee / 100);
          setMinNights(r.minNights);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (rules.length === 0) return;
    setSaving(true);
    setSaved(false);

    try {
      await updatePricingRule(rules[0].id, {
        baseRateNight: Math.round(baseRate * 100),
        thursdayRate: Math.round(thursdayRate * 100),
        fridayRate: Math.round(fridayRate * 100),
        cleaningFee: Math.round(cleaningFee * 100),
        minNights,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-stone">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-light text-graphite">Pricing</h1>

      <form onSubmit={handleSave} className="mt-8 max-w-md space-y-5">
        <Field label="Base Rate (Sun–Wed)" value={baseRate} onChange={setBaseRate} suffix="ILS / night" />
        <Field label="Thursday Rate" value={thursdayRate} onChange={setThursdayRate} suffix="ILS / night" />
        <Field label="Friday Rate" value={fridayRate} onChange={setFridayRate} suffix="ILS / night" />
        <Field label="Cleaning Fee" value={cleaningFee} onChange={setCleaningFee} suffix="ILS" />
        <Field label="Minimum Nights" value={minNights} onChange={setMinNights} suffix="nights" />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-brass px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-brass-dark disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && <span className="text-sm text-green-700">Saved!</span>}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-[0.15em] text-stone">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={0}
          className="w-32 border border-sand bg-cream px-4 py-2.5 text-sm text-graphite focus:border-brass focus:outline-none"
        />
        <span className="text-sm text-stone">{suffix}</span>
      </div>
    </div>
  );
}
