import Link from "next/link";
import { pageWindow } from "@/lib/admin/enquiries/page-window";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/dashboard-preview/icons";

const control =
  "inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-md border px-3 font-heading text-sm font-semibold transition-colors";
const idle = "border-line-strong text-navy hover:border-navy hover:bg-tint";
const off = "pointer-events-none border-line-strong text-navy opacity-40";

/**
 * Previous / next plus numbered pages as real links (so each page has its own address), with a plain summary of what is
 * shown. Used by both the Enquiries and the Appointments screens: each passes the function that builds its own addresses.
 */
export function ListPagination({
  hrefForPage,
  noun,
  page,
  pageCount,
  pageSize,
  total,
}: {
  hrefForPage: (page: number) => string;
  /** The singular and plural of what is being counted. */
  noun: { one: string; many: string };
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}) {
  if (total === 0) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const href = hrefForPage;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4 sm:px-6">
      <p className="text-sm text-ink-muted" aria-live="polite">
        Showing <strong className="font-semibold text-charcoal">{first}–{last}</strong> of <strong className="font-semibold text-charcoal">{total}</strong>{" "}
        {total === 1 ? noun.one : noun.many}
      </p>
      {pageCount > 1 ? (
        <ul className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href={href(page - 1)}
              prefetch={false}
              scroll={false}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={`${control} ${page === 1 ? off : idle}`}
            >
              <ChevronLeftIcon className="size-4" />
              <span className="sr-only sm:not-sr-only">Previous</span>
              <span className="sr-only sm:hidden"> page</span>
            </Link>
          </li>
          {pageWindow(page, pageCount).map((entry, index) =>
            entry === "gap" ? (
              <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-ink-muted">…</li>
            ) : (
              <li key={entry}>
                <Link
                  href={href(entry)}
                  prefetch={false}
                  scroll={false}
                  aria-label={`Page ${entry}`}
                  aria-current={entry === page ? "page" : undefined}
                  className={`${control} border-transparent text-navy hover:bg-tint aria-[current=page]:border-navy aria-[current=page]:bg-navy aria-[current=page]:text-white`}
                >
                  {entry}
                </Link>
              </li>
            ),
          )}
          <li>
            <Link
              href={href(page + 1)}
              prefetch={false}
              scroll={false}
              aria-disabled={page === pageCount}
              tabIndex={page === pageCount ? -1 : undefined}
              className={`${control} ${page === pageCount ? off : idle}`}
            >
              <span className="sr-only sm:not-sr-only">Next</span>
              <span className="sr-only sm:hidden"> page</span>
              <ChevronRightIcon className="size-4" />
            </Link>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}
