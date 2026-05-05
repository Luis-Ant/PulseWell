import { RISK_LEVEL, type TeamAverages, type RiskLevel } from "@/lib/types";

/**
 * Productivity health classification at team level.
 *
 * Factors (PRD): clarity, energy, workload balance, belonging.
 *
 * Each dimension is scored as "healthy" if ≥ 3.5 on a 1-5 raw scale.
 *
 * Mapping:
 *   4 healthy → LOW risk   (good productivity)
 *   3 healthy → MEDIUM
 *   2 healthy → HIGH
 *   0-1       → CRITICAL
 */
export function calculateProductivityHealth(
  averages: TeamAverages,
): RiskLevel {
  const clarityOk = averages.clarity >= 3.5;
  const energyOk = averages.energy >= 3.5;
  const workloadOk = averages.workload <= 3.5;
  const belongingOk = averages.belonging >= 3.5;

  const healthyCount = [clarityOk, energyOk, workloadOk, belongingOk]
    .filter(Boolean).length;

  if (healthyCount >= 4) return RISK_LEVEL.LOW;
  if (healthyCount >= 3) return RISK_LEVEL.MEDIUM;
  if (healthyCount >= 2) return RISK_LEVEL.HIGH;
  return RISK_LEVEL.CRITICAL;
}
