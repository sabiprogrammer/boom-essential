import { company } from "@/content/company";
import { SmartLink } from "@/components/ui/SmartLink";
import { LogoImage } from "./LogoImage";

/**
 * Header brand lockup: logo (shrinks slightly when the header is compact) + live-text wordmark.
 * Reads the parent's `group/header` data-scrolled state, so it needs no client code of its own.
 */
export function BrandLogo() {
  return (
    <SmartLink
      href="/"
      aria-label={`${company.shortName}, home page`}
      className="flex shrink-0 items-center gap-3"
    >
      <LogoImage
        alt=""
        priority
        sizes="64px"
        className="size-14 transition-[width,height] duration-300 group-data-[scrolled=true]/header:size-11"
      />
      <span className="hidden font-heading text-sm leading-tight font-extrabold tracking-[0.14em] text-navy transition-colors duration-300 min-[420px]:block lg:hidden xl:block header-clear-dark:text-white">
        BOOM
        <span className="block font-bold tracking-[0.2em] text-ink-muted transition-colors duration-300 header-clear-dark:text-on-dark-muted">MULTI GLOBAL</span>
      </span>
    </SmartLink>
  );
}
