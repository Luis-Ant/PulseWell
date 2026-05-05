import type { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const RISK_CONFIG: Record<
  RiskLevel | "CRITICAL",
  { dot: string; bg: string; text: string; label: string }
> = {
  LOW: {
    dot: "bg-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    text: "text-emerald-400",
    label: "Bajo",
  },
  MEDIUM: {
    dot: "bg-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    text: "text-amber-400",
    label: "Medio",
  },
  HIGH: {
    dot: "bg-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    text: "text-orange-400",
    label: "Alto",
  },
  CRITICAL: {
    dot: "bg-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    text: "text-red-400 font-semibold",
    label: "Crítico",
  },
};

interface RiskBadgeProps {
  level: RiskLevel;
  label?: string;
}

export function RiskBadge({ level, label }: RiskBadgeProps) {
  const config = RISK_CONFIG[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
        config.bg,
        config.text,
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {label ?? config.label}
    </span>
  );
}
