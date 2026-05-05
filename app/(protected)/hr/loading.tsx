/**
 * HR Dashboard — loading skeleton.
 * Matches the layout of the main page for seamless transition.
 */
export default function HrLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-48 rounded-lg bg-slate-800" />
        <div className="mt-2 h-4 w-96 rounded bg-slate-800" />
      </div>

      {/* Global metrics skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-slate-800" />
              <div className="size-5 rounded bg-slate-800" />
            </div>
            <div className="mt-4 h-8 w-16 rounded bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Team grid skeleton */}
      <div>
        <div className="mb-4 h-6 w-20 rounded bg-slate-800" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="mt-3 h-9 w-16 rounded bg-slate-800" />
              <div className="mt-3 flex gap-1.5">
                <div className="h-5 w-16 rounded-full bg-slate-800" />
                <div className="h-5 w-16 rounded-full bg-slate-800" />
                <div className="h-5 w-20 rounded-full bg-slate-800" />
              </div>
              <div className="mt-3 border-t border-slate-800 pt-3">
                <div className="h-3 w-24 rounded bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 h-5 w-48 rounded bg-slate-800" />
        <div className="h-80 rounded-lg bg-slate-800" />
      </div>

      {/* Alerts skeleton */}
      <div>
        <div className="mb-4 h-6 w-28 rounded bg-slate-800" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center gap-2">
                <div className="size-4 rounded bg-slate-800" />
                <div className="h-4 w-12 rounded bg-slate-800" />
                <div className="h-4 w-16 rounded bg-slate-800" />
              </div>
              <div className="mt-3 h-4 w-3/4 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
