import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
};

/**
 * Single place that decides how a link renders:
 *  - internal paths → next/link (client-side navigation, prefetch)
 *  - https links    → new tab, noopener, announced to screen readers
 *  - tel:/mailto:   → plain anchor
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  if (/^(tel:|mailto:)/i.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
