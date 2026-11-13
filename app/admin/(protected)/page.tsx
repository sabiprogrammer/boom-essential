import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { adminAuthCopy } from "@/content/admin-auth";
import { getAdminMembership } from "@/lib/admin/membership/check-membership";
import { getEnquiryDetail, getEnquiryList } from "@/lib/admin/enquiries/queries";
import { MembershipNotice } from "@/components/admin/MembershipNotice";
import { parseEnquiriesUrl, type RawSearchParams } from "@/lib/admin/enquiries/query-params";
import { EnquiriesWorkspace } from "@/components/admin/enquiries/EnquiriesWorkspace";
import { WorkspaceSkeleton } from "@/components/admin/enquiries/WorkspaceSkeleton";

/**
 * The administrator's Enquiries workspace. The page verifies the administrator itself (it does not rely on the layout
 * or the proxy having done so) and reads its data inside <Suspense>, because the session and the address are
 * request-time. Everything shown is private and per request: nothing here is cached or prerendered.
 */
async function Enquiries({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  await requireAdmin();
  const { enquiryId, ...query } = parseEnquiriesUrl(await searchParams);

  // The list and the open enquiry are read together; each reports its own failure without taking the other down.
  const [list, detail, membership] = await Promise.all([
    getEnquiryList(query),
    enquiryId ? getEnquiryDetail(enquiryId) : Promise.resolve(null),
    getAdminMembership(),
  ]);

  return (
    <>
      <MembershipNotice membership={membership} />
      <EnquiriesWorkspace query={query} list={list} detail={detail} enquiryId={enquiryId} />
    </>
  );
}

export default function AdminHomePage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const copy = adminAuthCopy.workspace;

  return (
    <div className="mx-auto w-full max-w-[88rem] px-gutter py-8 lg:py-10">
      <div className="mb-6">
        <p aria-hidden="true" className="h-[3px] w-14 bg-gold" />
        <h1 className="mt-4 text-h2 font-extrabold text-navy">{copy.heading}</h1>
        <p className="mt-2 max-w-prose text-lead text-ink-muted">{copy.body}</p>
      </div>
      <Suspense fallback={<WorkspaceSkeleton />}>
        <Enquiries searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
