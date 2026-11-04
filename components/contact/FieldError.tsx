import type { ReactNode } from "react";

/** An inline validation message: icon plus text on a tinted chip, readable on light and dark surfaces. */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 rounded-sm bg-danger-tint px-3 py-2 text-sm font-semibold text-danger">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="mt-0.5 size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v5M10 14h.01" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
