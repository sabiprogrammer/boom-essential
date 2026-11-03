import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contrastRatio, contrastVerdict } from "./contrast";

/* Hex values mirror app/tokens.css (preview-only copy, used to compute contrast). */
const brand = [
  { name: "Deep Navy", token: "navy", hex: "#092C59", role: "Primary: headings, buttons, hero grounds", className: "bg-navy text-white md:flex-[4]" },
  { name: "Charcoal Navy", token: "charcoal", hex: "#172B42", role: "Body text, footer, dark sections", className: "bg-charcoal text-white md:flex-[3]" },
  { name: "Agricultural Green", token: "green", hex: "#287447", role: "BOOM Foods accent, WhatsApp action", className: "bg-green text-white md:flex-[2]" },
  { name: "Gold", token: "gold", hex: "#E9AD19", role: "Accent: rules, buttons on navy", className: "bg-gold text-navy md:flex-[1.4]" },
  { name: "Warm White", token: "warm-white", hex: "#F7F8FA", role: "Page background", className: "border border-line-strong bg-warm-white text-navy md:flex-[2]" },
];

const pairs = [
  { label: "Navy on Warm White", fg: "#092C59", bg: "#F7F8FA", sample: "bg-warm-white text-navy border border-line" },
  { label: "Charcoal on Warm White (body)", fg: "#172B42", bg: "#F7F8FA", sample: "bg-warm-white text-charcoal border border-line" },
  { label: "Muted ink on Warm White", fg: "#4A5A6D", bg: "#F7F8FA", sample: "bg-warm-white text-ink-muted border border-line" },
  { label: "White on Navy", fg: "#FFFFFF", bg: "#092C59", sample: "bg-navy text-white" },
  { label: "Gold on Navy", fg: "#E9AD19", bg: "#092C59", sample: "bg-navy text-gold" },
  { label: "Gold on Charcoal", fg: "#E9AD19", bg: "#172B42", sample: "bg-charcoal text-gold" },
  { label: "Navy on Gold (button)", fg: "#092C59", bg: "#E9AD19", sample: "bg-gold text-navy" },
  { label: "White on Green", fg: "#FFFFFF", bg: "#287447", sample: "bg-green text-white" },
  { label: "Gold on White (not allowed for text)", fg: "#E9AD19", bg: "#FFFFFF", sample: "bg-white text-gold border border-line" },
];

export function ColourSection() {
  return (
    <Section tone="white" aria-labelledby="preview-colour">
      <Container>
        <SectionHeading
          id="preview-colour"
          eyebrow="01 · Colour"
          title="Five approved colours, used with intent"
          lead="Navy leads, charcoal grounds, green belongs to BOOM Foods, and gold is an accent. Contrast ratios below are computed from the actual values."
        />

        <div className="mt-12 flex flex-col md:min-h-72 md:flex-row">
          {brand.map((colour) => (
            <div key={colour.token} className={`flex flex-col justify-between gap-12 p-6 md:p-7 ${colour.className}`}>
              <p className="font-heading text-xs font-bold tracking-[0.16em] uppercase">{colour.token}</p>
              <div>
                <p className="font-heading text-h3 font-bold">{colour.name}</p>
                <p className="mt-1 font-mono text-sm">{colour.hex}</p>
                <p className="mt-3 max-w-56 text-sm">{colour.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="mb-4 text-left font-heading text-h3 font-bold text-navy">Approved combinations</caption>
            <thead>
              <tr className="border-b-2 border-navy font-heading text-xs tracking-[0.14em] text-ink-muted uppercase">
                <th scope="col" className="py-3 pr-4 font-bold">Sample</th>
                <th scope="col" className="py-3 pr-4 font-bold">Pair</th>
                <th scope="col" className="py-3 pr-4 font-bold">Ratio</th>
                <th scope="col" className="py-3 font-bold">WCAG text result</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair) => {
                const ratio = contrastRatio(pair.fg, pair.bg);
                const verdict = contrastVerdict(ratio);
                return (
                  <tr key={pair.label} className="border-b border-line">
                    <td className="py-3 pr-4">
                      <span className={`inline-flex h-12 w-24 items-center justify-center font-heading text-xl font-bold ${pair.sample}`}>
                        Aa
                      </span>
                    </td>
                    <th scope="row" className="py-3 pr-4 font-medium text-charcoal">{pair.label}</th>
                    <td className="py-3 pr-4 font-mono">{ratio.toFixed(2)}:1</td>
                    <td className={`py-3 font-semibold ${verdict.ok ? "text-green" : "text-navy"}`}>
                      {verdict.ok ? "✓ " : "✕ "}
                      {verdict.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
