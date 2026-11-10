"use client";

import { dashboardCopy } from "@/content/dashboard-preview";
import { useActiveDashboardSection } from "@/hooks/useActiveDashboardSection";
import { LogoImage } from "@/components/layout/LogoImage";
import { SmartLink } from "@/components/ui/SmartLink";
import { ExternalIcon } from "./icons";
import { ResetDemoButton } from "./ResetDemoButton";

const initials = dashboardCopy.demoUser.name
  .split(" ")
  .map((part) => part[0])
  .join("");

/**
 * Page title with its one-line description on the left; the demo utility and the signed-in account on the
 * right. On small screens it also carries the logo (the sidebar is hidden) and a link back to the website.
 */
export function TopBar() {
  const section = useActiveDashboardSection();

  return (
    <header className="flex items-center gap-3 border-b border-line bg-white px-gutter py-3 lg:py-3.5">
      <span className="shrink-0 rounded-md border border-line p-0.5 lg:hidden">
        <LogoImage alt="Boom Multi Global logo" sizes="40px" className="size-9" />
      </span>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-heading text-h3 leading-tight font-extrabold text-navy">{section.title}</h1>
        <p className="hidden truncate text-sm text-ink-muted sm:block">{section.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <ResetDemoButton />
        <SmartLink
          href="/"
          className="inline-flex size-10 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-tint hover:text-navy lg:hidden"
        >
          <ExternalIcon className="size-5" />
          <span className="sr-only">Back to the public website</span>
        </SmartLink>
        <div className="ml-2 hidden items-center gap-3 border-l border-line pl-5 lg:flex">
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full bg-navy font-heading text-sm font-bold text-white ring-2 ring-gold/70 ring-offset-2"
          >
            {initials}
          </span>
          <p className="leading-tight">
            <span className="block font-heading text-sm font-bold text-navy">{dashboardCopy.demoUser.name}</span>
            <span className="block text-xs text-ink-muted">{dashboardCopy.demoUser.role}</span>
          </p>
        </div>
      </div>
    </header>
  );
}
