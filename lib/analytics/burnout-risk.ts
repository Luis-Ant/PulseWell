import { RISK_LEVEL, type RiskLevel } from "@/lib/types";

/**
 * Clasificación de riesgo de burnout a nivel de equipo.
 *
 * **Qué calcula**: El nivel de riesgo de que el equipo sufra burnout
 * (agotamiento laboral) basado en su OWI actual.
 *
 * **Cómo se interpreta**:
 *   - LOW:      Equipo con buen bienestar. Continuar monitoreando.
 *   - MEDIUM:   Señales tempranas. Revisar carga de trabajo y estrés.
 *   - HIGH:     Riesgo significativo. Intervención de liderazgo necesaria.
 *   - CRITICAL: Situación urgente. Se requiere acción inmediata de RRHH.
 *
 * **Ejemplo**: Un OWI de 25 devuelve CRITICAL, indicando que el equipo
 * necesita apoyo urgente para prevenir rotación y agotamiento.
 *
 * **Umbrales**:
 *   - OWI ≥ 70  → LOW
 *   - 50–69     → MEDIUM
 *   - 30–49     → HIGH
 *   - < 30      → CRITICAL
 */
export function calculateBurnoutRiskTeam(owi: number): RiskLevel {
  if (owi >= 70) return RISK_LEVEL.LOW;
  if (owi >= 50) return RISK_LEVEL.MEDIUM;
  if (owi >= 30) return RISK_LEVEL.HIGH;
  return RISK_LEVEL.CRITICAL;
}
