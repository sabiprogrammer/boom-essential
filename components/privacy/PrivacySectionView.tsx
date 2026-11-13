import type { PrivacySection } from "@/content/privacy";
import { PrivacyContact } from "./PrivacyContact";

/**
 * One section of the notice: a numbered heading with an anchor, then its paragraphs, bullet lists and notes in the order
 * they are written in content/privacy.ts. Plain text only: nothing here is built from user input.
 */
export function PrivacySectionView({ section, number }: { section: PrivacySection; number: number }) {
  const headingId = `privacy-${section.id}`;

  return (
    <section id={section.id} aria-labelledby={headingId} className="scroll-mt-28 border-t border-line-strong pt-10 first:border-t-0 first:pt-0">
      <h2 id={headingId} className="flex items-baseline gap-4 font-heading text-h3 leading-tight font-extrabold text-navy">
        <span aria-hidden="true" className="font-heading text-base font-bold text-gold tabular-nums">
          {String(number).padStart(2, "0")}
        </span>
        <span>{section.heading}</span>
      </h2>

      <div className="mt-5 space-y-5 text-body text-charcoal">
        {section.blocks.map((block, index) => {
          switch (block.type) {
            case "p":
              return <p key={index}>{block.text}</p>;
            case "ul":
              return (
                <ul key={index} className="list-disc space-y-2.5 pl-6 marker:text-gold">
                  {block.items.map((item) => (
                    <li key={item} className="pl-1">
                      {item}
                    </li>
                  ))}
                </ul>
              );
            case "note":
              return (
                <p key={index} className="border-l-4 border-gold bg-white p-5 text-charcoal shadow-panel">
                  {block.text}
                </p>
              );
            case "contact":
              return <PrivacyContact key={index} />;
          }
        })}
      </div>
    </section>
  );
}
