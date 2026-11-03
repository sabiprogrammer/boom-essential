import type { CSSProperties } from "react";
import { divisions, type DivisionId } from "@/content/divisions";
import { SmartLink } from "@/components/ui/SmartLink";
import { SwooshMark } from "./SwooshMark";

/**
 * The three principal areas as three rising bars standing on the hero's baseline, echoing the
 * ascending bars and swoosh of the master logo. Each bar is a link to its division.
 */
const bars: Record<DivisionId, { height: string; surface: string }> = {
  energy: { height: "h-[56%]", surface: "bg-navy-hover" },
  security: { height: "h-[78%]", surface: "bg-charcoal" },
  foods: { height: "h-full", surface: "bg-green" },
};

export function HeroBars() {
  return (
    <div className="relative h-80 sm:h-[26rem] lg:h-[34rem]">
      <ul className="absolute inset-0 flex items-end gap-2 sm:gap-3">
        {divisions.map((division, index) => {
          const bar = bars[division.id];
          return (
            <li key={division.id} className={`flex-1 ${bar.height}`}>
              <SmartLink
                href={division.href}
                aria-label={`${division.name}: ${division.descriptor}`}
                style={{ "--delay": `${500 + index * 160}ms` } as CSSProperties}
                className={`grow-up flex h-full w-full flex-col justify-end gap-6 border-t-[3px] border-gold p-3.5 text-white transition-[filter] duration-300 hover:brightness-125 sm:p-5 ${bar.surface}`}
              >
                <span
                  aria-hidden="true"
                  className="rotate-180 self-start font-heading text-h3 font-extrabold tracking-tight uppercase [writing-mode:vertical-rl]"
                >
                  {division.shortName}
                </span>
                <span aria-hidden="true" className="block border-t border-white/25 pt-3">
                  <span className="block font-heading text-xs font-bold tracking-[0.16em] uppercase">
                    {division.number}
                  </span>
                  <span className="mt-0.5 block font-heading text-sm font-semibold">{division.word}.</span>
                </span>
              </SmartLink>
            </li>
          );
        })}
      </ul>

      {/* Delayed so the bars stand first, then the swoosh sweeps over them. */}
      {/* Stretched to the height above the shortest bar so its tail always meets the Energy bar's top edge. */}
      <div
        className="draw-in pointer-events-none absolute -top-3 -left-3 h-[calc(44%+0.75rem)] w-[108%] text-gold"
        style={{ "--delay": "1000ms" } as CSSProperties}
      >
        <SwooshMark stretch className="h-full w-full" />
      </div>
    </div>
  );
}
