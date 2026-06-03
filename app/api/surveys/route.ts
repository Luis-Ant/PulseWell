import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getCurrentPeriod, SURVEY_QUESTIONS } from "@/lib/survey-utils";

/**
 * GET /api/surveys
 *
 * Returns the active survey for the authenticated user's organization,
 * the current ISO week period, and whether the user has already
 * submitted a response for this period.
 *
 * Response:
 *   200 — { success: true, data: { survey, questions, currentPeriod, alreadySubmitted } }
 *   401 — { success: false, error: { code: "UNAUTHORIZED", message: "..." } }
 *   404 — { success: false, error: { code: "NOT_FOUND", message: "No hay encuesta activa." } }
 */
export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "No active session." } },
      { status: 401 },
    );
  }

  const period = getCurrentPeriod();

  const activeSurvey = await prisma.survey.findFirst({
    where: { organizationId: user.organizationId, isActive: true },
  });

  if (!activeSurvey) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "No hay encuesta activa." } },
      { status: 404 },
    );
  }

  const existingResponse = await prisma.surveyResult.findUnique({
    where: { userId_period: { userId: user.id, period } },
  });

  return NextResponse.json({
    success: true,
    data: {
      survey: { id: activeSurvey.id, name: activeSurvey.name },
      questions: SURVEY_QUESTIONS,
      currentPeriod: period,
      alreadySubmitted: !!existingResponse,
    },
  });
}
