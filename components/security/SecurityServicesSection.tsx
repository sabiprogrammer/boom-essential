import { securityContent } from "@/content/security";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MonitoringRows } from "./MonitoringRows";
import { PerimeterPanels } from "./PerimeterPanels";
import { SurveillanceBand } from "./SurveillanceBand";

/**
 * All seven confirmed services in three groups, each with its own composition: the camera system as a
 * dark signal-linked band, perimeter and entry as paired diagram panels, then monitoring and assessment
 * as ledger rows. Every service carries a viewfinder-bracketed number.
 */
export function SecurityServicesSection() {
  const { eyebrow, heading, lead } = securityContent.services;

  return (
    <>
      <Section tone="charcoal" space="lg" id="services" aria-labelledby="security-services-heading">
        <Container>
          <div className="reveal">
            <SectionHeading id="security-services-heading" surface="dark" eyebrow={eyebrow} title={heading} lead={lead} />
          </div>
          <SurveillanceBand />
        </Container>
      </Section>
      <PerimeterPanels />
      <MonitoringRows />
    </>
  );
}
