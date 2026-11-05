"use client";

import { divisionBreakdown } from "@/lib/dashboard-preview/stats";
import type { DivisionId } from "@/lib/dashboard-preview/types";
import { useDemoData } from "./DemoDataProvider";
import { Panel } from "./Panel";

/** A small identity marker per offering. Decorative: the name is always written beside the bar. */
const markers: Record<DivisionId, string> = {
  energy: "bg-navy",
  security: "bg-charcoal",
  foods: "bg-green",
  "industrial-equipment": "bg-line-strong",
};

/**
 * Enquiries per offering as ranked horizontal bars: one hue, largest first, each row labelled with its count
 * and share so nothing depends on colour. Bar length is relative to the largest group. Plain CSS.
 */
export function DivisionBreakdownPanel() {
  const { enquiries } = useDemoData();
  const shares = divisionBreakdown(enquiries);
  const largest = Math.max(1, ...shares.map((share) => share.count));

  return (
    <Panel
      headingId="division-breakdown-heading"
      title="Enquiry breakdown"
      description={`Where the ${enquiries.length} enquiries came from, largest first.`}
    >
      <ul className="space-y-1">
        {shares.map((share) => (
          <li
            key={share.id}
            title={`${share.label}: ${share.count} of ${enquiries.length} enquiries (${share.percent}%)`}
            className="-mx-3 rounded-md px-3 py-3 transition-colors hover:bg-warm-white"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="flex items-center gap-2.5 font-heading text-sm font-bold text-charcoal">
                <span aria-hidden="true" className={`size-2.5 rounded-[2px] ${markers[share.id]}`} />
                {share.label}
              </p>
              <p className="font-heading text-sm text-ink-muted tabular-nums">
                <strong className="text-lead font-extrabold text-navy">{share.count}</strong>
                <span className="ml-2.5 inline-block min-w-9 text-right">{share.percent}%</span>
              </p>
            </div>
            <div aria-hidden="true" className="mt-2.5 h-2 overflow-hidden rounded-full bg-tint">
              <div className="h-full rounded-full bg-navy transition-[width] duration-500" style={{ width: `${(share.count / largest) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-line pt-4 text-sm text-ink-muted">Industrial Equipment is an additional offering, not a fourth division.</p>
    </Panel>
  );
}
