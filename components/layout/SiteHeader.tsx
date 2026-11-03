"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { consultation } from "@/content/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { MenuIcon } from "@/components/ui/icons";
import { BrandLogo } from "./BrandLogo";
import { DesktopNav } from "./DesktopNav";
import { MobileDrawer } from "./MobileDrawer";

/**
 * Sticky site header. White surface (the supplied logo is a JPEG on white).
 * On scroll it becomes more compact and gains a soft shadow.
 */
export function SiteHeader() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // If the window grows to the desktop layout while the drawer is open, close it.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group/header sticky top-0 z-40 border-b border-line bg-white transition-shadow duration-300 data-[scrolled=true]:shadow-header"
    >
      <Container className="flex h-(--header-height) items-center justify-between gap-6 transition-[height] duration-300 group-data-[scrolled=true]/header:h-(--header-height-compact)">
        <BrandLogo />

        <div className="flex items-center gap-3 xl:gap-6">
          <DesktopNav />

          <div className="hidden md:block">
            <ButtonLink href={consultation.href} size="sm" arrow>
              {consultation.label}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls={drawerId}
            aria-label="Open main menu"
            className="inline-flex h-11 items-center gap-2 border border-line-strong px-3 font-heading text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy hover:bg-tint lg:hidden"
          >
            <MenuIcon className="size-6" />
            <span className="hidden xs:inline">Menu</span>
          </button>
        </div>
      </Container>

      <MobileDrawer id={drawerId} open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
