import type { HTMLAttributes } from "react";

export type SectionTone = "light" | "white" | "navy" | "charcoal";
type SectionSpace = "sm" | "md" | "lg";

const tones: Record<SectionTone, string> = {
  light: "bg-warm-white text-charcoal",
  white: "bg-white text-charcoal",
  navy: "bg-navy text-white",
  charcoal: "bg-charcoal text-white",
};

const space: Record<SectionSpace, string> = {
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
};

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: SectionTone;
  space?: SectionSpace;
};

/** Full-width band with a surface tone and consistent vertical rhythm. Dark tones set data-surface for focus colours. */
export function Section({ tone = "light", space: spacing = "md", className = "", ...rest }: SectionProps) {
  const dark = tone === "navy" || tone === "charcoal";
  return (
    <section
      data-surface={dark ? "dark" : "light"}
      className={`${tones[tone]} ${space[spacing]} ${className}`}
      {...rest}
    />
  );
}
