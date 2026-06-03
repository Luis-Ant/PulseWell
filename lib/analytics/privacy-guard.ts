import type { PrivacyGuardResult } from "@/lib/types";

const DEFAULT_MIN_RESPONSES = 5;

/**
 * Guardia de privacidad — asegura que las métricas de equipo solo se
 * muestren cuando hay suficientes respuestas para proteger el anonimato.
 *
 * **Qué calcula**: Verifica si la cantidad de respuestas de un equipo
 * alcanza el umbral mínimo necesario para mostrar métricas agregadas
 * sin riesgo de identificar a colaboradores individuales.
 *
 * **Cómo se interpreta**:
 *   - sufficient=true:  Hay datos suficientes, se pueden mostrar métricas
 *   - sufficient=false: Datos insuficientes, mostrar mensaje de privacidad
 *
 * **Ejemplo**: Un equipo con 3 respuestas y umbral=5 devuelve
 * sufficient=false con el mensaje "Datos insuficientes para mostrar
 * métricas de equipo" para proteger la privacidad individual.
 *
 * **Umbral por defecto**: 5 respuestas. Este valor puede ajustarse según
 * el tamaño del equipo y las políticas de privacidad de la organización.
 */
export function privacyGuard(
  responseCount: number,
  minResponses: number = DEFAULT_MIN_RESPONSES,
): PrivacyGuardResult {
  const sufficient = responseCount >= minResponses;

  return {
    sufficient,
    responseCount,
    message: sufficient
      ? ""
      : "Datos insuficientes para mostrar métricas de equipo",
    code: sufficient ? "" : "PRIVACY_THRESHOLD_NOT_MET",
  };
}
