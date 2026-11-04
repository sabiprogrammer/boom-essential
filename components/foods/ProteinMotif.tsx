type ProteinMotifProps = {
  kind: "smoke" | "frost";
  className?: string;
};

/**
 * Faint abstract line motifs for the protein panels: rising wisps for smoked fish, a frost crystal for
 * frozen chicken. Pure decoration. They depict neither a product nor a process. Decorative.
 */
export function ProteinMotif({ kind, className }: ProteinMotifProps) {
  if (kind === "smoke") {
    return (
      <svg viewBox="0 0 320 360" className={className} aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="stroke-white/20" strokeWidth="2" strokeLinecap="round">
          <path d="M60 360C20 310 100 270 60 220S100 130 60 80S100 20 70 0" />
          <path d="M140 360C100 315 180 280 140 230S180 150 140 100S180 40 150 10" />
          <path d="M220 360C180 320 260 285 220 240S260 170 220 120S260 60 230 30" />
          <path d="M290 360C260 325 320 300 290 260S320 200 290 160" />
        </g>
      </svg>
    );
  }

  const arms = [0, 60, 120];
  return (
    <svg viewBox="0 0 320 360" className={className} aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="stroke-white/20" strokeWidth="2" strokeLinecap="round" transform="translate(190 190)">
        {arms.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path d="M-150 0H150" />
            <path d="M-110 -26 -86 0l-24 26M110 -26 86 0l24 26" />
            <path d="M-60 -18-42 0l-18 18M60 -18 42 0l18 18" />
          </g>
        ))}
        <circle r="10" />
      </g>
    </svg>
  );
}
