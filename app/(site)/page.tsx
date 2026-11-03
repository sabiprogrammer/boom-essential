import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BreakpointIndicator } from "./_preview/BreakpointIndicator";
import { ColourSection } from "./_preview/ColourSection";
import { ControlsSection } from "./_preview/ControlsSection";
import { LayoutTokensSection } from "./_preview/LayoutTokensSection";
import { PreviewBanner } from "./_preview/PreviewBanner";
import { TestingGuideSection } from "./_preview/TestingGuideSection";
import { TypographySection } from "./_preview/TypographySection";

export const metadata: Metadata = {
  title: "Design preview",
  robots: { index: false, follow: false },
};

/**
 * TEMPORARY Stage 1 design preview. Not the homepage. Replaced at the homepage milestone
 * (delete this file's content and the ./_preview folder then).
 */
export default function DesignPreviewPage() {
  return (
    <>
      <PreviewBanner />

      <Section tone="light" space="md" aria-labelledby="preview-intro">
        <Container>
          <SectionHeading
            as="h1"
            id="preview-intro"
            eyebrow="Stage 1 · Design foundation"
            title="BOOM MULTI GLOBAL design system preview"
            lead="Colour, typography, controls, layout tokens, and the live header and footer. Real photography and page content arrive in later stages."
          />
          <div className="mt-8">
            <BreakpointIndicator />
          </div>
        </Container>
      </Section>

      <ColourSection />
      <TypographySection />
      <ControlsSection />
      <LayoutTokensSection />
      <TestingGuideSection />
    </>
  );
}
