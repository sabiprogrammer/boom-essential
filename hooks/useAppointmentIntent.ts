"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Whether the visitor has asked for an appointment request, tracked from where the request comes from:
 *  - the URL hash (`#appointment`) when the page is first loaded or navigated to, read once the URL has been
 *    updated, plus hash changes and history navigation (`hashchange`, `popstate`);
 *  - a click on any link to `/contact...#appointment` made while the form is on screen (the header and footer
 *    "Request a Consultation" actions and the Energy and Security assessment actions).
 *
 * Why clicks? A hash-only navigation inside the Next.js router uses `history.pushState`, which fires no
 * `hashchange` event, and when the URL already ends in `#appointment` nothing about the URL changes at all.
 * Reading the click is independent of the router's internals and works without a page reload.
 *
 * `requested` is the current intent (a link to /contact without #appointment clears it). `requests`
 * increases on every appointment request, so a repeat request, after the visitor un-ticked the box, is still
 * noticed. The form ticks the box and scrolls to it when `requests` changes. `resets` increases whenever a
 * standing request is cleared (a plain "Contact Us" visit), so a box that was only ticked by a link, and that
 * the visitor never touched, can be cleared again. Plain "Contact Us" links never enable it.
 *
 * Next.js (cacheComponents) keeps a visited route alive when the visitor navigates away, so this state
 * must be reconciled when they come back, which the mount-time sync below does.
 */
export type AppointmentIntent = { requested: boolean; requests: number; resets: number };

const CONTACT_PATH = "/contact";
const APPOINTMENT_HASH = "#appointment";

const serverIntent: AppointmentIntent = { requested: false, requests: 0, resets: 0 };
let intent: AppointmentIntent | null = null;
let listening = false;
const listeners = new Set<() => void>();

function current(): AppointmentIntent {
  if (!intent) {
    const requested = window.location.hash === APPOINTMENT_HASH;
    intent = { requested, requests: requested ? 1 : 0, resets: 0 };
  }
  return intent;
}

function publish(next: AppointmentIntent) {
  intent = next;
  listeners.forEach((listener) => listener());
}

/** A deliberate appointment request: always counts, even if the intent was already set. */
function request() {
  const previous = current();
  publish({ requested: true, requests: previous.requests + 1, resets: previous.resets });
}

/** The visitor is going to /contact without an appointment request: clear the intent without counting a request. */
function clear() {
  const previous = current();
  if (previous.requested) publish({ requested: false, requests: previous.requests, resets: previous.resets + 1 });
}

/** Brings the intent in line with the URL, counting a request only when it newly appears. */
function syncFromLocation() {
  const wantsAppointment = window.location.hash === APPOINTMENT_HASH;
  if (wantsAppointment && !current().requested) request();
  else if (!wantsAppointment) clear();
}

function onClick(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor || (anchor.target && anchor.target !== "_self")) return;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname !== CONTACT_PATH) return;

  if (url.hash === APPOINTMENT_HASH) request();
  else clear();
}

function subscribe(listener: () => void) {
  if (!listening) {
    listening = true;
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAppointmentIntent(): AppointmentIntent {
  // Once mounted, the router has updated the URL, so the hash is reliable even after a client-side navigation.
  useEffect(() => {
    syncFromLocation();
  }, []);

  return useSyncExternalStore(subscribe, current, () => serverIntent);
}
