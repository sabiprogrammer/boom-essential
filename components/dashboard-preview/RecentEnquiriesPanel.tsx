"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useDemoData } from "./DemoDataProvider";
import { EnquiryResults } from "./EnquiryResults";
import { Panel } from "./Panel";

const recentCount = 6;

/** The most recently received enquiries, each opening its detail panel. */
export function RecentEnquiriesPanel() {
  const { enquiries } = useDemoData();

  return (
    <Panel
      headingId="recent-enquiries-heading"
      title="Recent enquiries"
      description={`The latest ${recentCount} of ${enquiries.length} enquiries.`}
      flush
      action={
        <Link
          href="/dashboard-preview/enquiries"
          className="inline-flex min-h-11 items-center gap-2 font-heading text-sm font-bold text-navy hover:underline"
        >
          View all enquiries
          <ArrowRightIcon className="size-4" />
        </Link>
      }
    >
      <EnquiryResults enquiries={enquiries.slice(0, recentCount)} />
    </Panel>
  );
}
