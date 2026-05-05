/**
 * Normalize a raw 1-5 pulse survey score to a 0-100 scale.
 *
 * Positive dimensions (energy, belonging, clarity):
 *   Higher raw = better → direct normalization
 *
 * Negative dimensions (stress, workload):
 *   Higher raw = worse → invert before normalization
 */

export type DimensionPolarity = "positive" | "negative";

/** Raw score range for pulse surveys (1-5 Likert scale). */
const RAW_MIN = 1;
const RAW_MAX = 5;
const RAW_RANGE = RAW_MAX - RAW_MIN; // 4

export function normalizeScore(
  value: number,
  polarity: DimensionPolarity,
): number {
  const clamped = Math.max(RAW_MIN, Math.min(RAW_MAX, value));

  const effective = polarity === "negative"
    ? RAW_MAX - clamped + RAW_MIN // invert: 5 → 1, 1 → 5
    : clamped;

  // Map to 0-100: ((effective - min) / range) * 100
  return Math.round(((effective - RAW_MIN) / RAW_RANGE) * 100);
}
