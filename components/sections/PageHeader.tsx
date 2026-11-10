import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/ui/Container";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

type PageHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  lead: ReactNode;
};

/**
 * Header for the plain content pages (Projects, Products catalogue, Careers): Deep Navy, a gold-ruled eyebrow,
 * a large headline and a short lead. The same voice as the About hero, without the three-column tagline.
 */
export function PageHeader({ id, eyebrow, title, lead }: PageHeaderProps) {
  return (
    <section data-surface="dark" aria-labelledby={id} className="bg-navy pt-14 pb-14 text-white sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      <Container>
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="rise flex items-center gap-3 font-heading text-xs font-bold tracking-[0.18em] uppercase" style={delay(0)}>
              <span aria-hidden="true" className="h-0.5 w-10 shrink-0 bg-gold" />
              {eyebrow}
            </p>
            <h1
              id={id}
              className="rise mt-7 text-[clamp(2.5rem,1.1rem+5vw,5rem)] leading-[1.04] font-extrabold text-balance text-white"
              style={delay(120)}
            >
              {title}
            </h1>
          </div>
          <p className="rise max-w-md text-lead text-on-dark-muted lg:col-span-4 lg:pb-3" style={delay(260)}>
            {lead}
          </p>
        </div>
      </Container>
    </section>
  );
}
