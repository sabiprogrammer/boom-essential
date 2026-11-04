import type { CSSProperties, ReactNode } from "react";
import { securityContent, securityServices, type SecurityService } from "@/content/security";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PlanDiagram } from "./PlanDiagram";
import { SecurityIcon } from "./SecurityIcon";
import { ServiceIndex } from "./ServiceIndex";
import { SignalDiagram } from "./SignalDiagram";

function Row({ service, visual, index }: { service: SecurityService; visual: ReactNode; index: number }) {
  const headingId = `security-service-${service.number}`;
  return (
    <article
      aria-labelledby={headingId}
      className="reveal grid items-center gap-8 border-b border-line-strong py-10 lg:grid-cols-12 lg:gap-x-12 lg:py-14"
      style={{ "--i": index } as CSSProperties}
    >
      <div className="flex items-center gap-5 text-navy lg:col-span-2 lg:flex-col lg:items-start lg:gap-6">
        <ServiceIndex number={service.number} />
        <SecurityIcon name={service.icon} className="size-9" />
      </div>
      <div className="lg:col-span-5">
        <h4 id={headingId} className="text-h2 font-extrabold text-navy">
          {service.title}
        </h4>
        <p className="mt-4 max-w-lg text-lead text-ink-muted">{service.description}</p>
      </div>
      <div className="lg:col-span-5">
        <div className="aspect-[20/11] overflow-hidden border-t-[3px] border-gold">{visual}</div>
      </div>
    </article>
  );
}

/** Remote monitoring and security assessment as ledger rows: marker, text and a small diagram. */
export function MonitoringRows() {
  const [monitoring, assessment] = securityServices.slice(5);

  return (
    <Section tone="white" space="lg" aria-labelledby="security-monitoring-heading">
      <Container>
        <h3
          id="security-monitoring-heading"
          className="reveal font-heading text-xs font-bold tracking-[0.16em] text-navy uppercase"
        >
          Services 06 and 07 &middot; {securityContent.services.groups.monitoring}
        </h3>
        <div className="mt-6 border-t-2 border-navy">
          <Row service={monitoring} visual={<SignalDiagram className="size-full" />} index={0} />
          <Row service={assessment} visual={<PlanDiagram className="size-full" />} index={1} />
        </div>
      </Container>
    </Section>
  );
}
