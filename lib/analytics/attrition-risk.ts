import { RISK_LEVEL, type TeamAverages, type RiskLevel } from "@/lib/types";

/**
 * Clasificación de riesgo de rotación de personal a nivel de equipo.
 *
 * **Qué calcula**: La probabilidad de que miembros del equipo
 * renuncien, basada en señales de insatisfacción como baja pertenencia,
 * alta carga de trabajo y tendencia negativa del OWI.
 *
 * **Cómo se interpreta**:
 *   - LOW:      Riesgo bajo de rotación. Equipo estable.
 *   - MEDIUM:   Dos señales de alerta. Revisar clima laboral.
 *   - HIGH:     Tres o más señales. Preparar plan de retención.
 *   - CRITICAL: Cuatro señales con tendencia negativa. Riesgo inminente
 *               de pérdida de talento — escalar a dirección.
 *
 * **Ejemplo**: Un equipo con belonging=2, energy=2, workload=4.5,
 * stress=4.5 y OWI en descenso (de 60 a 45) tiene riesgo CRITICAL
 * de rotación.
 *
 * **Señales de riesgo**:
 *   - Pertenencia ≤ 2.5 (el colaborador no se siente parte del equipo)
 *   - Energía ≤ 2.5 (desmotivación o fatiga)
 *   - Carga de trabajo ≥ 4 (sobrecarga)
 *   - Estrés ≥ 4 (presión excesiva)
 *   - OWI en descenso por 2 períodos consecutivos (tendencia negativa)
 */
export function calculateAttritionRisk(
  averages: TeamAverages,
  pastOwi?: number,
): RiskLevel {
  const lowBelonging = averages.belonging <= 2.5;
  const lowEnergy = averages.energy <= 2.5;
  const highWorkload = averages.workload >= 4;
  const highStress = averages.stress >= 4;
  const hasDecline =
    pastOwi !== undefined && averages.owi !== undefined && averages.owi < pastOwi;

  const signalCount = [lowBelonging, lowEnergy, highWorkload, highStress]
    .filter(Boolean).length;

  if (signalCount >= 4 && hasDecline) return RISK_LEVEL.CRITICAL;
  if (signalCount >= 3) return RISK_LEVEL.HIGH;
  if (signalCount >= 2) return RISK_LEVEL.MEDIUM;
  return RISK_LEVEL.LOW;
}
