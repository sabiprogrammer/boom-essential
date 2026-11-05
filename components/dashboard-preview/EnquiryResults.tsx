"use client";

import type { DemoEnquiry } from "@/lib/dashboard-preview/types";
import { useDetailSelection } from "./DetailSelectionProvider";
import { EnquiryList } from "./EnquiryList";
import { EnquiryTable } from "./EnquiryTable";

/**
 * Chooses the layout from the container's own width: a table when there is room for six columns, stacked rows
 * otherwise. (Container queries, because the sidebar changes the room available at the same viewport width.)
 * Opening a row shows its detail panel, which lives in the dashboard shell.
 */
export function EnquiryResults({ enquiries }: { enquiries: readonly DemoEnquiry[] }) {
  const { selection, openEnquiry } = useDetailSelection();
  const selectedId = selection?.kind === "enquiry" ? selection.id : null;

  return (
    <>
      <div className="hidden @min-[52rem]:block">
        <EnquiryTable enquiries={enquiries} selectedId={selectedId} onOpen={openEnquiry} />
      </div>
      <div className="@min-[52rem]:hidden">
        <EnquiryList enquiries={enquiries} selectedId={selectedId} onOpen={openEnquiry} />
      </div>
    </>
  );
}
