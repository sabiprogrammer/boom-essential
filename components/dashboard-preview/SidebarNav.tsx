"use client";

import Link from "next/link";
import { dashboardSections } from "@/content/dashboard-preview";
import { useActiveDashboardSection } from "@/hooks/useActiveDashboardSection";
import { SectionIcon } from "./SectionIcon";
import { useSectionBadges } from "./useSectionBadges";

/** Desktop sidebar navigation: inset rows, the active one marked with a gold bar, a lit icon and aria-current. */
export function SidebarNav() {
  const active = useActiveDashboardSection();
  const badges = useSectionBadges();

  return (
    <nav aria-label="Dashboard sections">
      <ul className="space-y-1">
        {dashboardSections.map((section) => {
          const badge = badges[section.id];
          return (
            <li key={section.id}>
              <Link
                href={section.href}
                aria-current={section.id === active.id ? "page" : undefined}
                className="group relative flex min-h-11 items-center gap-3 rounded-md px-3 font-heading text-[0.9375rem] font-semibold text-on-dark-muted transition-colors duration-200 before:absolute before:inset-y-2.5 before:-left-3 before:w-[3px] before:rounded-r-full before:bg-gold before:opacity-0 before:transition-opacity hover:bg-white/[0.06] hover:text-white aria-[current=page]:bg-white/[0.1] aria-[current=page]:text-white aria-[current=page]:before:opacity-100"
              >
                <SectionIcon
                  id={section.id}
                  className="size-5 shrink-0 text-on-dark-muted transition-colors group-hover:text-white group-aria-[current=page]:text-gold"
                />
                <span className="flex-1">{section.label}</span>
                {badge ? (
                  <span className="min-w-6 rounded-full bg-gold/15 px-2 py-0.5 text-center font-heading text-xs font-bold text-gold tabular-nums ring-1 ring-gold/40">
                    {badge}
                    <span className="sr-only">{section.id === "enquiries" ? " new" : " awaiting confirmation"}</span>
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
