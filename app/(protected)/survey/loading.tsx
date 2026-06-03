/**
 * Survey page — loading skeleton.
 * Matches the layout of the survey form for seamless transition.
 */
export default function SurveyLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 rounded bg-slate-800" />
        <div className="mt-2 h-4 w-32 rounded bg-slate-800" />
      </div>

      {/* Question cards skeleton */}
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-5"
          >
            <div className="mb-4 h-5 w-3/4 rounded bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-12 rounded bg-slate-800" />
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="size-11 rounded-lg bg-slate-800"
                  />
                ))}
              </div>
              <div className="h-3 w-12 rounded bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Submit button skeleton */}
      <div className="mt-8 flex justify-end">
        <div className="h-12 w-44 rounded-full bg-slate-800" />
      </div>

      {/* Privacy banner skeleton */}
      <div className="mt-6">
        <div className="h-14 rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}
