import type { AlertInsertData, RecommendationInsertData } from "./types";

/**
 * Mapa de tipo de alerta a categorías de recomendación con acciones
 * en español, basado en la especificación del motor de analíticas.
 */
const RECOMMENDATION_MAP: Record<
  string,
  Array<{ category: string; action: string }>
> = {
  BURNOUT: [
    {
      category: "workload",
      action:
        "Reducir reuniones no esenciales y redistribuir carga de trabajo.",
    },
    {
      category: "recovery",
      action:
        "Incorporar espacios de recuperación y pausar iniciativas no críticas.",
    },
  ],
  ATTRITION: [
    {
      category: "recognition",
      action:
        "Reforzar reconocimiento, rituales de equipo e inclusión en decisiones.",
    },
    {
      category: "clarity",
      action:
        "Alinear prioridades, objetivos y criterios de éxito semanal.",
    },
  ],
  WELLBEING: [
    {
      category: "leadership",
      action:
        "Programar un check-in de equipo para identificar bloqueos y preocupaciones.",
    },
  ],
  TREND: [
    {
      category: "collaboration",
      action:
        "Organizar una retrospectiva enfocada en identificar causas del declive.",
    },
  ],
  PRODUCTIVITY: [
    {
      category: "workload",
      action:
        "Reducir cambio de contexto y clarificar el foco semanal del equipo.",
    },
  ],
  PREDICTIVE: [
    {
      category: "leadership",
      action:
        "Tomar acciones preventivas ahora para evitar deterioro en el siguiente período.",
    },
  ],
};

/**
 * Recomendación por defecto para tipos de alerta desconocidos.
 */
const FALLBACK_RECOMMENDATION = {
  category: "leadership",
  action: "Revisar el estado del equipo y considerar acciones preventivas.",
};

/**
 * Genera recomendaciones accionables a partir de una lista de alertas.
 *
 * **Qué hace**: Para cada alerta, busca en el mapa de recomendaciones
 * las acciones preventivas correspondientes según el tipo de alerta.
 * Garantiza que cada alerta reciba al menos 1 recomendación.
 *
 * **Categorías disponibles**: workload, recovery, recognition, clarity,
 * leadership, collaboration.
 *
 * **Idioma**: Todas las recomendaciones están en español con lenguaje
 * preventivo y no clínico.
 *
 * **Importante**: El `alertId` se deja sin asignar (`undefined`) porque
 * las alertas aún no se han persistido en la base de datos. El llamador
 * debe vincular el `alertId` después de insertar las alertas.
 *
 * @param alerts — lista de alertas para las cuales generar recomendaciones.
 * @returns lista de recomendaciones (una por cada entrada del mapa de recomendaciones).
 */
export function generateRecommendations(
  alerts: AlertInsertData[],
): RecommendationInsertData[] {
  const recommendations: RecommendationInsertData[] = [];

  for (const alert of alerts) {
    const mapping = RECOMMENDATION_MAP[alert.type];

    if (mapping) {
      for (const rec of mapping) {
        recommendations.push({
          teamId: alert.teamId,
          alertId: undefined,
          category: rec.category,
          action: rec.action,
        });
      }
    } else {
      // Fallback for unknown alert types
      recommendations.push({
        teamId: alert.teamId,
        alertId: undefined,
        category: FALLBACK_RECOMMENDATION.category,
        action: FALLBACK_RECOMMENDATION.action,
      });
    }
  }

  return recommendations;
}
