import type { CSSProperties } from "react";
import { aboutContent } from "@/content/about";
import { divisions } from "@/content/divisions";
import { Container } from "@/components/ui/Container";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** Rising floors of the three columns echo the ascending bars of the logo. Applies from lg only. */
const columnHeights = ["lg:min-h-[11rem]", "lg:min-h-[14.5rem]", "lg:min-h-[18rem]"];

/**
 * About hero on Deep Navy: oversized headline, a one-line statement of who the company is, and the
 * tagline set as three ruled columns that stand on the section's baseline and rise to the right.
 */
export function AboutHero() {
  const { eyebrow, heading, statement } = aboutContent.hero;

  return (
    <section
      data-surface="dark"
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden bg-navy pt-14 text-white sm:pt-20 lg:pt-24"
    >
      <Container>
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="rise flex items-center gap-3 font-heading text-xs font-bold tracking-[0.18em] uppercase" style={delay(0)}>
              <span aria-hidden="true" className="h-0.5 w-10 shrink-0 bg-gold" />
              {eyebrow}
            </p>
            <h1
              id="about-heading"
              className="rise mt-7 text-[clamp(2.5rem,1.1rem+5vw,5rem)] leading-[1.04] font-extrabold text-balance text-white"
              style={delay(120)}
            >
              {heading}
            </h1>
          </div>

          <p className="rise max-w-md text-lead text-on-dark-muted lg:col-span-4 lg:pb-3" style={delay(280)}>
            {statement}
          </p>
        </div>

        <ol
          aria-label="Power. Protection. Provision."
          className="mt-14 grid sm:mt-20 lg:mt-24 lg:grid-cols-3 lg:items-end"
        >
          {divisions.map((division, index) => (
            <li
              key={division.id}
              className={`rise flex flex-col justify-between border-t-2 border-gold py-6 sm:py-7 lg:py-8 lg:pr-6 ${columnHeights[index]} ${
                index === 0 ? "" : "lg:border-l lg:border-l-line-on-dark lg:pl-8"
              }`}
              style={delay(420 + index * 140)}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 lg:block">
                <p className="font-heading text-[clamp(1.875rem,1.4rem+1.6vw,2.5rem)] leading-none font-extrabold break-words text-white">
                  {division.word}.
                </p>
                <p className="font-heading text-sm font-bold tracking-[0.14em] whitespace-nowrap text-on-dark-muted uppercase lg:mt-4">
                  {division.name}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
