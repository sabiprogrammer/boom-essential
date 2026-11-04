import type { ReactNode } from "react";
import type { EnergyService } from "@/content/energy";
import { EnergyIcon } from "./EnergyIcon";

type ServiceFeatureProps = {
  service: EnergyService;
  /** Illustrative diagram shown beside the text. */
  visual: ReactNode;
  /** Puts the visual on the right on large screens. */
  flip?: boolean;
};

/** A leading service shown large: diagram on one side, number, icon, title and description on the other. */
export function ServiceFeature({ service, visual, flip = false }: ServiceFeatureProps) {
  const headingId = `service-${service.number}`;

  return (
    <article aria-labelledby={headingId} className="reveal grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-16">
      <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
        <div className="aspect-[9/7] overflow-hidden border-t-[3px] border-gold">{visual}</div>
      </div>

      <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-4 text-navy">
          <span aria-hidden="true" className="font-heading text-sm font-bold tracking-[0.16em]">
            {service.number}
          </span>
          <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
          <EnergyIcon name={service.icon} className="size-9" />
        </div>
        <h4 id={headingId} className="mt-6 text-h1 font-extrabold text-balance text-navy">
          {service.title}
        </h4>
        <p className="mt-5 max-w-xl text-lead text-ink-muted">{service.description}</p>
      </div>
    </article>
  );
}
