import { DraftBanner } from "./draft-banner";

export interface LegalSection {
  h: string;
  p: string[];
}

/** Shared renderer for the DRAFT legal documents. Body text is passed as plain
 *  strings (React escapes them) so the documents stay lint-clean and translatable. */
export function LegalArticle({
  title,
  updated,
  sections,
  note,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
  note?: string;
}) {
  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Legal</p>
      <h1 className="mt-3 font-serif text-4xl font-light text-charcoal">{title}</h1>
      <p className="mt-2 text-sm text-stone">Last updated {updated}</p>

      <div className="mt-8">
        <DraftBanner />
        {note ? (
          <div className="mb-8 rounded-sm border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-900">
            {note}
          </div>
        ) : null}
        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-serif text-xl font-light text-charcoal">{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-graphite">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
