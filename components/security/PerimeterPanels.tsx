import type { CSSProperties, ReactNode } from "react";
import { securityContent, securityServices, type SecurityService } from "@/content/security";
import { securityIllustrativeImages } from "@/content/security-illustrative-images";
import { Container } from "@/components/ui/Container";
import { IllustrativePhoto } from "@/components/ui/IllustrativePhoto";
import { Section } from "@/components/ui/Section";
import { SecurityIcon } from "./SecurityIcon";
import { ServiceIndex } from "./ServiceIndex";

function Panel({ service, visual, index }: { service: SecurityService; visual: ReactNode; index: number }) {
  const headingId = `security-service-${service.number}`;
  return (
    <article
      aria-labelledby={headingId}
      className="reveal border-t-[3px] border-gold bg-white"
      style={{ "--i": index } as CSSProperties}
    >
      {visual}
      <div className="p-7 sm:p-10">
        <div className="flex items-center justify-between gap-4 text-navy">
          <ServiceIndex number={service.number} />
          <SecurityIcon name={service.icon} className="size-10" />
        </div>
        <h4 id={headingId} className="mt-7 text-h2 font-extrabold text-navy">
          {service.title}
        </h4>
        <p className="mt-4 max-w-md text-lead text-ink-muted">{service.description}</p>
      </div>
    </article>
  );
}

/** Security fencing and access control as two side-by-side panels, each with an illustrative stock photograph. */
export function PerimeterPanels() {
  const [fencing, access] = securityServices.slice(3, 5);

  return (
    <Section tone="tint" space="lg" aria-labelledby="security-perimeter-heading">
      <Container>
        <h3
          id="security-perimeter-heading"
          className="reveal font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase"
        >
          Services 04 and 05 &middot; {securityContent.services.groups.perimeter}
        </h3>
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-x-10">
          <Panel service={fencing} visual={<IllustrativePhoto image={securityIllustrativeImages.perimeterFence} aspect="5 / 3" sizes="(min-width: 1024px) 45vw, 92vw" />} index={0} />
          <Panel service={access} visual={<IllustrativePhoto image={securityIllustrativeImages.accessControl} aspect="5 / 3" sizes="(min-width: 1024px) 45vw, 92vw" />} index={1} />
        </div>
      </Container>
    </Section>
  );
}
