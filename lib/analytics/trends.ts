import type { TrendClassification } from "@/lib/types";

/**
 * Compute OWI trend between two periods.
 *
 * @returns delta (current - previous) and classification.
 */
export function calculateTrend(
  currentOwi: number,
  previousOwi: number,
): { delta: number; classification: TrendClassification } {
  const delta = parseFloat((currentOwi - previousOwi).toFixed(2));

  if (delta > 2) return { delta, classification: "improving" };
  if (delta < -2) return { delta, classification: "declining" };
  return { delta, classification: "stable" };
}

/**
 * Simple linear regression projection over OWI history.
 *
 * Projects 1 period (week) forward from the last data point.
 *
 * @param owiHistory — array of past OWI scores in chronological order.
 * @returns Projected OWI for the next period, or null if < 2 data points.
 */
export function calculateProjection(owiHistory: number[]): number | null {
  if (owiHistory.length < 2) return null;

  const n = owiHistory.length;

  // x = period index (0, 1, 2, ...)
  const xs = Array.from({ length: n }, (_, i) => i);
  const meanX = (n - 1) / 2; // center for numerical stability
  const meanY = owiHistory.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    num += dx * (owiHistory[i] - meanY);
    den += dx * dx;
  }

  if (den === 0) return Math.round(meanY);

  const slope = num / den;
  // Project one period ahead: y = meanY + slope * (n - meanX)
  const projected = meanY + slope * (n - meanX);

  return parseFloat(projected.toFixed(2));
}
