import Link from "next/link";

/**
 * Shown instead of a list when its records could not be read. It says so plainly (an empty list would wrongly suggest there
 * is nothing there) and offers a way to retry. No technical detail is shown.
 */
export function ListLoadError({ retryHref = "/admin", what = "enquiries" }: { retryHref?: string; what?: string }) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-16 text-center">
      <span aria-hidden="true" className="grid size-16 place-items-center rounded-full bg-danger-tint font-heading text-2xl font-extrabold text-danger ring-8 ring-danger-tint/50">
        !
      </span>
      <p className="mt-6 font-heading text-lead font-extrabold text-navy">We could not load the {what}</p>
      <p className="mt-1.5 max-w-md text-base text-ink-muted">
        Nothing has been lost. This is usually a brief connection problem. Please try again in a moment.
      </p>
      <Link
        href={retryHref}
        className="mt-6 inline-flex h-11 items-center rounded-sm border border-navy bg-navy px-5 font-heading text-sm font-semibold text-white transition-colors hover:bg-navy-hover"
      >
        Try again
      </Link>
    </div>
  );
}
