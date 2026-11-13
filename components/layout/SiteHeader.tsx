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
 * Sticky site header. White surface (the supplied logo is a JPEG on white), except at the very top of a page that
 * opens with a hero: there it is transparent over the hero (see `app/header.css`) and turns white, more compact and
 * shadowed once the page scrolls. The colour switch is pure CSS; the `header-clear-dark:` classes below only apply
 * while the header is transparent over a dark hero.
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
      className="site-header group/header sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 data-[scrolled=true]:shadow-header"
    >
      <Container className="flex h-(--header-height) items-center justify-between gap-6 transition-[height] duration-300 group-data-[scrolled=true]/header:h-(--header-height-compact)">
        <BrandLogo />

        <div className="flex items-center gap-3 xl:gap-6">
          <DesktopNav />

          <div className="hidden md:block lg:hidden xl:block">
            <ButtonLink
              href={consultation.href}
              size="sm"
              arrow
              className="header-clear-dark:border-gold header-clear-dark:bg-gold header-clear-dark:text-navy header-clear-dark:hover:border-gold-hover header-clear-dark:hover:bg-gold-hover"
            >
              {consultation.label}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls={drawerId}
            aria-label="Open main menu"
            className="inline-flex h-11 items-center gap-2 border border-line-strong px-3 font-heading text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy hover:bg-tint header-clear-dark:border-white/50 header-clear-dark:text-white header-clear-dark:hover:border-white header-clear-dark:hover:bg-white/10 lg:hidden"
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
