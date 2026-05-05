import type { PrivacyGuardResult } from "@/lib/types";

const DEFAULT_MIN_RESPONSES = 5;

/**
 * Privacy guard — enforces minimum response count before exposing team metrics.
 *
 * Returns {@link PrivacyGuardResult} with `sufficient: false` and a Spanish
 * privacy message when the team has too few responses.
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
