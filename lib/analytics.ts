import { RISK_LEVEL, type PulseSurveyScore, type RiskLevel } from "@/lib/types";

const MAX_RAW_OWI = 15;
const MIN_RAW_OWI = -10;

export function calculateOwi(score: PulseSurveyScore) {
  const rawScore = score.energy + score.belonging + score.clarity - score.stress - score.workload;
  const normalized = ((rawScore - MIN_RAW_OWI) / (MAX_RAW_OWI - MIN_RAW_OWI)) * 100;

  return Math.round(Math.max(0, Math.min(100, normalized)));
}

export function calculateBurnoutRisk(score: PulseSurveyScore): RiskLevel {
  const hasHighStress = score.stress >= 4;
  const hasLowEnergy = score.energy <= 2;
  const hasHighWorkload = score.workload >= 4;

  if (hasHighStress && hasLowEnergy && hasHighWorkload) {
    return RISK_LEVEL.HIGH;
  }

  if ((hasHighStress && hasHighWorkload) || hasLowEnergy) {
    return RISK_LEVEL.MEDIUM;
  }

  return RISK_LEVEL.LOW;
}
