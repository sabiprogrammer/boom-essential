/** Shared styling for text-like enquiry inputs. Errors are signalled by border, tint and an icon plus text, never colour alone. */
export const inputStyles =
  "block h-12 w-full rounded-sm border border-line-strong bg-white px-4 text-base text-charcoal transition-colors duration-200 " +
  "placeholder:text-ink-muted hover:border-navy focus:border-navy " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-tint";

export const textareaStyles = inputStyles.replace("h-12", "min-h-40 py-3 leading-relaxed resize-y");
