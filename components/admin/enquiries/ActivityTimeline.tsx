import type { ReactNode } from "react";
import { describeActivity, type ActivityKind } from "@/lib/admin/enquiries/activity-text";
import type { ActivityRecord } from "@/lib/admin/enquiries/types";
import { formatReceivedDateTime } from "@/lib/dashboard-preview/dates";
import { CalendarIcon, CheckIcon, InboxIcon, NoteIcon } from "@/components/dashboard-preview/icons";

/** Soft, same-family tints so each kind of event is recognisable at a glance; the icon and the sentence carry the meaning. */
const looks: Record<ActivityKind, { icon: ReactNode; className: string }> = {
  enquiry: { icon: <InboxIcon className="size-4" />, className: "bg-navy text-white" },
  appointment: { icon: <CalendarIcon className="size-4" />, className: "bg-gold-tint text-navy ring-1 ring-gold/50" },
  status: { icon: <CheckIcon className="size-4" />, className: "bg-leaf text-green ring-1 ring-green/25" },
  note: { icon: <NoteIcon className="size-4" />, className: "bg-tint text-navy ring-1 ring-line-strong" },
};

/**
 * The enquiry's audit trail, newest first: when it arrived, every status change (from and to), appointment events and
 * notes added. The entries are written by the database, so they cannot be skipped or altered from the screen.
 */
export function ActivityTimeline({ activity }: { activity: readonly ActivityRecord[] }) {
  if (activity.length === 0) return <p className="text-base text-ink-muted">No activity has been recorded yet.</p>;

  return (
    <ol className="relative -my-1">
      {activity.map((record, index) => {
        const { text, kind } = describeActivity(record);
        return (
          <li key={record.id} className="relative flex gap-4 py-3">
            {index < activity.length - 1 ? <span aria-hidden="true" className="absolute top-11 bottom-[-0.25rem] left-4 w-px bg-line" /> : null}
            <span className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full ${looks[kind].className}`}>{looks[kind].icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-charcoal">{text}</p>
              <p className="mt-1 text-xs text-ink-muted">{formatReceivedDateTime(record.createdAt)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
