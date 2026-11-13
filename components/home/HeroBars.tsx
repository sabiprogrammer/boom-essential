import Image from "next/image";
import type { CSSProperties } from "react";
import { divisions, type DivisionId } from "@/content/divisions";
import { SmartLink } from "@/components/ui/SmartLink";
import { heroBarImages } from "./hero-bar-images";
import { IllustrativeLabel } from "./IllustrativeLabel";
import { SwooshMark } from "./SwooshMark";

/**
 * The three principal areas as three rising bars standing on the hero's baseline, echoing the
 * ascending bars and swoosh of the master logo. Each bar is a photograph and a link to its division.
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
          const image = heroBarImages[division.id];
          return (
            <li key={division.id} className={`flex-1 ${bar.height}`}>
              <SmartLink
                href={division.href}
                aria-label={`${division.name}: ${division.descriptor}`}
                style={{ "--delay": `${500 + index * 160}ms` } as CSSProperties}
                className={`grow-up group/bar relative isolate flex h-full w-full flex-col justify-end gap-6 overflow-hidden border-t-[3px] border-gold p-3.5 text-white sm:p-5 ${image.illustrative ? "pb-9 sm:pb-10" : ""} ${bar.surface}`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 14vw, 30vw"
                  className="-z-10 object-cover transition-transform duration-700 ease-(--ease-standard) group-hover/bar:scale-105"
                  style={{ objectPosition: image.position }}
                />
                {/* Keeps the white division name legible over any part of the picture. */}
                <span aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-navy/90 via-navy/45 to-navy/20" />
                {/* A strip along the bottom of the bar: the swoosh sweeps across the tops, so a label there could be covered. */}
                {image.illustrative ? <IllustrativeLabel size="small" className="inset-x-0 bottom-0 text-center" /> : null}
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
