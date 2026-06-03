import { RISK_LEVEL, type TeamAverages, type RiskLevel } from "@/lib/types";

/**
 * Clasificación de salud productiva a nivel de equipo.
 *
 * **Qué calcula**: Una evaluación de qué tan productivo está el equipo
 * basada en claridad de objetivos, nivel de energía, equilibrio de carga
 * y sentido de pertenencia.
 *
 * **Cómo se interpreta**:
 *   - LOW:      4 de 4 dimensiones saludables. Equipo productivo y alineado.
 *   - MEDIUM:   3 de 4. Mayormente bien pero con un área a mejorar.
 *   - HIGH:     2 de 4. La productividad está comprometida en varias áreas.
 *   - CRITICAL: 0-1 de 4. El equipo no puede rendir. Intervención urgente.
 *
 * **Ejemplo**: Un equipo con claridad=4, energía=4, carga=2, pertenencia=4
 * tiene 4 dimensiones saludables → riesgo LOW (buena productividad).
 *
 * **Umbrales de salud por dimensión**:
 *   - Claridad ≥ 3.5 (el equipo entiende sus objetivos)
 *   - Energía ≥ 3.5 (el equipo tiene motivación)
 *   - Carga de trabajo ≤ 3.5 (no hay sobrecarga)
 *   - Pertenencia ≥ 3.5 (hay cohesión de equipo)
 */
export function calculateProductivityHealth(
  averages: TeamAverages,
): RiskLevel {
  const clarityOk = averages.clarity >= 3.5;
  const energyOk = averages.energy >= 3.5;
  const workloadOk = averages.workload <= 3.5;
  const belongingOk = averages.belonging >= 3.5;

  const healthyCount = [clarityOk, energyOk, workloadOk, belongingOk]
    .filter(Boolean).length;

  if (healthyCount >= 4) return RISK_LEVEL.LOW;
  if (healthyCount >= 3) return RISK_LEVEL.MEDIUM;
  if (healthyCount >= 2) return RISK_LEVEL.HIGH;
  return RISK_LEVEL.CRITICAL;
}
