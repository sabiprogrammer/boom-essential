import type { CSSProperties } from "react";
import { leadership } from "@/content/leadership";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";

/**
 * Compact leadership introduction: names and official positions only (no biographies exist).
 * Portraits are intentionally not used here; they are reserved for the About page once the
 * photo-quality issues in docs/asset-inventory.md are resolved.
 */
export function LeadershipPreviewSection() {
  return (
    <Section tone="white" aria-labelledby="leadership-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="reveal lg:col-span-4">
            <SectionHeading
              id="leadership-heading"
              eyebrow="Leadership"
              title="The people leading BOOM MULTI GLOBAL"
            />
            <p className="mt-8">
              <TextLink href="/about" arrow>
                Meet the team on our About Us page
              </TextLink>
            </p>
          </div>

          <ul className="border-t-2 border-navy lg:col-span-8">
            {leadership.map((person, index) => (
              <li
                key={person.name}
                className="reveal group/person grid gap-1 border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
                style={{ "--i": index } as CSSProperties}
              >
                <p className="font-heading text-h3 font-extrabold text-navy transition-transform duration-300 group-hover/person:translate-x-1.5">
                  {person.name}
                </p>
                <p className="text-base text-ink-muted sm:text-right">{person.position}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
