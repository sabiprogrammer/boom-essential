"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { InfoIcon } from "./icons";

export type Notice = {
  title: string;
  body: string;
  /** Optional quoted text, shown set apart (for example the WhatsApp message that would be prefilled). */
  quote?: string;
};

type NoticeContextValue = { show: (notice: Notice) => void; dismiss: () => void };

const NoticeContext = createContext<NoticeContextValue | null>(null);
const visibleMs = 10_000;

/**
 * A single, refined notification for the dashboard (used to explain demo-mode contact actions). It is a polite
 * live region, never takes focus, closes itself after a while and can be closed with its button or Escape.
 */
export function NoticeProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<(Notice & { id: number }) | null>(null);

  const show = useCallback((notice: Notice) => setCurrent((previous) => ({ ...notice, id: (previous?.id ?? 0) + 1 })), []);
  const dismiss = useCallback(() => setCurrent(null), []);

  useEffect(() => {
    if (!current) return;
    const timer = window.setTimeout(() => setCurrent(null), visibleMs);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCurrent(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [current]);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <NoticeContext value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-8 lg:justify-start lg:px-8"
      >
        {current ? (
          <div
            key={current.id}
            className="panel-in pointer-events-auto relative w-full max-w-md overflow-hidden rounded-md border border-line bg-white py-4 pr-12 pl-5 shadow-menu"
          >
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gold" />
            <div className="flex gap-3">
              <InfoIcon className="mt-0.5 size-5 shrink-0 text-navy" />
              <div className="min-w-0">
                <p className="font-heading text-base font-extrabold text-navy">{current.title}</p>
                <p className="mt-1 text-sm text-charcoal">{current.body}</p>
                {current.quote ? (
                  <p className="mt-3 border-l-2 border-line-strong pl-3 text-sm text-ink-muted italic">{current.quote}</p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-2 right-2 grid size-10 place-items-center rounded-md text-ink-muted transition-colors hover:bg-tint hover:text-navy"
            >
              <CloseIcon className="size-5" />
              <span className="sr-only">Dismiss notification</span>
            </button>
          </div>
        ) : null}
      </div>
    </NoticeContext>
  );
}

export function useNotice(): NoticeContextValue {
  const value = useContext(NoticeContext);
  if (!value) throw new Error("useNotice must be used inside NoticeProvider");
  return value;
}
