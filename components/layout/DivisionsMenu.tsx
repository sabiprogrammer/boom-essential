"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { divisionLinks, divisionsLabel } from "@/content/navigation";
import { isActivePath } from "@/lib/navigation";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/ui/icons";
import { SmartLink } from "@/components/ui/SmartLink";
import { navItemClasses } from "./nav-styles";

/**
 * "Our Divisions" dropdown (disclosure pattern: a button that shows a list of normal links).
 *  - Mouse: opens on hover, closes shortly after the pointer leaves; clicking pins it open.
 *  - Touch / click: toggles. Click outside closes.
 *  - Keyboard: Enter/Space toggle, ArrowDown opens and moves to the first link, Arrow/Home/End move between
 *    links, Escape closes and returns focus to the button, tabbing out closes.
 */
export function DivisionsMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedByHover = useRef(false);
  const focusFirstOnOpen = useRef(false);
  const panelId = useId();

  const active = divisionLinks.some((link) => isActivePath(pathname, link.href));

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }, []);

  const close = useCallback(() => {
    clearHoverTimer();
    openedByHover.current = false;
    setOpen(false);
  }, [clearHoverTimer]);

  const getLinks = useCallback(
    () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
    [],
  );

  useEffect(() => {
    if (open && focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      getLinks()[0]?.focus();
    }
  }, [open, getLinks]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  useEffect(() => clearHoverTimer, [clearHoverTimer]);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearHoverTimer();
    if (!open) openedByHover.current = true;
    setOpen(true);
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => {
      if (openedByHover.current) close();
    }, 140);
  };

  const onButtonClick = () => {
    if (open && openedByHover.current) {
      openedByHover.current = false; // pin it open
      return;
    }
    if (open) close();
    else setOpen(true);
  };

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    if (open) {
      getLinks()[0]?.focus();
    } else {
      focusFirstOnOpen.current = true;
      setOpen(true);
    }
  };

  const onRootKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
      buttonRef.current?.focus();
      return;
    }

    if (!panelRef.current?.contains(document.activeElement)) return;
    const links = getLinks();
    const index = links.findIndex((link) => link === document.activeElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      links[(index + 1) % links.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      links[(index - 1 + links.length) % links.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      links[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      links[links.length - 1]?.focus();
    }
  };

  const onRootBlur = (event: FocusEvent) => {
    if (open && !rootRef.current?.contains(event.relatedTarget as Node | null)) close();
  };

  return (
    <li
      ref={rootRef}
      className="relative"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={onRootKeyDown}
      onBlur={onRootBlur}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onButtonClick}
        onKeyDown={onButtonKeyDown}
        className={`${navItemClasses(active)} gap-1.5`}
      >
        {divisionsLabel}
        <ChevronDownIcon
          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={panelId}
        ref={panelRef}
        inert={!open}
        className={`absolute top-full left-0 z-50 w-[23rem] pt-3 transition-[opacity,translate] duration-200 ${
          open ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
        }`}
      >
        <div className="border-t-2 border-gold bg-white shadow-menu">
          <ul>
            {divisionLinks.map((link) => {
              const current = isActivePath(pathname, link.href);
              return (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <SmartLink
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    onClick={close}
                    className="group/item relative flex items-center justify-between gap-4 px-6 py-4 transition-colors duration-200 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:origin-top before:scale-y-0 before:bg-gold before:transition-transform before:duration-300 hover:bg-tint hover:before:scale-y-100 focus-visible:bg-tint focus-visible:-outline-offset-4 aria-[current=page]:bg-tint aria-[current=page]:before:scale-y-100 aria-[current=page]:before:bg-navy"
                  >
                    <span>
                      <span className="block font-heading text-base font-bold text-navy">{link.label}</span>
                      <span className="mt-0.5 block text-sm text-ink-muted">{link.description}</span>
                    </span>
                    <ArrowRightIcon className="size-5 shrink-0 -translate-x-1 text-navy opacity-0 transition-[opacity,translate] duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100" />
                  </SmartLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}
