import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<RiskLevel, string> = {
  LOW: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
  MEDIUM: "bg-amber-400/15 text-amber-400 border-amber-400/20",
  HIGH: "bg-orange-400/15 text-orange-400 border-orange-400/20",
  CRITICAL: "bg-red-400/15 text-red-400 border-red-400/20",
};

const STATUS_LABELS: Record<RiskLevel, string> = {
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
  CRITICAL: "Crítico",
};

interface MetricCardTrend {
  direction: "up" | "down" | "stable";
  value?: number;
}

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: MetricCardTrend;
  status?: RiskLevel;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  status,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/50">
      <div className="flex items-center justify-between gap-4">
        <p className="font-ui text-xs tracking-[0.12em] uppercase text-slate-500">
          {label}
        </p>
        <Icon className="size-5 text-cyan-300" />
      </div>

      <p className="font-sans mt-4 text-3xl font-bold leading-none text-white">
        {value}
      </p>

      <div className="mt-3 flex items-center gap-3">
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trend.direction === "up" && "text-emerald-400",
              trend.direction === "down" && "text-red-400",
              trend.direction === "stable" && "text-slate-400",
            )}
          >
            {trend.direction === "up" && <TrendingUp className="size-3.5" />}
            {trend.direction === "down" && <TrendingDown className="size-3.5" />}
            {trend.direction === "stable" && <Minus className="size-3.5" />}
            {trend.value !== undefined &&
              `${trend.direction === "up" ? "+" : trend.direction === "down" ? "" : ""}${trend.value}`}
          </span>
        )}

        {status && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              STATUS_COLORS[status],
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                status === "LOW" && "bg-emerald-400",
                status === "MEDIUM" && "bg-amber-400",
                status === "HIGH" && "bg-orange-400",
                status === "CRITICAL" && "bg-red-400",
              )}
            />
            {STATUS_LABELS[status]}
          </span>
        )}
      </div>
    </article>
  );
}
