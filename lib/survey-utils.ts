// ── Survey question definitions ────────────────────────────────────────
export const SURVEY_QUESTIONS = {
  energy: {
    key: "energy",
    label: "Energía",
    question: "¿Cómo calificarías tu nivel de energía esta semana?",
    lowLabel: "Muy baja",
    highLabel: "Muy alta",
  },
  belonging: {
    key: "belonging",
    label: "Pertenencia",
    question: "¿Qué tan conectado te sentís con tu equipo?",
    lowLabel: "Nada conectado",
    highLabel: "Muy conectado",
  },
  clarity: {
    key: "clarity",
    label: "Claridad",
    question: "¿Qué tan claros están los objetivos y expectativas de tu trabajo?",
    lowLabel: "Nada claros",
    highLabel: "Muy claros",
  },
  stress: {
    key: "stress",
    label: "Estrés",
    question: "¿Qué nivel de estrés sentiste esta semana?",
    lowLabel: "Muy bajo",
    highLabel: "Muy alto",
  },
  workload: {
    key: "workload",
    label: "Carga de trabajo",
    question: "¿Qué tan manejable fue tu carga de trabajo esta semana?",
    lowLabel: "Inmanejable",
    highLabel: "Muy manejable",
  },
} as const;

export type SurveyQuestionKey = keyof typeof SURVEY_QUESTIONS;

// ── Score range ─────────────────────────────────────────────────────────
export const SCORE_MIN = 1;
export const SCORE_MAX = 5;

// ── Response type ───────────────────────────────────────────────────────
export interface SurveyResponseInput {
  energy: number;
  belonging: number;
  clarity: number;
  stress: number;
  workload: number;
}

// ── Validation ──────────────────────────────────────────────────────────
export interface ValidationError {
  field?: string;
  message: string;
}

export function validateSurveyResponse(
  body: unknown,
): { valid: true; data: SurveyResponseInput } | { valid: false; errors: ValidationError[] } {
  if (!body || typeof body !== "object") {
    return { valid: false, errors: [{ message: "Cuerpo de solicitud inválido." }] };
  }

  const errors: ValidationError[] = [];
  const fields = ["energy", "belonging", "clarity", "stress", "workload"] as const;
  const data: Record<string, number> = {};

  for (const field of fields) {
    const value = (body as Record<string, unknown>)[field];
    if (value === undefined || value === null) {
      errors.push({ field, message: `El campo "${field}" es requerido.` });
    } else if (typeof value !== "number" || !Number.isInteger(value)) {
      errors.push({ field, message: `El campo "${field}" debe ser un número entero.` });
    } else if (value < SCORE_MIN || value > SCORE_MAX) {
      errors.push({ field, message: `El campo "${field}" debe estar entre ${SCORE_MIN} y ${SCORE_MAX}.` });
    } else {
      data[field] = value;
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: data as unknown as SurveyResponseInput };
}

// ── Period calculation (ISO week, with optional biweekly support) ────────
export function getCurrentPeriod(frequency?: string, startDate?: Date): string {
  const now = new Date();

  // Biweekly: calculate weeks since startDate
  if (frequency === "BIWEEKLY" && startDate) {
    const start = new Date(startDate);
    const diffMs = now.getTime() - start.getTime();
    const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
    const biweekNum = diffWeeks < 0 ? 1 : Math.floor(diffWeeks / 2) + 1;
    return `${now.getUTCFullYear()}-BW${String(biweekNum).padStart(2, "0")}`;
  }

  // Default: ISO week calculation
  const dayNum = now.getUTCDay() || 7;
  now.setUTCDate(now.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((now.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${now.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Get the last N period strings (including current).
 * For weekly surveys, uses ISO week calculation.
 * For biweekly surveys, uses weeks-since-startDate / 2.
 */
export function getRecentPeriods(count: number = 4, frequency?: string, startDate?: Date): string[] {
  // Biweekly: generate biweekly period strings
  if (frequency === "BIWEEKLY" && startDate) {
    const periods: string[] = [];
    const now = new Date();
    const start = new Date(startDate);
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 14); // 2 weeks back
      const diffMs = d.getTime() - start.getTime();
      const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
      const biweekNum = Math.max(1, diffWeeks < 0 ? 1 : Math.floor(diffWeeks / 2) + 1);
      periods.push(`${d.getUTCFullYear()}-BW${String(biweekNum).padStart(2, "0")}`);
    }
    return periods;
  }

  // Default: ISO week calculation
  const periods: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    periods.push(`${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`);
  }
  return periods;
}

/**
 * Calculate the current consecutive streak of ISO week periods.
 * Takes a sorted array of period strings (newest first) and returns
 * the number of consecutive weeks (including the current one if present).
 */
export function calculateStreak(periods: string[]): number {
  if (periods.length === 0) return 0;

  const current = getCurrentPeriod();
  const sorted = [...new Set(periods)].sort().reverse(); // newest first

  // Parse "2026-W23" → { year: 2026, week: 23 }
  function parsePeriod(p: string): { year: number; week: number } | null {
    const match = p.match(/^(\d{4})-W(\d{2})$/);
    if (!match) return null;
    return { year: parseInt(match[1]!), week: parseInt(match[2]!) };
  }

  // Convert to absolute week number for comparison
  function toAbsoluteWeek(p: { year: number; week: number }): number {
    return p.year * 53 + p.week; // approximation, good enough for streaks
  }

  const currentParsed = parsePeriod(current);
  if (!currentParsed) return 0;

  let streak = 0;
  let expected = toAbsoluteWeek(currentParsed);

  for (const period of sorted) {
    const parsed = parsePeriod(period);
    if (!parsed) continue;
    const abs = toAbsoluteWeek(parsed);

    if (abs === expected) {
      streak++;
      expected--;
    } else if (abs < expected) {
      break; // gap detected
    }
  }

  return streak;
}
