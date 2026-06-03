import { calculateBurnoutRiskTeam, calculateOwiWeighted } from "@/lib/analytics";
import type { TeamAverages, WellbeingSummary } from "@/lib/types";

const demoScore: TeamAverages = {
  energy: 4,
  belonging: 4,
  clarity: 3,
  stress: 2,
  workload: 3,
  owi: 0, // placeholder — computed below
};

export function getDemoWellbeingSummary(): WellbeingSummary {
  const owi = calculateOwiWeighted(demoScore) ?? 0;

  return {
    ...demoScore,
    owi,
    burnoutRisk: calculateBurnoutRiskTeam(owi),
    attritionRisk: "LOW" as const,
    trend: "stable",
    teams: 4,
  };
}
