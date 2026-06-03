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

// ── Period calculation (current ISO week) ──────────────────────────────
export function getCurrentPeriod(): string {
  const now = new Date();
  const dayNum = now.getUTCDay() || 7;
  now.setUTCDate(now.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((now.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${now.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}
