import type { AnchorHTMLAttributes } from "react";
import { ArrowRightIcon } from "./icons";
import type { Surface } from "./button-styles";
import { SmartLink } from "./SmartLink";

type TextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  surface?: Surface;
  /** Adds a trailing arrow that nudges on hover. */
  arrow?: boolean;
};

const tones: Record<Surface, string> = {
  light: "text-navy decoration-navy/35 hover:decoration-navy",
  dark: "text-white decoration-white/40 hover:decoration-gold",
};

/** Inline or standalone text link: underlined, with a clear hover state. */
export function TextLink({ href, surface = "light", arrow = false, className = "", children, ...rest }: TextLinkProps) {
  return (
    <SmartLink
      href={href}
      className={`group/link inline-flex items-center gap-1.5 font-semibold underline decoration-1 underline-offset-4 transition-colors duration-200 ${tones[surface]} ${className}`}
      {...rest}
    >
      {children}
      {arrow ? (
        <ArrowRightIcon className="size-[1em] transition-transform duration-200 group-hover/link:translate-x-0.5" />
      ) : null}
    </SmartLink>
  );
}
