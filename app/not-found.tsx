import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = { title: "Page not found" };

/** Global 404, shown inside the site frame so navigation stays available. */
export default function NotFound() {
  return (
    <SiteShell>
      <Section tone="light" space="md">
        <Container size="narrow">
          <SectionHeading
            as="h1"
            eyebrow="Error 404"
            title="Page not found"
            lead="The page you are looking for is not available. Use the menu above, or return to the home page."
          />
          <div className="mt-10">
            <ButtonLink href="/" arrow>
              Back to home
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
