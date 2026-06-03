export default function ManagerLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div>
        <div className="h-8 w-48 rounded-lg bg-slate-800" />
        <div className="mt-2 h-4 w-72 rounded bg-slate-800" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-slate-800" />
              <div className="size-5 rounded bg-slate-800" />
            </div>
            <div className="mt-4 h-8 w-16 rounded bg-slate-800" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 h-5 w-48 rounded bg-slate-800" />
        <div className="h-80 rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}
