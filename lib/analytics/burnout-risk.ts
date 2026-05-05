import { RISK_LEVEL, type RiskLevel } from "@/lib/types";

/**
 * Burnout risk classification at team level.
 *
 * Thresholds (spec):
 *   OWI ≥ 70  → LOW
 *   50–69     → MEDIUM
 *   30–49     → HIGH
 *   < 30      → CRITICAL
 */
export function calculateBurnoutRiskTeam(owi: number): RiskLevel {
  if (owi >= 70) return RISK_LEVEL.LOW;
  if (owi >= 50) return RISK_LEVEL.MEDIUM;
  if (owi >= 30) return RISK_LEVEL.HIGH;
  return RISK_LEVEL.CRITICAL;
}
