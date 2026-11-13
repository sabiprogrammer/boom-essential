import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAppointmentDetail, getAppointmentList } from "@/lib/admin/appointments/queries";
import { parseAppointmentsUrl } from "@/lib/admin/appointments/query-params";
import { lagosToday } from "@/lib/admin/appointments/slot";
import { getAdminMembership } from "@/lib/admin/membership/check-membership";
import type { RawSearchParams } from "@/lib/admin/enquiries/query-params";
import { MembershipNotice } from "@/components/admin/MembershipNotice";
import { AppointmentsWorkspace } from "@/components/admin/appointments/AppointmentsWorkspace";
import { WorkspaceSkeleton } from "@/components/admin/enquiries/WorkspaceSkeleton";

/**
 * The administrator's Appointments workspace. The page verifies the administrator itself (it does not rely on the layout
 * or the proxy having done so) and reads its data inside <Suspense>, because the session and the address are
 * request-time. Everything shown is private and per request: nothing here is cached or prerendered.
 */
async function Appointments({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const { appointmentId, ...query } = parseAppointmentsUrl(await searchParams);

  // The list, the open appointment and the setup check are read together; each reports its own failure on its own.
  const [list, detail, membership] = await Promise.all([
    getAppointmentList(query),
    appointmentId ? getAppointmentDetail(appointmentId) : Promise.resolve(null),
    getAdminMembership(),
  ]);

  return (
    <>
      <MembershipNotice membership={membership} />
      <AppointmentsWorkspace query={query} list={list} detail={detail} appointmentId={appointmentId} today={lagosToday()} />
    </>
  );
}

export default function AdminAppointmentsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  return (
    <div className="mx-auto w-full max-w-[88rem] px-gutter py-8 lg:py-10">
      <div className="mb-6">
        <p aria-hidden="true" className="h-[3px] w-14 bg-gold" />
        <h1 className="mt-4 text-h2 font-extrabold text-navy">Appointments</h1>
        <p className="mt-2 max-w-prose text-lead text-ink-muted">
          Appointment requests from customers, with their enquiries. Confirm a time, reschedule or cancel. Dates and times are Lagos time.
        </p>
      </div>
      <Suspense fallback={<WorkspaceSkeleton />}>
        <Appointments searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
