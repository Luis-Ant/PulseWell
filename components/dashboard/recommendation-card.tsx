import { Lightbulb } from "lucide-react";
import type { RecommendationDto } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  BURNOUT: "Burnout",
  ATTRITION: "Rotación",
  WELLBEING: "Bienestar",
  TREND: "Tendencia",
  PRODUCTIVITY: "Productividad",
  PREDICTIVE: "Predictivo",
};

interface RecommendationCardProps {
  recommendation: RecommendationDto;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const typeLabel = TYPE_LABELS[recommendation.type] ?? recommendation.type;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-yellow-400" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {typeLabel}
          </span>
        </div>

        <span className="text-xs text-slate-500">{recommendation.teamName}</span>
      </div>

      <h3
        className={cn(
          "mt-3 text-sm font-semibold",
          recommendation.description ? "text-white" : "text-slate-400",
        )}
      >
        {recommendation.title}
      </h3>

      {recommendation.description && (
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {recommendation.description}
        </p>
      )}

      {recommendation.actionableSteps.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {recommendation.actionableSteps.map((step) => (
            <li
              key={step}
              className="flex items-start gap-2 text-sm text-slate-300"
            >
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-cyan-400" />
              {step}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
