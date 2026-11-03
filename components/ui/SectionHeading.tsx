import type { ReactNode } from "react";
import type { Surface } from "./button-styles";

type SectionHeadingProps = {
  title: ReactNode;
  eyebrow?: string;
  lead?: ReactNode;
  surface?: Surface;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

/**
 * Standard section opener: short rule + uppercase label, headline, optional lead paragraph.
 * The gold rule is decorative only; all text meets contrast on its surface.
 */
export function SectionHeading({
  title,
  eyebrow,
  lead,
  surface = "light",
  as: Tag = "h2",
  id,
  className = "",
}: SectionHeadingProps) {
  const dark = surface === "dark";
  const size = Tag === "h1" ? "text-h1" : Tag === "h3" ? "text-h3" : "text-h2";

  return (
    <div className={`max-w-prose ${className}`}>
      {eyebrow ? (
        <p
          className={`mb-5 flex items-center gap-3 font-heading text-xs font-bold tracking-[0.16em] uppercase ${
            dark ? "text-white" : "text-navy"
          }`}
        >
          <span aria-hidden="true" className="h-0.5 w-8 bg-gold" />
          {eyebrow}
        </p>
      ) : null}
      <Tag id={id} className={`${size} font-bold ${dark ? "text-white" : ""}`}>
        {title}
      </Tag>
      {lead ? (
        <p className={`mt-5 text-lead ${dark ? "text-on-dark-muted" : "text-ink-muted"}`}>{lead}</p>
      ) : null}
    </div>
  );
}
