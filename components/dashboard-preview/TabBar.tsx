"use client";

import Link from "next/link";
import { dashboardSections } from "@/content/dashboard-preview";
import { useActiveDashboardSection } from "@/hooks/useActiveDashboardSection";
import { SectionIcon } from "./SectionIcon";
import { useSectionBadges } from "./useSectionBadges";

/** Mobile and tablet navigation (below lg): a bottom bar with the three sections, thumb-reachable. */
export function TabBar() {
  const active = useActiveDashboardSection();
  const badges = useSectionBadges();

  return (
    <nav
      aria-label="Dashboard sections"
      data-surface="dark"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navy pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(6_31_64/0.5)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-3">
        {dashboardSections.map((section) => {
          const current = section.id === active.id;
          const badge = badges[section.id];
          return (
            <li key={section.id}>
              <Link
                href={section.href}
                aria-current={current ? "page" : undefined}
                className="relative flex min-h-16 flex-col items-center justify-center gap-1 px-2 font-heading text-xs font-semibold text-on-dark-muted transition-colors before:absolute before:inset-x-7 before:top-0 before:h-[3px] before:rounded-b-full before:bg-gold before:opacity-0 aria-[current=page]:text-white aria-[current=page]:before:opacity-100"
              >
                <span className="relative">
                  <SectionIcon id={section.id} className={`size-6 ${current ? "text-gold" : ""}`} />
                  {badge ? (
                    <span className="absolute -top-2 -right-4 min-w-5 rounded-full bg-gold px-1 text-center font-heading text-[0.6875rem] leading-5 font-bold text-navy tabular-nums">
                      {badge}
                      <span className="sr-only">{section.id === "enquiries" ? " new" : " awaiting confirmation"}</span>
                    </span>
                  ) : null}
                </span>
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
