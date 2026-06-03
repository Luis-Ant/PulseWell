/**
 * Tipos para el motor de alertas y recomendaciones de PulseWell.
 *
 * Define las estructuras de datos de entrada y salida para
 * la generación dinámica de alertas inteligentes basadas
 * en métricas de bienestar del equipo.
 */

export interface AlertInsertData {
  teamId: string;
  type: string; // AlertType enum value (BURNOUT, ATTRITION, WELLBEING, TREND, PRODUCTIVITY, PREDICTIVE)
  severity: string; // AlertSeverity enum value (LOW, MEDIUM, HIGH, CRITICAL)
  message: string;
  driver: string;
}

export interface RecommendationInsertData {
  teamId: string;
  alertId?: string;
  category: string;
  action: string;
}

export interface TeamAlertInput {
  teamId: string;
  teamName: string;
  owi: number;
  burnoutRisk: string;
  attritionRisk: string;
  productivityHealth: string;
  period: string;
}
