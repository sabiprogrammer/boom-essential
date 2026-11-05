"use client";

import type { ReactNode } from "react";
import type { ActivityKind } from "@/lib/dashboard-preview/types";
import { useDemoData } from "./DemoDataProvider";
import { CalendarIcon, CheckIcon, InboxIcon, NoteIcon } from "./icons";
import { Panel } from "./Panel";

const maxShown = 8;
const referencePattern = /(BMG-\d{4}-\d{4})/g;

/** Soft, same-family tints so each kind of event is recognisable at a glance; the icon and the sentence carry the meaning. */
const looks: Record<ActivityKind, { icon: ReactNode; className: string }> = {
  enquiry: { icon: <InboxIcon className="size-4" />, className: "bg-navy text-white" },
  appointment: { icon: <CalendarIcon className="size-4" />, className: "bg-gold-tint text-navy ring-1 ring-gold/50" },
  status: { icon: <CheckIcon className="size-4" />, className: "bg-leaf text-green ring-1 ring-green/25" },
  note: { icon: <NoteIcon className="size-4" />, className: "bg-tint text-navy ring-1 ring-line-strong" },
};

/** Sets enquiry references in bold so the eye can find them. */
function withReferences(text: string): ReactNode[] {
  return text.split(referencePattern).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-heading font-bold tracking-wide text-navy tabular-nums">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/** A short feed of example events. Actions tried in the demo appear here too, marked as demo only. */
export function ActivityPanel() {
  const { activity } = useDemoData();

  return (
    <Panel headingId="recent-activity-heading" title="Recent activity" description="Fictional example events.">
      <ol className="relative -my-1">
        {activity.slice(0, maxShown).map((event, index, list) => (
          <li key={event.id} className="relative flex gap-4 py-3">
            {index < list.length - 1 ? <span aria-hidden="true" className="absolute top-11 bottom-[-0.25rem] left-4 w-px bg-line" /> : null}
            <span className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full ${looks[event.kind].className}`}>
              {looks[event.kind].icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-charcoal">{withReferences(event.text)}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
                {event.at}
                {event.at.includes("demo") ? (
                  <span className="rounded-full bg-gold-tint px-2 py-0.5 font-heading font-bold text-navy ring-1 ring-gold/50">Demo</span>
                ) : null}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
