"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/admin", label: "Enquiries" },
  { href: "/admin/appointments", label: "Appointments" },
] as const;

/**
 * Switches between the administrator's two working areas. The current one is marked with aria-current and a gold
 * underline (never colour alone). It only navigates: access to every page is decided on the server, not here.
 */
export function AdminNav() {
  const pathname = usePathname();
  const current = pathname.startsWith("/admin/appointments") ? "/admin/appointments" : "/admin";

  return (
    <nav aria-label="Administration sections" className="border-t border-white/10">
      <ul className="mx-auto flex w-full max-w-content gap-1 px-gutter">
        {sections.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              aria-current={section.href === current ? "page" : undefined}
              className="relative inline-flex h-12 items-center px-4 font-heading text-sm font-semibold text-on-dark-muted transition-colors hover:text-white aria-[current=page]:text-white after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-gold after:opacity-0 aria-[current=page]:after:opacity-100"
            >
              {section.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
