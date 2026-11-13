import type { PrivacySection } from "@/content/privacy";

const linkClass =
  "block py-2 text-base text-charcoal underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:text-navy hover:decoration-gold focus-visible:text-navy";

/**
 * The list of sections as in-page links. On large screens it is a sticky sidebar that stays beside the text; on phones and
 * tablets it is a collapsible list (a native <details>, so it needs no JavaScript) above the text, so it never pushes the
 * notice itself far down the page.
 */
export function PrivacyIndex({ label, sections }: { label: string; sections: readonly PrivacySection[] }) {
  const list = (
    <ol className="mt-1">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className={linkClass}>
            <span aria-hidden="true" className="mr-3 inline-block w-6 font-heading text-sm font-bold text-gold tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {section.heading}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label={label}>
      <details className="border border-line-strong bg-white lg:hidden">
        <summary className="cursor-pointer list-none px-5 py-4 font-heading text-sm font-bold tracking-[0.12em] text-navy uppercase marker:content-none">
          {label}
          <span aria-hidden="true" className="float-right text-gold">
            +
          </span>
        </summary>
        <div className="border-t border-line px-5 pb-3">{list}</div>
      </details>

      <div className="hidden lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:block">
        <p className="mb-3 font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{label}</p>
        <div className="border-l-2 border-line-strong pl-5">{list}</div>
      </div>
    </nav>
  );
}
