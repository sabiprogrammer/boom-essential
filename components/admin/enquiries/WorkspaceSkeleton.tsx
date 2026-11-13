/** The loading state: the shape of the real screen (toolbar and a few rows), quietly pulsing, announced to screen readers. */
export function WorkspaceSkeleton() {
  return (
    <div role="status" aria-label="Loading enquiries" className="rounded-md border border-line bg-white shadow-panel">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <div className="h-5 w-40 rounded bg-tint motion-safe:animate-pulse" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-tint motion-safe:animate-pulse" />
      </div>
      <div className="space-y-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="h-11 rounded-md bg-tint motion-safe:animate-pulse" />
        <div className="h-10 w-3/4 rounded-md bg-tint motion-safe:animate-pulse" />
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-line px-5 py-5 last:border-b-0 sm:px-6">
          <div className="size-10 shrink-0 rounded-md bg-tint motion-safe:animate-pulse" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-tint motion-safe:animate-pulse" />
            <div className="h-3.5 w-2/3 rounded bg-tint motion-safe:animate-pulse" />
          </div>
          <div className="hidden h-6 w-24 rounded-full bg-tint motion-safe:animate-pulse sm:block" />
        </div>
      ))}
      <span className="sr-only">Loading enquiries…</span>
    </div>
  );
}
