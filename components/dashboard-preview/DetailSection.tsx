import type { ReactNode } from "react";

/**
 * A distinct block inside a detail drawer: a white surface with a hairline border and a small labelled
 * heading (icon, then capitals). Blocks are separated by space rather than nested in cards.
 */
export function DetailSection({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-md border border-line bg-white p-5 shadow-panel sm:p-6">
      <h3 className="mb-4 flex items-center gap-2.5 font-heading text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">
        {icon ? <span className="text-navy [&>svg]:size-4">{icon}</span> : null}
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Label and value pairs, one per row on phones and two columns from tablet. */
export function DetailList({ children }: { children: ReactNode }) {
  return <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">{children}</dl>;
}

export function DetailItem({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="font-heading text-xs font-bold tracking-[0.06em] text-ink-muted uppercase">{label}</dt>
      <dd className="mt-1 text-base break-words text-charcoal">{children}</dd>
    </div>
  );
}

/** A customer's own words, set apart with a rule so it reads as a quotation. */
export function Quote({ children }: { children: ReactNode }) {
  return <blockquote className="border-l-[3px] border-gold bg-warm-white py-3 pr-4 pl-4 text-base leading-relaxed whitespace-pre-line text-charcoal">{children}</blockquote>;
}
