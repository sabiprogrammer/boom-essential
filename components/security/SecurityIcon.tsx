import type { ReactNode, SVGProps } from "react";
import type { SecurityIconName } from "@/content/security";

type SecurityIconProps = SVGProps<SVGSVGElement> & { name: SecurityIconName };

/** Line icons drawn for the BOOM Security page on a 24px grid (no icon library). Decorative; aria-hidden. */
const glyphs: Record<SecurityIconName, ReactNode> = {
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" />
      <path d="M3 12h8M11 4v8M15 12v8" />
    </>
  ),
  access: (
    <>
      <rect x="5" y="3" width="10" height="18" />
      <circle cx="12" cy="12" r="0.9" />
      <rect x="17.5" y="9" width="3.5" height="6" />
    </>
  ),
  perimeter: (
    <>
      <path d="M4 4h16v16H4Z" strokeDasharray="3 3" />
      <path d="M12 9v6M9 12h6" />
    </>
  ),
  surveillance: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  supply: (
    <>
      <path d="m4 8 8-4 8 4v8l-8 4-8-4Z" />
      <path d="m4 8 8 4 8-4M12 12v8" />
    </>
  ),
  installation: (
    <>
      <path d="M3 3v18" />
      <path d="M3 8h5" />
      <rect x="8" y="5.5" width="11" height="6" rx="1" />
      <circle cx="16.5" cy="8.5" r="1.2" />
      <path d="M13 15v5M10.5 17.5h5" />
    </>
  ),
  maintenance: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </>
  ),
  fencing: (
    <>
      <path d="M4 20V8l2-2 2 2v12M10 20V8l2-2 2 2v12M16 20V8l2-2 2 2v12" />
      <path d="M3 12h18M3 16h18" />
    </>
  ),
  accessControl: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <path d="M9.5 7h.01M12 7h.01M14.5 7h.01M9.5 10h.01M12 10h.01M14.5 10h.01M9.5 13h.01M12 13h.01M14.5 13h.01" />
      <path d="M10 17h4" />
    </>
  ),
  monitoring: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M9 20h6M12 16v4" />
      <path d="m7.5 12 2.5-3 2 2 3.5-4" />
    </>
  ),
  assessment: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
      <path d="M8 10.5h5M10.5 8v5" />
    </>
  ),
  residential: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  commercial: (
    <>
      <rect x="5" y="3" width="14" height="18" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
      <path d="M11 21v-3h2v3" />
    </>
  ),
  institutional: (
    <>
      <path d="M3 9 12 4l9 5" />
      <path d="M5.5 9v10M9.8 9v10M14.2 9v10M18.5 9v10" />
      <path d="M3 21h18" />
    </>
  ),
};

export function SecurityIcon({ name, ...props }: SecurityIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {glyphs[name]}
    </svg>
  );
}
