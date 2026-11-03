import Image from "next/image";
import type { LeadershipMember } from "@/content/leadership";

type LeaderPortraitProps = {
  member: LeadershipMember;
  /** Responsive `sizes` for the rendered frame width. */
  sizes: string;
  className?: string;
};

/**
 * A 4:5 portrait frame. The crop box in `content/leadership.ts` is applied by sizing and offsetting the
 * whole photograph inside the frame (percentages), so the framing is exact and nothing is edited.
 */
export function LeaderPortrait({ member, sizes, className = "" }: LeaderPortraitProps) {
  const { src, width, height, crop } = member.portrait;
  const cropHeight = (crop.width * 5) / 4;

  return (
    <div className={`border-t-[3px] border-gold ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        <Image
          src={src}
          alt={`Portrait of ${member.name}, ${member.position}`}
          width={width}
          height={height}
          sizes={sizes}
          style={{
            position: "absolute",
            maxWidth: "none",
            height: "auto",
            width: `${(width / crop.width) * 100}%`,
            left: `${(-crop.x / crop.width) * 100}%`,
            top: `${(-crop.y / cropHeight) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
