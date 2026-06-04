/**
 * Convert ISO week string like "2026-W23" to human-readable "Semana 23, 2026"
 */
export function formatPeriod(period: string): string {
  const match = period.match(/^(\d{4})-W(\d{2})$/);
  if (match) {
    return `Semana ${parseInt(match[2]!)}, ${match[1]}`;
  }
  // Handle biweekly periods
  const bwMatch = period.match(/^(\d{4})-BW(\d{2})$/);
  if (bwMatch) {
    return `Quincena ${parseInt(bwMatch[2]!)}, ${bwMatch[1]}`;
  }
  return period;
}
