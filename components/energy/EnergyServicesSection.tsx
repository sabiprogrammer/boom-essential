import { energyContent, energyServices } from "@/content/energy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projectPhotos } from "@/content/project-photos";
import { ServiceFeature } from "./ServiceFeature";
import { ServicePhoto } from "./ServicePhoto";
import { SustainBand } from "./SustainBand";
import { SystemBand } from "./SystemBand";

/**
 * All nine confirmed services in four different compositions, in the order a customer meets them:
 * the first two as large features with the client's own photographs, then the installed system, then upkeep and growth,
 * then the two services defined by property type.
 */
export function EnergyServicesSection() {
  const { eyebrow, heading, lead, groups } = energyContent.services;
  const [audit, design] = energyServices;

  return (
    <>
      <Section tone="white" space="lg" id="services" aria-labelledby="energy-services-heading">
        <Container>
          <div className="reveal">
            <SectionHeading id="energy-services-heading" eyebrow={eyebrow} title={heading} lead={lead} />
          </div>

          <h3 className="reveal mt-16 font-heading text-xs font-bold tracking-[0.16em] text-ink-muted uppercase lg:mt-24">
            Services 01 and 02 &middot; {groups.understand}
          </h3>

          <div className="mt-10 space-y-20 lg:space-y-28">
            <ServiceFeature service={audit} visual={<ServicePhoto photo={projectPhotos.team} position="50% 55%" />} />
            <ServiceFeature service={design} visual={<ServicePhoto photo={projectPhotos.inverterUnits} position="50% 22%" />} flip />
          </div>
        </Container>
      </Section>
      <SystemBand />
      <SustainBand />
    </>
  );
}
