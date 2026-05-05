import { RISK_LEVEL, type TeamAverages, type RiskLevel } from "@/lib/types";

/**
 * Attrition risk classification at team level.
 *
 * Risk signals (per PRD):
 *   - Belonging ≤ 2.5
 *   - Energy ≤ 2.5
 *   - Workload ≥ 4
 *   - Stress ≥ 4
 *   - 2-period OWI decline
 *
 * Scoring:
 *   4 signals + decline → CRITICAL
 *   3 signals           → HIGH
 *   2 signals           → MEDIUM
 *   0-1 signal          → LOW
 */
export function calculateAttritionRisk(
  averages: TeamAverages,
  pastOwi?: number,
): RiskLevel {
  const lowBelonging = averages.belonging <= 2.5;
  const lowEnergy = averages.energy <= 2.5;
  const highWorkload = averages.workload >= 4;
  const highStress = averages.stress >= 4;
  const hasDecline =
    pastOwi !== undefined && averages.owi !== undefined && averages.owi < pastOwi;

  const signalCount = [lowBelonging, lowEnergy, highWorkload, highStress]
    .filter(Boolean).length;

  if (signalCount >= 4 && hasDecline) return RISK_LEVEL.CRITICAL;
  if (signalCount >= 3) return RISK_LEVEL.HIGH;
  if (signalCount >= 2) return RISK_LEVEL.MEDIUM;
  return RISK_LEVEL.LOW;
}
