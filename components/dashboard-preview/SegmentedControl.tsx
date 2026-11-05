"use client";

export type SegmentOption<T extends string> = { value: T; label: string; count?: number };

/** Two or three mutually exclusive views (for example Upcoming / Past) as one joined control with a raised active segment. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-md bg-tint p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className="inline-flex h-10 items-center gap-2 rounded-[3px] px-4 font-heading text-sm font-bold text-ink-muted transition-[background-color,color,box-shadow] hover:text-navy aria-pressed:bg-white aria-pressed:text-navy aria-pressed:shadow-panel"
        >
          {option.label}
          {option.count !== undefined ? (
            <span className="min-w-6 rounded-full bg-white/70 px-1.5 text-center text-xs font-bold text-ink-muted tabular-nums">{option.count}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
