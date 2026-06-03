import { normalizeScore } from "./normalize-score";
import type { TeamAverages } from "@/lib/types";

// ── PRD Weight Coefficients ──

const W_ENERGY = 0.25;
const W_BELONGING = 0.20;
const W_CLARITY = 0.20;
const W_STRESS = 0.20;   // inverted (negative dimension)
const W_WORKLOAD = 0.15;  // inverted (negative dimension)

/**
 * Índice de Bienestar Organizacional Ponderado (OWI).
 *
 * **Qué calcula**: Una puntuación de 0 a 100 que resume el bienestar
 * de un equipo combinando 5 dimensiones con pesos específicos. Es el
 * indicador principal del sistema PulseWell.
 *
 * **Cómo se interpreta**:
 *   - 70-100: Bienestar saludable — equipo con buena energía y baja carga
 *   - 50-69:  Señales de atención — monitorear tendencia
 *   - 30-49:  Riesgo alto — intervención recomendada
 *   - 0-29:   Riesgo crítico — acción urgente necesaria
 *
 * **Ejemplo**: Un equipo con energía=4, pertenencia=3, claridad=4,
 * estrés=2, carga=3 obtiene un OWI de aproximadamente 62.
 *
 * **Fórmula**: energy×0.25 + belonging×0.20 + clarity×0.20
 *            + (100−stress)×0.20 + (100−workload)×0.15
 *
 * Las dimensiones negativas (estrés, carga) se invierten porque
 * valores altos indican peor bienestar.
 *
 * @returns OWI como entero 0-100, o null si falta alguna dimensión.
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
