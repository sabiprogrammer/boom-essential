import { enquiryCategories, type EnquiryCategory } from "@/content/enquiry-options";
import { FieldError } from "./FieldError";

type CategoryPickerProps = {
  value: EnquiryCategory | "";
  error?: string;
  onChange: (id: EnquiryCategory) => void;
};

/**
 * Required choice of what the enquiry is about, as one radio group (arrow keys move between options).
 * The three divisions and the general enquiry sit in a grid; Industrial Equipment is set apart with a
 * dashed border because it is an additional offering, not a division.
 */
export function CategoryPicker({ value, error, onChange }: CategoryPickerProps) {
  const errorId = error ? "enquiry-category-error" : undefined;

  return (
    <fieldset aria-describedby={errorId} className="scroll-mt-32">
      <legend className="font-heading text-sm font-bold text-navy">What are you enquiring about? <span className="sr-only">(required)</span></legend>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {enquiryCategories.map((category) => {
          const selected = value === category.id;
          const additional = category.id === "industrial-equipment";
          const inputId = `enquiry-category-${category.id}`;

          return (
            <div key={category.id} className={additional ? "sm:col-span-2" : ""}>
              <input
                type="radio"
                id={inputId}
                name="category"
                value={category.id}
                checked={selected}
                onChange={() => onChange(category.id)}
                className="peer sr-only"
              />
              <label
                htmlFor={inputId}
                className={`flex h-full cursor-pointer items-center justify-between gap-4 border-2 p-4 transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy ${
                  additional ? "border-dashed" : "border-solid"
                } ${
                  selected
                    ? "border-navy bg-navy text-white"
                    : `bg-white text-navy hover:border-navy ${error ? "border-danger" : "border-line-strong"}`
                }`}
              >
                <span>
                  <span className="block font-heading text-base font-extrabold">{category.label}</span>
                  <span className={`mt-0.5 block text-sm ${selected ? "text-on-dark-muted" : "text-ink-muted"}`}>{category.hint}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                    selected ? "border-gold bg-gold" : "border-line-strong bg-white"
                  }`}
                >
                  {selected ? <span className="size-1.5 rounded-full bg-navy" /> : null}
                </span>
              </label>
            </div>
          );
        })}
      </div>

      {error ? <FieldError id="enquiry-category-error">{error}</FieldError> : null}
    </fieldset>
  );
}
