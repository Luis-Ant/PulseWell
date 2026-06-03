import type { TrendClassification } from "@/lib/types";

/**
 * Calcula la tendencia del OWI entre dos períodos consecutivos.
 *
 * **Qué calcula**: La dirección del cambio en el bienestar del equipo
 * comparando el OWI actual con el del período anterior.
 *
 * **Cómo se interpreta**:
 *   - improving: El bienestar mejoró más de 2 puntos → continuar acciones
 *   - declining: El bienestar empeoró más de 2 puntos → investigar causas
 *   - stable:    El cambio está dentro de ±2 puntos → situación controlada
 *
 * **Ejemplo**: OWI pasó de 65 a 70 en una semana → delta=5, "improving".
 * El equipo muestra una recuperación positiva del bienestar.
 *
 * @returns delta (diferencia actual - anterior) y clasificación textual.
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
 * Proyección lineal del OWI para el próximo período.
 *
 * **Qué calcula**: Una estimación de hacia dónde va el bienestar del
 * equipo basándose en el historial de OWI. Usa regresión lineal simple
 * para proyectar 1 período hacia adelante.
 *
 * **Cómo se interpreta**:
 *   - Proyección > OWI actual: La tendencia indica mejora continua
 *   - Proyección ≈ OWI actual: Se espera estabilidad
 *   - Proyección < OWI actual: La tendencia indica posible deterioro
 *
 * **Ejemplo**: Con historial [50, 60, 70], la proyección es ~80,
 * indicando que si la tendencia continúa, el equipo alcanzará un
 * bienestar saludable la próxima semana.
 *
 * **Limitación**: Es una proyección matemática simple, no un predictor
 * exacto. Factores externos (cambios organizacionales, eventos) pueden
 * alterar la trayectoria real.
 *
 * @param owiHistory — historial de puntuaciones OWI en orden cronológico.
 * @returns OWI proyectado para el próximo período, o null si hay < 2 datos.
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
