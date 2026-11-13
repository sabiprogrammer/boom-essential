"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { company } from "@/content/company";
import {
  aboutLink,
  consultation,
  contactLink,
  divisionLinks,
  divisionsLabel,
  homeLink,
  productsLink,
  projectsLink,
  type NavLinkItem,
} from "@/content/navigation";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { isActivePath } from "@/lib/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CloseIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { SmartLink } from "@/components/ui/SmartLink";
import { TextLink } from "@/components/ui/TextLink";

type MobileDrawerProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

/** Entrance stagger: each row fades/slides in slightly after the previous one. */
function reveal(open: boolean, index: number): { className: string; style: CSSProperties } {
  return {
    className: `transition-[opacity,translate] duration-300 ${open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"}`,
    style: { transitionDelay: open ? `${120 + index * 35}ms` : "0ms" },
  };
}

function DrawerLink({
  item,
  index,
  open,
  pathname,
  onNavigate,
  showDescription = false,
}: {
  item: NavLinkItem;
  index: number;
  open: boolean;
  pathname: string | null;
  onNavigate: () => void;
  showDescription?: boolean;
}) {
  const active = isActivePath(pathname, item.href);
  const motion = reveal(open, index);

  return (
    <li className={motion.className} style={motion.style}>
      <SmartLink
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className="relative flex flex-col justify-center border-b border-line-on-dark py-3 pl-4 font-heading text-xl font-bold text-white transition-colors duration-200 before:absolute before:inset-y-3 before:left-0 before:w-0.5 before:bg-gold before:opacity-0 before:transition-opacity hover:text-gold aria-[current=page]:before:opacity-100"
      >
        {item.label}
        {showDescription && item.description ? (
          <span className="mt-0.5 font-sans text-sm font-normal text-on-dark-muted">{item.description}</span>
        ) : null}
      </SmartLink>
    </li>
  );
}

function GroupLabel({ children, open, index }: { children: string; open: boolean; index: number }) {
  const motion = reveal(open, index);
  return (
    <li
      aria-hidden="true"
      className={`pt-6 pb-1 pl-4 font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase ${motion.className}`}
      style={motion.style}
    >
      {children}
    </li>
  );
}

/**
 * Mobile/tablet navigation drawer (below lg). A modal dialog: focus is trapped inside while open,
 * Escape and the backdrop close it, the page behind cannot scroll, and the closed drawer is inert
 * (not focusable, hidden from assistive technology). `inert` is used instead of `visibility` so that
 * focus can move into the drawer on the very first frame of its opening transition.
 */
export function MobileDrawer({ id, open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div className="lg:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-charcoal/70 transition-[opacity,visibility] duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <div
        id={id}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        inert={!open}
        data-surface="dark"
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(26rem,100%)] flex-col bg-navy text-white transition-[translate] duration-300 ${
          open ? "translate-x-0 shadow-menu" : "translate-x-full"
        }`}
      >
        <div className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-line-on-dark px-gutter">
          <p className="font-heading text-sm leading-tight font-extrabold tracking-[0.14em]">
            BOOM
            <span className="block font-bold tracking-[0.2em] text-on-dark-muted">MULTI GLOBAL</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close main menu"
            className="inline-flex size-11 items-center justify-center border border-white/40 text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-navy"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>

        <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-gutter py-2">
          <ul>
            <DrawerLink item={homeLink} index={0} open={open} pathname={pathname} onNavigate={onClose} />
            <DrawerLink item={aboutLink} index={1} open={open} pathname={pathname} onNavigate={onClose} />
            <GroupLabel open={open} index={2}>
              {divisionsLabel}
            </GroupLabel>
            {divisionLinks.map((link, position) => (
              <DrawerLink
                key={link.href}
                item={link}
                index={3 + position}
                open={open}
                pathname={pathname}
                onNavigate={onClose}
                showDescription
              />
            ))}
            <GroupLabel open={open} index={6}>
              More
            </GroupLabel>
            <DrawerLink item={productsLink} index={7} open={open} pathname={pathname} onNavigate={onClose} />
            <DrawerLink item={projectsLink} index={8} open={open} pathname={pathname} onNavigate={onClose} />
            <DrawerLink item={contactLink} index={9} open={open} pathname={pathname} onNavigate={onClose} />
          </ul>
        </nav>

        <div className="shrink-0 space-y-4 border-t border-line-on-dark px-gutter py-5">
          <ButtonLink href={consultation.href} surface="dark" size="lg" arrow onClick={onClose} className="w-full">
            {consultation.label}
          </ButtonLink>
          <div className="flex flex-col gap-3 text-sm">
            <TextLink href={company.phone.href} surface="dark">
              <PhoneIcon className="size-5" />
              {company.phone.display}
            </TextLink>
            <TextLink href={company.whatsapp.href} surface="dark">
              <WhatsAppIcon className="size-5" />
              WhatsApp {company.whatsapp.display}
            </TextLink>
            <TextLink href={company.email.general.href} surface="dark">
              <MailIcon className="size-5" />
              {company.email.general.display}
            </TextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
