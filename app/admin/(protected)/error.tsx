"use client";

/**
 * The safety net for anything unexpected inside the administrator area: a plain message and a retry, never a stack
 * trace or a technical detail (and the error itself is deliberately not logged here, as it could quote a record).
 */
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-gutter py-20 text-center">
      <p aria-hidden="true" className="mx-auto h-[3px] w-14 bg-gold" />
      <h1 className="mt-6 text-h2 font-extrabold text-navy">Something went wrong</h1>
      <p className="mt-3 text-lead text-ink-muted">This page could not be shown. Nothing has been changed. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex h-12 items-center rounded-sm border border-navy bg-navy px-6 font-heading text-base font-semibold text-white transition-colors hover:bg-navy-hover"
      >
        Try again
      </button>
    </div>
  );
}
