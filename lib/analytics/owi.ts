import { normalizeScore } from "./normalize-score";
import type { TeamAverages } from "@/lib/types";

// ── PRD Weight Coefficients ──

const W_ENERGY = 0.25;
const W_BELONGING = 0.20;
const W_CLARITY = 0.20;
const W_STRESS = 0.20;   // inverted (negative dimension)
const W_WORKLOAD = 0.15;  // inverted (negative dimension)

/**
 * Weighted Overall Wellbeing Index.
 *
 * Formula (PRD):
 *   energy×0.25 + belonging×0.20 + clarity×0.20
 *   + (100−stress)×0.20 + (100−workload)×0.15
 *
 * Each dimension is normalized from raw 1-5 to 0-100 first.
 * Stress and workload are inverted (higher raw = worse outcome).
 *
 * @returns OWI as integer 0-100, or null if any dimension is missing.
 */
export function calculateOwiWeighted(averages: TeamAverages): number | null {
  const dims: [string, number | undefined][] = [
    ["energy", averages.energy],
    ["belonging", averages.belonging],
    ["clarity", averages.clarity],
    ["stress", averages.stress],
    ["workload", averages.workload],
  ];

  for (const [, v] of dims) {
    if (v === null || v === undefined || Number.isNaN(v)) return null;
  }

  const e = normalizeScore(averages.energy, "positive");
  const b = normalizeScore(averages.belonging, "positive");
  const c = normalizeScore(averages.clarity, "positive");
  const s = normalizeScore(averages.stress, "negative");
  const w = normalizeScore(averages.workload, "negative");

  return Math.round(
    e * W_ENERGY +
    b * W_BELONGING +
    c * W_CLARITY +
    s * W_STRESS +
    w * W_WORKLOAD,
  );
}
