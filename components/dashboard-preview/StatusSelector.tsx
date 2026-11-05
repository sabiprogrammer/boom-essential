"use client";

/** A single-choice status control for the demonstration: toggle buttons (aria-pressed) in a labelled group. */
export function StatusSelector<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={legend} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className="inline-flex h-11 items-center rounded-md border border-line-strong bg-white px-4 font-heading text-sm font-bold text-navy transition-[background-color,border-color,color,box-shadow] hover:border-navy hover:bg-tint aria-pressed:border-navy aria-pressed:bg-navy aria-pressed:text-white aria-pressed:shadow-raised"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
