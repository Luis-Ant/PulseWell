export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div>
        <div className="h-8 w-56 rounded-lg bg-slate-800" />
        <div className="mt-2 h-4 w-80 rounded bg-slate-800" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-slate-800" />
              <div className="size-4 rounded bg-slate-800" />
            </div>
            <div className="mt-3 h-8 w-12 rounded bg-slate-800" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="h-4 w-32 rounded bg-slate-800" />
            <div className="mt-3 h-3 w-full rounded bg-slate-800" />
            <div className="mt-4 h-8 w-24 rounded bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
