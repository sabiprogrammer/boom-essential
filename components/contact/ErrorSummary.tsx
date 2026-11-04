import type { Ref } from "react";
import type { FieldKey } from "@/lib/enquiry/types";
import { fieldIds } from "./field-ids";

type ErrorSummaryProps = {
  errors: readonly { key: FieldKey; message: string }[];
  summaryRef: Ref<HTMLDivElement>;
};

/**
 * Lists every problem after a failed submit and takes keyboard focus, so screen reader and keyboard users
 * hear what to fix. Each entry moves focus to its field.
 */
export function ErrorSummary({ errors, summaryRef }: ErrorSummaryProps) {
  function focusField(key: FieldKey) {
    const element = document.getElementById(fieldIds[key]);
    element?.scrollIntoView({ block: "center" });
    element?.focus({ preventScroll: true });
  }

  return (
    <div
      ref={summaryRef}
      tabIndex={-1}
      role="alert"
      aria-labelledby="enquiry-error-summary-title"
      className="scroll-mt-32 border-l-4 border-danger bg-danger-tint p-5 sm:p-6"
    >
      <h3 id="enquiry-error-summary-title" className="font-heading text-lg font-extrabold text-danger">
        {errors.length === 1 ? "There is 1 thing to fix" : `There are ${errors.length} things to fix`}
      </h3>
      <ul className="mt-3 space-y-1.5">
        {errors.map(({ key, message }) => (
          <li key={key}>
            <a
              href={`#${fieldIds[key]}`}
              onClick={(event) => {
                event.preventDefault();
                focusField(key);
              }}
              className="text-base font-semibold text-danger underline underline-offset-4"
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
