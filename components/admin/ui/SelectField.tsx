import { ChevronDownIcon } from "@/components/ui/icons";

/** A native select (best behaviour on phones and for assistive technology) with a small inline label and a custom arrow. */
export function SelectField<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-1.5 left-4 font-heading text-[0.6875rem] leading-none font-bold tracking-[0.1em] text-ink-muted uppercase"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-11 w-full appearance-none rounded-md border border-line-strong bg-warm-white pt-3 pr-10 pl-4 text-base font-medium text-charcoal transition-colors hover:border-navy/60 focus:border-navy focus:bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-ink-muted" />
    </div>
  );
}
