export type ButtonVariant = "primary" | "secondary";
/** "light" = used on warm white/white surfaces; "dark" = used on navy/charcoal surfaces. */
export type Surface = "light" | "dark";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-sm border font-heading font-semibold " +
  // A label may wrap only on the very narrowest phones (under 400px), and a button never grows wider than its container:
  // a long label such as "Enquire About Pounding Machines" is wider than a 360px screen allows. At every normal width it stays on one line.
  "tracking-tight max-w-full text-center whitespace-normal min-[400px]:whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,transform,box-shadow] duration-200 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-5 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-base",
};

const variants: Record<Surface, Record<ButtonVariant, string>> = {
  light: {
    primary:
      "border-navy bg-navy text-white hover:border-navy-hover hover:bg-navy-hover hover:shadow-raised",
    secondary:
      "border-navy bg-transparent text-navy hover:bg-navy hover:text-white",
  },
  dark: {
    primary:
      "border-gold bg-gold text-navy hover:border-gold-hover hover:bg-gold-hover hover:shadow-raised",
    secondary:
      "border-white/60 bg-transparent text-white hover:border-white hover:bg-white hover:text-navy",
  },
};

export function buttonStyles({
  variant = "primary",
  surface = "light",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  surface?: Surface;
  size?: ButtonSize;
  className?: string;
}) {
  return [base, sizes[size], variants[surface][variant], className].filter(Boolean).join(" ");
}
