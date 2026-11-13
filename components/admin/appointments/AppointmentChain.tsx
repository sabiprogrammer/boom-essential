import Link from "next/link";
import { appointmentsHref } from "@/lib/admin/appointments/query-params";
import { displayStatus, replacementOf } from "@/lib/admin/appointments/transitions";
import { formatSlotShort } from "@/lib/admin/appointments/format-slot";
import type { AppointmentListQuery } from "@/lib/admin/appointments/types";
import type { AppointmentRecord } from "@/lib/admin/enquiries/types";
import { AppointmentStateBadge } from "./AppointmentStateBadge";

/**
 * Every appointment of this enquiry, newest first: the original request, each reschedule and the current one. A
 * reschedule never edits or deletes the earlier record, so this is the full trail. The one being viewed is marked, and
 * the others link to their own page.
 */
export function AppointmentChain({ chain, currentId, query }: { chain: readonly AppointmentRecord[]; currentId: string; query: AppointmentListQuery }) {
  if (chain.length <= 1) return null;

  return (
    <div>
      <p className="mb-3 font-heading text-xs font-bold tracking-[0.1em] text-ink-muted uppercase">Appointments for this enquiry</p>
      <ol className="space-y-2">
        {chain.map((item) => {
          const current = item.id === currentId;
          const slot = item.confirmedDate && item.confirmedTime ? formatSlotShort(item.confirmedDate, item.confirmedTime) : formatSlotShort(item.preferredDate, item.preferredTime);
          return (
            <li key={item.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 ${current ? "border-navy bg-tint" : "border-line bg-white"}`}>
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-charcoal">{slot} (Lagos time)</p>
                <p className="text-xs text-ink-muted">
                  {item.rescheduledFromId ? "Created by rescheduling an earlier appointment" : "The original request"}
                  {current ? " · this appointment" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <AppointmentStateBadge status={displayStatus(item, replacementOf(item.id, chain))} />
                {current ? null : (
                  <Link
                    href={appointmentsHref({ ...query, appointmentId: item.id })}
                    prefetch={false}
                    scroll={false}
                    className="font-heading text-sm font-semibold text-navy underline underline-offset-4 hover:text-navy-hover"
                  >
                    View
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
