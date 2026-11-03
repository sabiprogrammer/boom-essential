import type { CSSProperties } from "react";
import type { LeadershipMember } from "@/content/leadership";
import { LeaderPortrait } from "./LeaderPortrait";

type LeaderEntryProps = {
  member: LeadershipMember;
  /** The featured entry (CEO) is set larger and beside its portrait on large screens. */
  featured?: boolean;
  index?: number;
  className?: string;
};

/**
 * One member of management: photograph, full name and official position, and nothing else.
 * `member.bio` is rendered after the position when the client supplies one; no layout change is needed.
 */
export function LeaderEntry({ member, featured = false, index = 0, className = "" }: LeaderEntryProps) {
  const headingId = `leader-${member.name.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  const bio = member.bio ? <p className="mt-5 max-w-prose text-body text-charcoal">{member.bio}</p> : null;

  if (featured) {
    return (
      <article
        aria-labelledby={headingId}
        className={`reveal grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-16 ${className}`}
        style={{ "--i": index } as CSSProperties}
      >
        {/* The source is 413px wide, so the frame never exceeds 20rem. */}
        <LeaderPortrait
          member={member}
          sizes="(min-width: 1024px) 320px, 80vw"
          className="w-full max-w-[20rem] lg:col-span-4"
        />
        <div className="lg:col-span-8">
          <div className="border-t-2 border-navy pt-6">
            <h3 id={headingId} className="break-words text-h1 font-extrabold text-navy">
              {member.name}
            </h3>
            <p className="mt-2 text-lead text-ink-muted">{member.position}</p>
            {bio}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      aria-labelledby={headingId}
      className={`reveal grid grid-cols-[7.5rem_1fr] items-start gap-5 sm:grid-cols-1 sm:gap-0 ${className}`}
      style={{ "--i": index } as CSSProperties}
    >
      <LeaderPortrait member={member} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 120px" />
      <div className="sm:pt-5">
        <h3 id={headingId} className="break-words text-h3 font-extrabold text-navy">
          {member.name}
        </h3>
        <p className="mt-1.5 text-base text-ink-muted">{member.position}</p>
        {bio}
      </div>
    </article>
  );
}
