"use client";

import { useSyncExternalStore } from "react";
import { createDemoReference, type DemoReference } from "@/lib/dashboard-preview/reference";

/**
 * The dashboard preview's reference moment, chosen ONCE per page load in the browser and then reused, so every
 * view and every later interaction agrees on what "today" is.
 *
 * It is `null` on the server and during the first hydration pass, which is what keeps the page free of
 * hydration mismatches: the server never renders a date that depends on the clock, and React switches to the
 * browser's value straight after hydrating. The date is the Africa/Lagos calendar day, whatever time zone the
 * device is set to. Nothing is stored (no localStorage, sessionStorage or cookies).
 */
let chosen: DemoReference | null = null;

const subscribe = () => () => {};

function getBrowserReference(): DemoReference {
  chosen ??= createDemoReference(new Date());
  return chosen;
}

function getServerReference(): null {
  return null;
}

export function useDemoReference(): DemoReference | null {
  return useSyncExternalStore(subscribe, getBrowserReference, getServerReference);
}
