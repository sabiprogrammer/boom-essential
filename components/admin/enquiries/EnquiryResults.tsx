import type { EnquiryListQuery, EnquiryRecord } from "@/lib/admin/enquiries/types";
import { EnquiryList } from "./EnquiryList";
import { EnquiryTable } from "./EnquiryTable";

/**
 * Chooses the layout from the container's own width: a table when there is room for four columns, stacked rows
 * otherwise. (Container queries, because the page width and the open drawer change the room available.)
 */
export function EnquiryResults({ enquiries, query, selectedId }: { enquiries: readonly EnquiryRecord[]; query: EnquiryListQuery; selectedId: string | null }) {
  return (
    <>
      <div className="hidden @min-[52rem]:block">
        <EnquiryTable enquiries={enquiries} query={query} selectedId={selectedId} />
      </div>
      <div className="@min-[52rem]:hidden">
        <EnquiryList enquiries={enquiries} query={query} selectedId={selectedId} />
      </div>
    </>
  );
}
