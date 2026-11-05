import { formatDayOfMonth, formatMonth } from "@/lib/dashboard-preview/dates";

const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });

/** A small calendar tile (weekday, day, month) for a YYYY-MM-DD date. Decorative: the full date is always written nearby. */
export function DateTile({ date, muted = false }: { date: string; muted?: boolean }) {
  const [year, month, day] = date.split("-").map(Number);
  const label = weekday.format(Date.UTC(year, month - 1, day));

  return (
    <span
      aria-hidden="true"
      className={`inline-flex w-14 shrink-0 flex-col items-center overflow-hidden rounded-md border text-center ${
        muted ? "border-line bg-warm-white" : "border-line-strong bg-white shadow-panel"
      }`}
    >
      <span className={`w-full py-0.5 font-heading text-[0.6875rem] font-bold tracking-[0.12em] uppercase ${muted ? "bg-tint text-ink-muted" : "bg-navy text-white"}`}>
        {label}
      </span>
      <span className={`font-heading text-xl leading-none font-extrabold ${muted ? "text-ink-muted" : "text-navy"} pt-1.5`}>{formatDayOfMonth(date)}</span>
      <span className="pt-0.5 pb-1.5 font-heading text-[0.6875rem] font-bold tracking-wide text-ink-muted uppercase">{formatMonth(date)}</span>
    </span>
  );
}
