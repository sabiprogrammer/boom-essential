"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";

/**
 * A modal side panel for a record's details. Focus moves into it and stays inside; Escape, the close button
 * and the backdrop close it; the page behind cannot scroll; focus returns to what opened it. On phones it
 * fills the screen, from tablet width it is a panel on the right. The header carries the record's identity and
 * status, the body holds separate sections on a quiet warm-white ground.
 */
export function DetailDrawer({
  eyebrow,
  title,
  subtitle,
  meta,
  onClose,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Status and other at-a-glance facts, shown under the title. */
  meta?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(true);
  useFocusTrap(panelRef, true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div aria-hidden="true" onClick={onClose} className="fade-in absolute inset-0 bg-navy-deep/60 backdrop-blur-[2px]" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="panel-in absolute inset-y-0 right-0 flex w-full flex-col bg-warm-white shadow-menu sm:max-w-xl"
      >
        <div className="border-b border-line bg-white px-5 pt-4 pb-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <p className="flex items-center gap-2.5 pt-2.5 font-heading text-xs font-bold tracking-[0.14em] text-ink-muted uppercase">
              <span aria-hidden="true" className="h-px w-5 bg-gold" />
              {eyebrow}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="grid size-11 shrink-0 place-items-center rounded-md border border-line-strong text-navy transition-colors hover:border-navy hover:bg-tint"
            >
              <CloseIcon className="size-5" />
              <span className="sr-only">Close details</span>
            </button>
          </div>
          <h2 id={headingId} className="mt-1 font-heading text-h3 leading-tight font-extrabold text-navy">
            {title}
          </h2>
          {subtitle ? <p className="mt-0.5 text-base text-ink-muted">{subtitle}</p> : null}
          {meta ? <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">{meta}</div> : null}
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
