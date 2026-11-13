import type { ReactNode } from "react";

/**
 * A titled content area: a hairline-bordered white surface with a soft panel shadow and a heading row.
 * `@container` lets its contents choose a table or list layout from the room they actually have.
 */
export function Panel({
  title,
  description,
  action,
  headingId,
  children,
  className = "",
  flush = false,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  headingId: string;
  children: ReactNode;
  className?: string;
  /** Removes the body padding so tables and lists can run edge to edge. */
  flush?: boolean;
}) {
  return (
    <section aria-labelledby={headingId} className={`@container rounded-md border border-line bg-white shadow-panel ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-5 py-4 sm:px-6">
        <div>
          <h2 id={headingId} className="font-heading text-lead leading-tight font-extrabold text-navy">
            {title}
          </h2>
          {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className={flush ? "" : "p-5 sm:p-6"}>{children}</div>
    </section>
  );
}
