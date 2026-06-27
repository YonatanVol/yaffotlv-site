"use client";

import { useI18n } from "@/lib/i18n/context";

const FALLBACK_RULES = [
  "No smoking inside the apartment ($200 fine per booked day).",
  "No parties and no loud events.",
  "Quiet hours are 21:00–08:00. Please respect the neighbors.",
  "A fine of $100 per booked day, per guest, applies for exceeding the number of guests booked. Any change in the guest count must be updated in advance.",
  "You must have a valid, active phone number before booking.",
  "If the apartment is left excessively dirty, a $100 additional cleaning charge applies.",
  "Breaking any house rule is grounds for immediate termination of the stay with no refund.",
];

export function HouseRulesContent() {
  const { t } = useI18n();
  const hr = t.houseRules;
  const rules = hr?.rules ?? FALLBACK_RULES;

  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">House</p>
      <h1 className="mt-3 font-serif text-4xl font-light text-charcoal">{hr?.title || "House Rules"}</h1>
      <p className="mt-6 text-sm leading-relaxed text-graphite">
        {hr?.intro || "By booking, you agree to the following house rules:"}
      </p>
      <ul className="mt-6 list-disc space-y-3 pl-5">
        {rules.map((r, i) => (
          <li key={i} className="text-sm leading-relaxed text-graphite">
            {r}
          </li>
        ))}
      </ul>
    </article>
  );
}
