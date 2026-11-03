import type { CSSProperties } from "react";
import { aboutContent } from "@/content/about";
import { coreValues } from "@/content/values";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Each value starts further along than the last, so the three read as steps up: progress made visible. */
const steps = ["", "lg:ml-[9%]", "lg:ml-[18%]"];

/** The three confirmed core values with the client's own wording, set as a stepped staircase. */
export function AboutValuesSection() {
  const { eyebrow, heading } = aboutContent.values;

  return (
    <Section tone="tint" space="lg" aria-labelledby="about-values-heading">
      <Container>
        <div className="reveal">
          <SectionHeading id="about-values-heading" eyebrow={eyebrow} title={heading} />
        </div>

        <ol className="mt-14 space-y-12 lg:mt-20 lg:space-y-16">
          {coreValues.map((value, index) => (
            <li
              key={value.name}
              className={`reveal border-t-2 border-navy pt-7 ${steps[index] ?? ""}`}
              style={{ "--i": index } as CSSProperties}
            >
              <div className="grid items-start gap-x-12 gap-y-4 lg:grid-cols-2">
                <h3 className="break-words text-h1 font-extrabold text-navy">{value.name}</h3>
                {value.description ? (
                  <p className="max-w-md text-lead text-charcoal lg:pt-3">{value.description}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
