"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { AlertDto } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<string, string> = {
  LOW: "border-l-slate-500",
  MEDIUM: "border-l-amber-500",
  HIGH: "border-l-orange-500",
  CRITICAL: "border-l-red-500 bg-red-950/20",
};

const SEVERITY_BADGE_STYLES: Record<string, string> = {
  LOW: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  MEDIUM: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  HIGH: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  CRITICAL: "bg-red-400/15 text-red-400 border-red-400/30",
};

const SEVERITY_LABELS: Record<string, string> = {
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
  CRITICAL: "Crítico",
};

const TYPE_LABELS: Record<string, string> = {
  BURNOUT: "Burnout",
  ATTRITION: "Rotación",
  WELLBEING: "Bienestar",
  TREND: "Tendencia",
  PRODUCTIVITY: "Productividad",
  PREDICTIVE: "Predictivo",
};

interface AlertCardProps {
  alert: AlertDto;
}

export function AlertCard({ alert }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const typeLabel = TYPE_LABELS[alert.type] ?? alert.type;
  const severityLabel = SEVERITY_LABELS[alert.severity] ?? alert.severity;
  const isCritical = alert.severity === "CRITICAL";

  return (
    <article
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/50 border-l-4",
        SEVERITY_STYLES[alert.severity] ?? "border-l-slate-500",
        isCritical && "animate-pulse",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={cn(
              "size-4",
              isCritical && "text-red-400 animate-pulse",
              alert.severity === "HIGH" && "text-orange-400",
              alert.severity === "MEDIUM" && "text-amber-400",
              alert.severity === "LOW" && "text-slate-400",
            )}
          />
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
              SEVERITY_BADGE_STYLES[alert.severity] ?? SEVERITY_BADGE_STYLES.MEDIUM,
            )}
          >
            {severityLabel}
          </span>
          <span className="text-xs text-slate-500">{typeLabel}</span>
        </div>

        <span className="text-xs text-slate-500">{alert.teamName}</span>
      </div>

      <p
        className={cn(
          "mt-3 text-sm leading-relaxed",
          alert.severity === "CRITICAL" ? "text-red-300" : "text-slate-300",
        )}
      >
        {alert.message}
      </p>

      {alert.description && alert.description !== alert.message && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="size-3" /> Menos detalles
              </>
            ) : (
              <>
                <ChevronDown className="size-3" /> Más detalles
              </>
            )}
          </button>

          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              expanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-3">
              <p className="text-xs leading-relaxed text-slate-400">
                {alert.description}
              </p>
            </div>
          </div>
        </>
      )}

      <div className="mt-3">
        <time className="text-[11px] text-slate-600">
          {new Date(alert.triggeredAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
    </article>
  );
}
