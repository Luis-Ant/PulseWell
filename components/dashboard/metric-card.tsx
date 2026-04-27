import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/50">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon className="size-5 text-cyan-300" />
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
    </article>
  );
}
