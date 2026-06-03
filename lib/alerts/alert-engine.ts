import type { AlertInsertData, TeamAlertInput } from "./types";

/**
 * Genera alertas inteligentes para equipos basándose en sus métricas
 * de bienestar, proyecciones de OWI y tendencias de declive.
 *
 * **Qué evalúa**: 6 tipos de alerta — BURNOUT, ATTRITION, WELLBEING,
 * TREND, PRODUCTIVITY y PREDICTIVE — contra umbrales definidos en
 * la especificación del motor de analíticas.
 *
 * **Cuándo se dispara cada alerta**:
 *   - BURNOUT: burnoutRisk es HIGH o CRITICAL
 *   - ATTRITION: attritionRisk es HIGH o CRITICAL
 *   - WELLBEING: OWI < 50 (MEDIUM si 35-49, HIGH si < 35)
 *   - TREND: equipo en decliningTrendTeams con OWI > 0
 *   - PRODUCTIVITY: productivityHealth es HIGH o CRITICAL
 *   - PREDICTIVE: OWI proyectado < 50
 *
 * **Importante**: Todos los mensajes están en español y usan
 * lenguaje no clínico. Nunca se usa "tiene burnout" — siempre
 * "muestra indicadores de riesgo de burnout".
 *
 * @param teams — lista de equipos con sus métricas actuales.
 * @param projectedOwiByTeam — mapa de teamId a OWI proyectado (o null si no hay suficiente historial).
 * @param decliningTrendTeams — conjunto de teamIds que muestran tendencia negativa consecutiva.
 * @returns lista de alertas generadas (puede estar vacía).
 */
export function generateAlerts(
  teams: TeamAlertInput[],
  projectedOwiByTeam: Map<string, number | null>,
  decliningTrendTeams: Set<string>,
): AlertInsertData[] {
  const alerts: AlertInsertData[] = [];

  for (const team of teams) {
    // Skip teams with no data
    if (team.owi === 0) continue;

    // 1. BURNOUT alert
    if (team.burnoutRisk === "HIGH" || team.burnoutRisk === "CRITICAL") {
      alerts.push({
        teamId: team.teamId,
        type: "BURNOUT",
        severity: team.burnoutRisk === "CRITICAL" ? "CRITICAL" : "HIGH",
        message: `El equipo ${team.teamName} muestra indicadores elevados de riesgo de burnout (OWI: ${team.owi}).`,
        driver:
          "Altos niveles de estrés, baja energía y carga de trabajo elevada.",
      });
    }

    // 2. ATTRITION alert
    if (team.attritionRisk === "HIGH" || team.attritionRisk === "CRITICAL") {
      alerts.push({
        teamId: team.teamId,
        type: "ATTRITION",
        severity: team.attritionRisk === "CRITICAL" ? "CRITICAL" : "HIGH",
        message: `El equipo ${team.teamName} presenta señales de riesgo de rotación (OWI: ${team.owi}).`,
        driver:
          "Baja pertenencia, poca claridad de objetivos y carga emocional elevada.",
      });
    }

    // 3. WELLBEING alert
    if (team.owi < 50 && team.owi > 0) {
      const severity = team.owi < 35 ? "HIGH" : "MEDIUM";
      alerts.push({
        teamId: team.teamId,
        type: "WELLBEING",
        severity,
        message: `El OWI del equipo ${team.teamName} está por debajo del umbral saludable (${team.owi}/100).`,
        driver:
          "El índice de bienestar general indica condiciones que requieren atención.",
      });
    }

    // 4. TREND alert
    if (decliningTrendTeams.has(team.teamId) && team.owi > 0) {
      const severity = team.owi < 50 ? "HIGH" : "MEDIUM";
      alerts.push({
        teamId: team.teamId,
        type: "TREND",
        severity,
        message: `El equipo ${team.teamName} muestra una tendencia negativa consecutiva en su OWI.`,
        driver:
          "El OWI ha disminuido durante dos o más períodos consecutivos.",
      });
    }

    // 5. PRODUCTIVITY alert
    if (
      team.productivityHealth === "HIGH" ||
      team.productivityHealth === "CRITICAL"
    ) {
      alerts.push({
        teamId: team.teamId,
        type: "PRODUCTIVITY",
        severity:
          team.productivityHealth === "CRITICAL" ? "CRITICAL" : "HIGH",
        message: `El equipo ${team.teamName} muestra señales de baja productividad (OWI: ${team.owi}).`,
        driver:
          "Baja claridad, energía reducida y posible cambio de contexto excesivo.",
      });
    }

    // 6. PREDICTIVE alert
    const projectedOwi = projectedOwiByTeam.get(team.teamId);
    if (
      projectedOwi !== null &&
      projectedOwi !== undefined &&
      projectedOwi < 50
    ) {
      const severity = projectedOwi < 35 ? "HIGH" : "MEDIUM";
      alerts.push({
        teamId: team.teamId,
        type: "PREDICTIVE",
        severity,
        message: `Proyección simulada: el OWI del equipo ${team.teamName} podría descender a ${Math.round(projectedOwi)} en el siguiente período.`,
        driver:
          "Si la tendencia actual continúa, el equipo podría entrar en una condición de riesgo durante el siguiente período.",
      });
    }
  }

  return alerts;
}
