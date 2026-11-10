import type { CSSProperties } from "react";
import { coreValues } from "@/content/values";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The three confirmed core values as large typographic statements on Deep Navy.
 * An explanation is shown only when the client's own wording exists in content/values.ts.
 */
export function CoreValuesSection() {
  return (
    <Section tone="navy" space="lg" aria-labelledby="values-heading">
      <Container>
        <div className="reveal">
          <SectionHeading
            id="values-heading"
            surface="dark"
            eyebrow="Our core values"
            title="What guides Boom Multi Global"
          />
        </div>

        <ol className="mt-16 border-t border-line-on-dark lg:mt-20">
          {coreValues.map((value, index) => (
            <li
              key={value.name}
              className="reveal group/value grid items-baseline gap-x-8 gap-y-3 border-b border-line-on-dark py-9 sm:py-12 lg:grid-cols-12"
              style={{ "--i": index } as CSSProperties}
            >
              <span
                aria-hidden="true"
                className="font-heading text-sm font-bold tracking-[0.16em] text-gold tabular-nums lg:col-span-1"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                className={`break-words text-h1 font-extrabold text-white transition-transform duration-500 ease-(--ease-standard) group-hover/value:translate-x-2 sm:text-display ${
                  value.description ? "lg:col-span-7 lg:text-[clamp(3rem,1rem+4vw,4.5rem)]" : "lg:col-span-11"
                }`}
              >
                {value.name}
              </h3>
              {value.description ? (
                <p className="max-w-md text-lead text-on-dark-muted lg:col-span-4">{value.description}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
