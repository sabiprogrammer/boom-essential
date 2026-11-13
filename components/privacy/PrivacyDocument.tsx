import { privacyContent } from "@/content/privacy";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PrivacyIndex } from "./PrivacyIndex";
import { PrivacySectionView } from "./PrivacySectionView";

/** The body of the Privacy Notice: the date it was last updated, the section index and every section, on a Warm White ground. */
export function PrivacyDocument() {
  const { lastUpdated, lastUpdatedIso, indexLabel, sections } = privacyContent;

  return (
    <Section tone="light" space="lg" aria-label="Privacy Notice">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-4 xl:col-span-3">
            <PrivacyIndex label={indexLabel} sections={sections} />
          </div>

          <article className="min-w-0 lg:col-span-8 xl:col-span-9">
            <p className="mb-10 max-w-prose font-heading text-sm font-semibold text-ink-muted">
              Last updated: <time dateTime={lastUpdatedIso}>{lastUpdated}</time>
            </p>
            <div className="max-w-prose space-y-12">
              {sections.map((section, index) => (
                <PrivacySectionView key={section.id} section={section} number={index + 1} />
              ))}
            </div>
          </article>
        </div>
      </Container>
    </Section>
  );
}
