import { aboutContent } from "@/content/about";
import { leadership } from "@/content/leadership";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LeaderEntry } from "./LeaderEntry";

/**
 * Leadership gallery. The Chief Executive Officer leads as a featured entry, then the other four sit
 * on a staggered row (alternate portraits step down on large screens) rather than a uniform card grid.
 */
export function LeadershipSection() {
  const { eyebrow, heading, lead } = aboutContent.leadership;
  const [chief, ...team] = leadership;

  return (
    <Section tone="tint" space="lg" id="leadership" aria-labelledby="about-leadership-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="about-leadership-heading" eyebrow={eyebrow} title={heading} lead={lead} />
        </div>

        <div className="mt-14 lg:mt-20">
          <LeaderEntry member={chief} featured />
        </div>

        <ul className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-y-14 lg:mt-24 lg:grid-cols-4 lg:gap-x-10">
          {team.map((member, index) => (
            <li key={member.name} className={index % 2 === 1 ? "lg:mt-16" : ""}>
              <LeaderEntry member={member} index={index} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
