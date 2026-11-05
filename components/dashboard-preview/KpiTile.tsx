import Link from "next/link";
import type { ReactNode } from "react";

/**
 * One headline figure: label and icon, the number, and a proportion bar with a plain-text note (the bar is
 * decorative; the note carries the meaning). The hero tile is Deep Navy; the others are white. The whole tile
 * links to the view that explains the figure.
 */
export function KpiTile({
  href,
  label,
  value,
  note,
  icon,
  bar,
  hero = false,
  accent = false,
}: {
  href: string;
  label: string;
  value: number;
  note: string;
  icon: ReactNode;
  /** The bar's content: segments or a single fill, already sized as percentages. */
  bar: ReactNode;
  hero?: boolean;
  accent?: boolean;
}) {
  return (
    <li className="contents">
      <Link
        href={href}
        data-surface={hero ? "dark" : undefined}
        className={`group relative flex flex-col gap-3 p-5 transition-colors duration-200 focus-visible:z-10 sm:p-6 ${
          hero ? "bg-navy text-white hover:bg-navy-hover" : "bg-white hover:bg-warm-white"
        }`}
      >
        {accent ? <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gold" /> : null}
        <span className="flex items-start justify-between gap-3">
          <span className={`font-heading text-sm font-bold ${hero ? "text-on-dark-muted" : "text-ink-muted"}`}>{label}</span>
          <span
            aria-hidden="true"
            className={`grid size-9 shrink-0 place-items-center rounded-md [&>svg]:size-[1.125rem] ${
              hero ? "bg-white/10 text-gold" : "bg-tint text-navy"
            }`}
          >
            {icon}
          </span>
        </span>
        <span className={`font-heading text-h1 leading-none font-extrabold tracking-tight tabular-nums ${hero ? "text-white" : "text-navy"}`}>
          {value}
        </span>
        <span aria-hidden="true" className={`flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full ${hero ? "bg-white/10" : "bg-tint"}`}>
          {bar}
        </span>
        <span className={`text-sm ${hero ? "text-on-dark-muted" : "text-ink-muted"}`}>{note}</span>
      </Link>
    </li>
  );
}
