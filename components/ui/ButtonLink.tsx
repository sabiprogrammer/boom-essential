import type { AnchorHTMLAttributes } from "react";
import { ArrowRightIcon } from "./icons";
import { buttonStyles, type ButtonSize, type ButtonVariant, type Surface } from "./button-styles";
import { SmartLink } from "./SmartLink";

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  variant?: ButtonVariant;
  surface?: Surface;
  size?: ButtonSize;
  /** Adds a trailing arrow that nudges on hover. */
  arrow?: boolean;
};

/** A link that looks like a button (navigation or contact actions). */
export function ButtonLink({
  href,
  variant,
  surface,
  size,
  arrow = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <SmartLink href={href} className={buttonStyles({ variant, surface, size, className })} {...rest}>
      {children}
      {arrow ? (
        <ArrowRightIcon className="size-[1.1em] transition-transform duration-200 group-hover/button:translate-x-0.5" />
      ) : null}
    </SmartLink>
  );
}
