"use client";

import { useEffect, useState } from "react";
import { company } from "@/content/company";
import { WhatsAppIcon } from "@/components/ui/icons";
import { SmartLink } from "@/components/ui/SmartLink";

/**
 * Persistent WhatsApp contact action, fixed to the bottom-right.
 *  - A 56px circle on small screens (thumb-friendly, minimal footprint); a labelled pill from md.
 *  - Respects device safe areas.
 *  - Fades out and becomes inert while the footer is in view, because the footer already lists
 *    WhatsApp and the button would otherwise cover footer content.
 */
export function WhatsAppAction() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      threshold: 0.01,
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <SmartLink
      href={company.whatsapp.href}
      aria-label="Chat with Boom Multi Global on WhatsApp (opens in a new tab)"
      inert={hidden}
      className={`fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex h-14 min-w-14 items-center justify-center gap-2.5 rounded-full bg-green px-4 font-heading text-sm font-semibold text-white shadow-raised transition-[opacity,translate,background-color] duration-300 hover:bg-green-hover print:hidden md:px-6 ${
        hidden ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="hidden md:inline">WhatsApp</span>
    </SmartLink>
  );
}
