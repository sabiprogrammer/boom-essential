"use client";

import { appointmentRecords } from "@/lib/dashboard-preview/appointments";
import { overviewStats } from "@/lib/dashboard-preview/stats";
import { useDemoData, useDemoToday } from "./DemoDataProvider";
import { CalendarIcon, ClockIcon, InboxIcon, MailIcon } from "./icons";
import { KpiTile } from "./KpiTile";

const percent = (part: number, whole: number) => (whole === 0 ? 0 : (part / whole) * 100);

function Fill({ value, className }: { value: number; className: string }) {
  return <span className={`block h-full rounded-full ${className}`} style={{ width: `${value}%` }} />;
}

/**
 * The four headline figures, computed from the same records as every list. The first (all enquiries) is the
 * hero tile and carries the status mix; each tile links to the view that explains it (for example "New
 * enquiries" opens the Enquiries list already filtered to New).
 */
export function StatsStrip() {
  const { enquiries } = useDemoData();
  const today = useDemoToday();
  const stats = overviewStats(enquiries, today);
  const appointments = appointmentRecords(enquiries).length;
  const contacted = enquiries.filter((e) => e.status === "contacted").length;
  const resolved = enquiries.filter((e) => e.status === "resolved").length;

  return (
    <section aria-label="Key statistics" className="@container overflow-hidden rounded-md border border-line bg-line shadow-panel">
      <ul className="grid grid-cols-2 gap-px @min-[44rem]:grid-cols-4">
        <KpiTile
          hero
          href="/dashboard-preview/enquiries"
          label="Total enquiries"
          value={stats.total}
          icon={<InboxIcon />}
          note={`${stats.receivedLastSevenDays} received in the last 7 days`}
          bar={
            <>
              <Fill value={percent(stats.newCount, stats.total)} className="bg-gold" />
              <Fill value={percent(stats.inProgress, stats.total)} className="bg-white/80" />
              <Fill value={percent(contacted, stats.total)} className="bg-white/45" />
              <Fill value={percent(resolved, stats.total)} className="bg-white/20" />
            </>
          }
        />
        <KpiTile
          accent
          href="/dashboard-preview/enquiries?status=new"
          label="New enquiries"
          value={stats.newCount}
          icon={<MailIcon />}
          note="Waiting for a first reply"
          bar={<Fill value={percent(stats.newCount, stats.total)} className="bg-gold" />}
        />
        <KpiTile
          href="/dashboard-preview/enquiries?status=in_progress"
          label="In-progress enquiries"
          value={stats.inProgress}
          icon={<ClockIcon />}
          note="Being handled by the team"
          bar={<Fill value={percent(stats.inProgress, stats.total)} className="bg-navy" />}
        />
        <KpiTile
          href="/dashboard-preview/appointments"
          label="Appointment requests"
          value={stats.appointmentRequests}
          icon={<CalendarIcon />}
          note={`${stats.awaitingConfirmation} awaiting confirmation`}
          bar={<Fill value={percent(stats.awaitingConfirmation, appointments)} className="bg-gold" />}
        />
      </ul>
    </section>
  );
}
