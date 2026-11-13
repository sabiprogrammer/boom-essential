export type FilterChipOption<T extends string> = { value: T; label: string; count?: number };

/**
 * A single-choice filter shown as a row of compact toggle buttons (aria-pressed) with live counts. It scrolls
 * sideways inside its own strip on narrow screens, so the page itself never overflows.
 */
export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly FilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
      {options.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(option.value)}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-transparent px-3.5 font-heading text-sm font-semibold text-ink-muted transition-colors hover:bg-tint hover:text-navy aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white aria-pressed:shadow-raised"
          >
            {option.label}
            {option.count !== undefined ? (
              <span
                className={`min-w-6 rounded-full px-1.5 text-center text-xs font-bold tabular-nums ${
                  pressed ? "bg-white/20 text-white" : "bg-tint text-ink-muted"
                }`}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
