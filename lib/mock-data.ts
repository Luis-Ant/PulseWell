import { calculateBurnoutRisk, calculateOwi } from "@/lib/analytics";
import type { PulseSurveyScore, WellbeingSummary } from "@/lib/types";

const demoScore: PulseSurveyScore = {
  energy: 4,
  belonging: 4,
  clarity: 3,
  stress: 2,
  workload: 3,
};

export function getDemoWellbeingSummary(): WellbeingSummary {
  return {
    ...demoScore,
    owi: calculateOwi(demoScore),
    burnoutRisk: calculateBurnoutRisk(demoScore),
    trend: "estable",
    teams: 6,
  };
}
