import type { ReactNode, SVGProps } from "react";
import type { EnergyIconName } from "@/content/energy";

type EnergyIconProps = SVGProps<SVGSVGElement> & { name: EnergyIconName };

/** Line icons drawn for the BOOM Energy page on a 24px grid (no icon library). Decorative; aria-hidden. */
const glyphs: Record<EnergyIconName, ReactNode> = {
  audit: (
    <>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="m12 15 4-5" />
      <circle cx="12" cy="15" r="1.2" />
      <path d="M3 20h18" />
    </>
  ),
  design: (
    <>
      <path d="M5 20 12 4l7 16" />
      <path d="M8.2 14h7.6" />
      <circle cx="12" cy="4" r="0.9" />
    </>
  ),
  installation: (
    <>
      <path d="M5 7h14l2 8H3Z" />
      <path d="m9.7 7-1.2 8M14.3 7l1.2 8M4 11h16" />
      <path d="M12 15v5M9 20h6" />
    </>
  ),
  inverter: (
    <>
      <rect x="4" y="5" width="16" height="12" rx="1" />
      <path d="M7 11c1.5-3 3-3 4.5 0s3 3 4.5 0" />
      <path d="M8 20h.01M16 20h.01" />
    </>
  ),
  battery: (
    <>
      <rect x="3" y="7" width="16" height="10" rx="1" />
      <path d="M21 10.5v3" />
      <path d="M11.5 9 8.5 12.5H12l-1 3" />
    </>
  ),
  maintenance: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </>
  ),
  upgrades: (
    <>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
      <path d="M5 21h14" />
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

export function EnergyIcon({ name, ...props }: EnergyIconProps) {
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
