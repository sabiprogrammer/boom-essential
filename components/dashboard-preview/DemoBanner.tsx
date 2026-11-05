import { dashboardCopy } from "@/content/dashboard-preview";

/**
 * The always-visible disclosure that this dashboard shows fictional data. A slim, quiet strip: a gold marker
 * and a bold lead-in on a pale gold tint. It stays in view (the header is sticky) without competing with the page.
 */
export function DemoBanner() {
  const [lead, rest] = dashboardCopy.banner.split(" — ");

  return (
    <div role="note" className="flex items-center justify-center gap-2.5 border-b border-gold/35 bg-gold-tint px-gutter py-1.5 text-center text-xs text-navy">
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gold ring-4 ring-gold/25" />
      <p>
        <strong className="font-heading font-extrabold tracking-[0.1em]">{lead}</strong>
        <span aria-hidden="true"> — </span>
        <span className="sr-only">: </span>
        {rest}
      </p>
    </div>
  );
}
