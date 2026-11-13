import { CloseIcon } from "@/components/ui/icons";
import { SearchIcon } from "./icons";

/** A search box with a clear button. The label is visually hidden to keep the toolbar compact, but always present. */
export function SearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-muted" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full rounded-md border border-line-strong bg-warm-white pr-11 pl-11 text-base text-charcoal transition-colors placeholder:text-ink-muted hover:border-navy/60 focus:border-navy focus:bg-white [&::-webkit-search-cancel-button]:hidden"
      />
      {value !== "" ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-md text-ink-muted hover:text-navy"
        >
          <CloseIcon className="size-5" />
          <span className="sr-only">Clear search</span>
        </button>
      ) : null}
    </div>
  );
}
