import type { CSSProperties } from "react";
import { securityContent, securityServices } from "@/content/security";
import { SecurityIcon } from "./SecurityIcon";
import { ServiceIndex } from "./ServiceIndex";

/**
 * CCTV supply, installation and maintenance as three stages of one camera system, joined by a dashed
 * signal line. Rendered inside the dark services section.
 */
export function SurveillanceBand() {
  const items = securityServices.slice(0, 3);

  return (
    <div className="mt-20 lg:mt-28">
      <h3 className="reveal font-heading text-xs font-bold tracking-[0.16em] text-on-dark-muted uppercase">
        Services 01 to 03 &middot; {securityContent.services.groups.surveillance}
      </h3>

      <ol className="relative mt-10 grid gap-12 lg:grid-cols-3 lg:gap-x-12">
        <span
          aria-hidden="true"
          className="absolute top-8 right-[calc(33.333%-4rem)] left-24 hidden border-t border-dashed border-gold/60 lg:block"
        />
        {items.map((service, index) => (
          <li
            key={service.number}
            className="reveal relative border-t border-line-on-dark pt-8 lg:border-t-0 lg:pt-0"
            style={{ "--i": index } as CSSProperties}
          >
            <div className="relative flex items-center gap-5">
              <ServiceIndex number={service.number} surface="dark" className="bg-charcoal" />
              <SecurityIcon name={service.icon} className="relative size-9 bg-charcoal text-gold" />
            </div>
            <h4 className="mt-8 text-h3 font-extrabold text-white">{service.title}</h4>
            <p className="mt-4 max-w-sm text-body text-on-dark-muted">{service.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
