import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

const control =
  "inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-md border px-3 font-heading text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40";

/** Previous/next plus numbered pages, with a plain-text summary of what is on screen. */
export function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  noun,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  noun: string;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-5 py-4 sm:px-6">
      <p className="text-sm text-ink-muted" aria-live="polite">
        Showing <strong className="font-semibold text-charcoal">{first}–{last}</strong> of{" "}
        <strong className="font-semibold text-charcoal">{total}</strong> {noun}
      </p>
      {pageCount > 1 ? (
        <ul className="flex items-center gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className={`${control} border-line-strong text-navy hover:border-navy hover:bg-tint`}
            >
              <ChevronLeftIcon className="size-4" />
              <span className="sr-only sm:not-sr-only">Previous</span>
              <span className="sr-only sm:hidden"> page</span>
            </button>
          </li>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <li key={number}>
              <button
                type="button"
                onClick={() => onPageChange(number)}
                aria-label={`Page ${number}`}
                aria-current={number === page ? "page" : undefined}
                className={`${control} border-transparent text-navy hover:bg-tint aria-[current=page]:border-navy aria-[current=page]:bg-navy aria-[current=page]:text-white`}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page === pageCount}
              className={`${control} border-line-strong text-navy hover:border-navy hover:bg-tint`}
            >
              <span className="sr-only sm:not-sr-only">Next</span>
              <span className="sr-only sm:hidden"> page</span>
              <ChevronRightIcon className="size-4" />
            </button>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}
