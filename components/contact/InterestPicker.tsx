import { findCategory, type EnquiryCategory } from "@/content/enquiry-options";

type InterestPickerProps = {
  category: EnquiryCategory | "";
  selected: readonly string[];
  /** True when the category or product came from the page the visitor arrived from. */
  prefilled: boolean;
  onToggle: (slug: string) => void;
};

/**
 * The specific services or products for the chosen category, as checkboxes (more than one may be chosen).
 * Options appear only for categories that have them. A live summary states what is currently selected.
 */
export function InterestPicker({ category, selected, prefilled, onToggle }: InterestPickerProps) {
  const option = category ? findCategory(category) : undefined;
  const interests = option?.interests ?? [];
  const labels = interests.filter((interest) => selected.includes(interest.slug)).map((interest) => interest.label);

  let summary = "Choose a category above to see the relevant options.";
  if (option) {
    summary = labels.length
      ? `Enquiring about: ${option.label}, ${labels.join(", ")}`
      : interests.length
        ? `Enquiring about: ${option.label}. Choose any that interest you.`
        : `Enquiring about: ${option.label}.`;
  }

  return (
    <div>
      <p aria-live="polite" className="border-l-4 border-gold bg-white py-3 pr-4 pl-4 font-heading text-sm font-bold text-navy">
        {summary}
      </p>
      {prefilled && option ? (
        <p className="mt-2 text-sm text-ink-muted">Pre-selected from the page you came from. You can change it.</p>
      ) : null}

      {interests.length > 0 ? (
        <fieldset className="mt-5">
          <legend className="font-heading text-sm font-bold text-navy">
            {option?.interestLegend} <span className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">Optional</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {interests.map((interest) => {
              const checked = selected.includes(interest.slug);
              const inputId = `enquiry-interest-${interest.slug}`;
              return (
                <div key={interest.slug}>
                  <input
                    type="checkbox"
                    id={inputId}
                    name="interests"
                    value={interest.slug}
                    checked={checked}
                    onChange={() => onToggle(interest.slug)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={inputId}
                    className={`inline-flex min-h-11 cursor-pointer items-center gap-2.5 border px-4 py-2 font-heading text-sm font-bold transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy ${
                      checked ? "border-navy bg-navy text-white" : "border-line-strong bg-white text-navy hover:border-navy"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`grid size-4 shrink-0 place-items-center border-2 ${checked ? "border-gold bg-gold" : "border-line-strong bg-white"}`}
                    >
                      {checked ? (
                        <svg viewBox="0 0 12 12" className="size-3 text-navy" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m2.5 6.2 2.2 2.2 4.8-5" />
                        </svg>
                      ) : null}
                    </span>
                    {interest.label}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      ) : null}
    </div>
  );
}
