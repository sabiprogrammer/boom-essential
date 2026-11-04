import type { SVGProps } from "react";

type IndustrialIconProps = SVGProps<SVGSVGElement> & { name: "restaurant" | "operator" };

/** Two line icons for the audience section, drawn for this page. Decorative; aria-hidden. */
export function IndustrialIcon({ name, ...props }: IndustrialIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {name === "restaurant" ? (
        <>
          <path d="M3 17h18" />
          <path d="M5 17a7 7 0 0 1 14 0" />
          <path d="M12 8V6M10.5 6h3" />
          <path d="M3 20h18" />
        </>
      ) : (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20a7 7 0 0 1 14 0" />
          <path d="M9.5 14.5 12 17l2.5-2.5" />
        </>
      )}
    </svg>
  );
}
