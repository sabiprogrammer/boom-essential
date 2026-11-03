"use client";

import { usePathname } from "next/navigation";
import type { NavLinkItem } from "@/content/navigation";
import { isActivePath } from "@/lib/navigation";
import { SmartLink } from "@/components/ui/SmartLink";
import { navItemClasses } from "./nav-styles";

/** Desktop top-level navigation link with active-page state (aria-current). */
export function NavLink({ item }: { item: NavLinkItem }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);

  return (
    <SmartLink href={item.href} aria-current={active ? "page" : undefined} className={navItemClasses(active)}>
      {item.label}
    </SmartLink>
  );
}
