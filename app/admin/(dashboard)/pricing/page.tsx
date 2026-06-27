"use client";

import { useState, useEffect } from "react";
import {
  getPricingRules,
  updatePricingRule,
  getSeasons,
  addSeason,
  removeSeason,
  getOverrides,
  setOverride,
  removeOverride,
  previewQuote,
  getPromoCodes,
  addPromoCode,
  removePromoCode,
} from "../../actions";
import { formatILS } from "@/lib/pricing";

type Season = Awaited<ReturnType<typeof getSeasons>>[number];
type Override = Awaited<ReturnType<typeof getOverrides>>[number];
type Promo = Awaited<ReturnType<typeof getPromoCodes>>[number];
type Quote = Awaited<ReturnType<typeof previewQuote>>;

export default function PricingPage() {
  const [ruleId, setRuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Rule fields (edited in ILS, stored in agorot)
  const [baseRate, setBaseRate] = useState(550);
  const [thursdayRate, setThursdayRate] = useState(1000);
  const [fridayRate, setFridayRate] = useState(1000);
  const [saturdayRate, setSaturdayRate] = useState(1000);
  const [cleaningFee, setCleaningFee] = useState(300);
  const [minNights, setMinNights] = useState(1);
  const [lastMinutePct, setLastMinutePct] = useState(10);
  const [lastMinuteDays, setLastMinuteDays] = useState(5);
  const [longStay7, setLongStay7] = useState(10);
  const [longStay28, setLongStay28] = useState(20);

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);

  const [sName, setSName] = useState("");
  const [sStart, setSStart] = useState("");
  const [sEnd, setSEnd] = useState("");
  const [sAdj, setSAdj] = useState(25);

  const [oDate, setODate] = useState("");
  const [oPrice, setOPrice] = useState(0);

  const [promos, setPromos] = useState<Promo[]>([]);
  const [pCode, setPCode] = useState("");
  const [pPct, setPPct] = useState(10);
  const [pMax, setPMax] = useState("");
  const [pExp, setPExp] = useState("");

  const [pIn, setPIn] = useState("");
  const [pOut, setPOut] = useState("");
  const [quote, setQuote] = useState<Quote>(null);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    Promise.all([getPricingRules(), getSeasons(), getOverrides(), getPromoCodes()])
      .then(([rules, ss, ov, pc]) => {
        if (rules.length > 0) {
          const r = rules[0];
          setRuleId(r.id);
          setBaseRate(r.baseRateNight / 100);
          setThursdayRate(r.thursdayRate / 100);
          setFridayRate(r.fridayRate / 100);
          setSaturdayRate(r.saturdayRate / 100);
          setCleaningFee(r.cleaningFee / 100);
          setMinNights(r.minNights);
          setLastMinutePct(r.lastMinuteDiscountPct);
          setLastMinuteDays(r.lastMinuteDays);
          setLongStay7(r.longStay7Pct);
          setLongStay28(r.longStay28Pct);
        }
        setSeasons(ss);
        setOverrides(ov);
        setPromos(pc);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleAddPromo() {
    if (!pCode || !pPct) return;
    await addPromoCode({
      code: pCode,
      discountPct: pPct,
      maxUses: pMax ? Number(pMax) : null,
      expiresAt: pExp || null,
    });
    setPCode("");
    setPPct(10);
    setPMax("");
    setPExp("");
    getPromoCodes().then(setPromos);
  }

  async function handleSaveRules(e: React.FormEvent) {
    e.preventDefault();
    if (!ruleId) return;
    setSaving(true);
    setSaved(false);
    try {
      await updatePricingRule(ruleId, {
        baseRateNight: Math.round(baseRate * 100),
        thursdayRate: Math.round(thursdayRate * 100),
        fridayRate: Math.round(fridayRate * 100),
        saturdayRate: Math.round(saturdayRate * 100),
        cleaningFee: Math.round(cleaningFee * 100),
        minNights,
        lastMinuteDiscountPct: lastMinutePct,
        lastMinuteDays,
        longStay7Pct: longStay7,
        longStay28Pct: longStay28,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSeason() {
    if (!sName || !sStart || !sEnd) return;
    await addSeason({ name: sName, startDate: sStart, endDate: sEnd, adjustmentPct: sAdj });
    setSName("");
    setSStart("");
    setSEnd("");
    setSAdj(25);
    getSeasons().then(setSeasons);
  }

  async function handleSetOverride() {
    if (!oDate || !oPrice) return;
    await setOverride(oDate, oPrice);
    setODate("");
    setOPrice(0);
    getOverrides().then(setOverrides);
  }

  async function handlePreview() {
    if (!pIn || !pOut) return;
    setPreviewing(true);
    try {
      setQuote(await previewQuote(pIn, pOut));
    } finally {
      setPreviewing(false);
    }
  }

  if (loading) return <p className="text-sm text-stone">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl font-light text-graphite">Pricing</h1>

      {/* Base rates + discounts */}
      <form onSubmit={handleSaveRules} className="mt-8 space-y-6">
        <Card title="Nightly rates & fees">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Base (Sun–Wed)" value={baseRate} onChange={setBaseRate} suffix="₪" />
            <Field label="Thursday" value={thursdayRate} onChange={setThursdayRate} suffix="₪" />
            <Field label="Friday" value={fridayRate} onChange={setFridayRate} suffix="₪" />
            <Field label="Saturday" value={saturdayRate} onChange={setSaturdayRate} suffix="₪" />
            <Field label="Cleaning fee" value={cleaningFee} onChange={setCleaningFee} suffix="₪" />
            <Field label="Min nights" value={minNights} onChange={setMinNights} suffix="nights" />
          </div>
        </Card>

        <Card title="Discounts">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Last-minute" value={lastMinutePct} onChange={setLastMinutePct} suffix="%" />
            <Field label="…if within" value={lastMinuteDays} onChange={setLastMinuteDays} suffix="days" />
            <Field label="Long stay 7+" value={longStay7} onChange={setLongStay7} suffix="%" />
            <Field label="Long stay 28+" value={longStay28} onChange={setLongStay28} suffix="%" />
          </div>
          <p className="mt-3 text-xs text-stone">The single largest applicable discount is applied.</p>
        </Card>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-brass px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-brass-dark disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save rates & discounts"}
          </button>
          {saved && <span className="text-sm text-green-700">Saved!</span>}
        </div>
      </form>

      {/* Seasons */}
      <Card title="Seasonal windows" className="mt-8">
        {seasons.length === 0 ? (
          <p className="text-sm text-stone">No seasons yet. Add summer, holidays, low season…</p>
        ) : (
          <div className="space-y-1">
            {seasons.map((s) => (
              <div key={s.id} className="flex items-center justify-between border border-sand/50 bg-cream px-4 py-2 text-sm">
                <span className="text-graphite">
                  <span className="font-medium">{s.name}</span> · {s.startDate} → {s.endDate} ·{" "}
                  <span className={s.adjustmentPct >= 0 ? "text-brass" : "text-green-700"}>
                    {s.adjustmentPct >= 0 ? "+" : ""}
                    {s.adjustmentPct}%
                  </span>
                </span>
                <button onClick={() => removeSeason(s.id).then(() => getSeasons().then(setSeasons))} className="text-xs text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <input value={sName} onChange={(e) => setSName(e.target.value)} placeholder="Name" className="col-span-2 border border-sand bg-cream px-3 py-2 text-sm sm:col-span-1" />
          <input type="date" value={sStart} onChange={(e) => setSStart(e.target.value)} className="border border-sand bg-cream px-3 py-2 text-sm" />
          <input type="date" value={sEnd} min={sStart || undefined} onChange={(e) => setSEnd(e.target.value)} className="border border-sand bg-cream px-3 py-2 text-sm" />
          <div className="flex items-center gap-1">
            <input type="number" value={sAdj} onChange={(e) => setSAdj(Number(e.target.value))} className="w-16 border border-sand bg-cream px-2 py-2 text-sm" />
            <span className="text-sm text-stone">%</span>
          </div>
          <button onClick={handleAddSeason} disabled={!sName || !sStart || !sEnd} className="bg-brass px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white hover:bg-brass-dark disabled:opacity-50">
            Add
          </button>
        </div>
      </Card>

      {/* Per-date overrides */}
      <Card title="Per-date price overrides" className="mt-8">
        {overrides.length === 0 ? (
          <p className="text-sm text-stone">No overrides. Set a fixed price for a specific night.</p>
        ) : (
          <div className="space-y-1">
            {overrides.map((o) => (
              <div key={o.id} className="flex items-center justify-between border border-sand/50 bg-cream px-4 py-2 text-sm">
                <span className="text-graphite">
                  {o.date} · <span className="font-medium text-brass">{formatILS(o.price)} ₪</span>
                </span>
                <button onClick={() => removeOverride(o.id).then(() => getOverrides().then(setOverrides))} className="text-xs text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input type="date" value={oDate} onChange={(e) => setODate(e.target.value)} className="border border-sand bg-cream px-3 py-2 text-sm" />
          <div className="flex items-center gap-1">
            <input type="number" value={oPrice || ""} onChange={(e) => setOPrice(Number(e.target.value))} placeholder="Price" className="w-24 border border-sand bg-cream px-3 py-2 text-sm" />
            <span className="text-sm text-stone">₪</span>
          </div>
          <button onClick={handleSetOverride} disabled={!oDate || !oPrice} className="bg-brass px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white hover:bg-brass-dark disabled:opacity-50">
            Set
          </button>
        </div>
      </Card>

      {/* Promo codes */}
      <Card title="Promo codes" className="mt-8">
        {promos.length === 0 ? (
          <p className="text-sm text-stone">No codes yet. Create one to hand out on Instagram, WhatsApp or email.</p>
        ) : (
          <div className="space-y-1">
            {promos.map((p) => (
              <div key={p.id} className="flex items-center justify-between border border-sand/50 bg-cream px-4 py-2 text-sm">
                <span className="text-graphite">
                  <span className="font-mono font-medium text-brass">{p.code}</span> · {p.discountPct}% off
                  {p.maxUses != null ? ` · ${p.usedCount}/${p.maxUses} used` : ` · ${p.usedCount} used`}
                  {p.expiresAt ? ` · until ${p.expiresAt}` : ""}
                </span>
                <button onClick={() => removePromoCode(p.id).then(() => getPromoCodes().then(setPromos))} className="text-xs text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <input value={pCode} onChange={(e) => setPCode(e.target.value.toUpperCase())} placeholder="CODE" className="border border-sand bg-cream px-3 py-2 font-mono text-sm uppercase" />
          <div className="flex items-center gap-1">
            <input type="number" value={pPct} onChange={(e) => setPPct(Number(e.target.value))} className="w-16 border border-sand bg-cream px-2 py-2 text-sm" />
            <span className="text-sm text-stone">%</span>
          </div>
          <input type="number" value={pMax} onChange={(e) => setPMax(e.target.value)} placeholder="Max uses" className="border border-sand bg-cream px-3 py-2 text-sm" />
          <input type="date" value={pExp} onChange={(e) => setPExp(e.target.value)} className="border border-sand bg-cream px-3 py-2 text-sm" />
          <button onClick={handleAddPromo} disabled={!pCode || !pPct} className="bg-brass px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white hover:bg-brass-dark disabled:opacity-50">
            Create
          </button>
        </div>
        <p className="mt-2 text-xs text-stone">Max uses &amp; expiry are optional. A promo replaces the automatic discount when it&rsquo;s larger.</p>
      </Card>

      {/* Live preview */}
      <Card title="Price preview" className="mt-8">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-stone">Check-in</label>
            <input type="date" value={pIn} onChange={(e) => setPIn(e.target.value)} className="mt-1 border border-sand bg-cream px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-stone">Check-out</label>
            <input type="date" value={pOut} min={pIn || undefined} onChange={(e) => setPOut(e.target.value)} className="mt-1 border border-sand bg-cream px-3 py-2 text-sm" />
          </div>
          <button onClick={handlePreview} disabled={previewing || !pIn || !pOut} className="border border-brass/40 px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-brass hover:bg-brass hover:text-white disabled:opacity-50">
            {previewing ? "…" : "Preview"}
          </button>
        </div>

        {quote && (
          <div className="mt-5 border-t border-sand pt-4 text-sm">
            {quote.nightlyBreakdown.map((n) => (
              <div key={n.date} className="flex justify-between py-0.5">
                <span className="text-graphite">
                  {n.dayName}, {n.date}
                  {n.override ? <span className="ml-1 text-xs text-brass">override</span> : n.season ? <span className="ml-1 text-xs text-stone">{n.season}</span> : null}
                </span>
                <span className="font-mono tabular-nums text-charcoal">{formatILS(n.rate)} ₪</span>
              </div>
            ))}
            <div className="mt-2 space-y-0.5 border-t border-sand/50 pt-2">
              {quote.discountAmount > 0 && (
                <Line label={quote.discountLabel ?? "Discount"} value={`−${formatILS(quote.discountAmount)} ₪`} accent />
              )}
              <Line label="Cleaning fee" value={`${formatILS(quote.cleaningFee)} ₪`} />
              <Line label="VAT (18%)" value={`${formatILS(quote.vatAmount)} ₪`} />
              <Line label={`Total (${quote.nights} nights)`} value={`${formatILS(quote.totalAmount)} ₪`} bold />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-sand bg-ivory p-5 ${className}`}>
      <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-stone">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Line({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={accent ? "text-green-700" : bold ? "font-medium text-charcoal" : "text-stone"}>{label}</span>
      <span className={`font-mono tabular-nums ${accent ? "text-green-700" : bold ? "font-medium text-charcoal" : "text-graphite"}`}>{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix: string }) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-[0.15em] text-stone">{label}</label>
      <div className="mt-1 flex items-center gap-1">
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={0} className="w-full border border-sand bg-cream px-3 py-2 text-sm text-graphite focus:border-brass focus:outline-none" />
        <span className="text-xs text-stone">{suffix}</span>
      </div>
    </div>
  );
}
