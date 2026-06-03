/**
 * Normaliza una puntuación de encuesta pulse (escala 1-5) a una escala
 * estándar de 0-100 para facilitar la comparación entre dimensiones.
 *
 * **Qué calcula**: Convierte cualquier valor de encuesta en una
 * puntuación de 0 a 100, donde 100 es el mejor resultado posible.
 *
 * **Cómo se interpreta**:
 *   - 100: Situación ideal (ej. energía máxima, estrés mínimo)
 *   - 0:   Situación crítica (ej. energía mínima, estrés máximo)
 *   - 50:  Punto medio — requiere monitoreo
 *
 * **Ejemplo**: Una puntuación de energía raw=4 se convierte a 75,
 * mientras que una puntuación de estrés raw=4 se convierte a 25
 * (porque estrés alto es negativo para el bienestar).
 *
 * **Polaridad**:
 *   - "positive": Dimensiones donde más es mejor (energía, pertenencia, claridad)
 *   - "negative": Dimensiones donde más es peor (estrés, carga de trabajo)
 *     — se invierten automáticamente
 *
 * Los valores fuera del rango 1-5 se recortan automáticamente.
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
