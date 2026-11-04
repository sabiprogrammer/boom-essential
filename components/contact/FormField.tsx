import type { ReactNode } from "react";
import { FieldError } from "./FieldError";

type ControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
};

type FormFieldProps = {
  id: string;
  label: string;
  /** Marks the field as optional in its label. Required fields carry aria-required instead. */
  optional?: boolean;
  hint?: string;
  error?: string;
  /** Light by default; "dark" for fields placed on navy. */
  surface?: "light" | "dark";
  className?: string;
  children: (control: ControlProps) => ReactNode;
};

/**
 * Label, optional hint, control and error message wired together for assistive technology. The control
 * is rendered by the caller so each field can be an input, select or textarea.
 */
export function FormField({ id, label, optional = false, hint, error, surface = "light", className = "", children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const dark = surface === "dark";

  return (
    <div className={`scroll-mt-32 ${className}`}>
      <label htmlFor={id} className={`flex items-baseline justify-between gap-3 font-heading text-sm font-bold ${dark ? "text-white" : "text-navy"}`}>
        <span>{label}</span>
        {optional ? (
          <span className={`text-xs font-semibold tracking-[0.12em] uppercase ${dark ? "text-on-dark-muted" : "text-ink-muted"}`}>
            Optional
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className={`mt-1 text-sm ${dark ? "text-on-dark-muted" : "text-ink-muted"}`}>
          {hint}
        </p>
      ) : null}
      <div className="mt-2">
        {children({
          id,
          "aria-describedby": describedBy,
          ...(error ? { "aria-invalid": true as const } : {}),
          ...(optional ? {} : { "aria-required": true as const }),
        })}
      </div>
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}
