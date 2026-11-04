import type { ReactNode } from "react";

type FormStepProps = {
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
};

/** A numbered group of related fields under a ruled heading, so a single form reads as short, ordered steps. */
export function FormStep({ number, title, description, children }: FormStepProps) {
  const headingId = `enquiry-step-${number}`;
  return (
    <section aria-labelledby={headingId} className="border-t-2 border-navy pt-6">
      <header className="flex items-baseline gap-4">
        <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em] text-ink-muted tabular-nums">
          {number}
        </span>
        <div>
          <h3 id={headingId} className="font-heading text-h3 font-extrabold text-navy">
            {title}
          </h3>
          {description ? <p className="mt-1 text-body text-ink-muted">{description}</p> : null}
        </div>
      </header>
      <div className="mt-7">{children}</div>
    </section>
  );
}
