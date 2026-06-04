import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getCurrentPeriod, getRecentPeriods, SURVEY_QUESTIONS, calculateStreak } from "@/lib/survey-utils";

/**
 * GET /api/surveys
 *
 * Returns the active survey for the authenticated user's organization,
 * the current ISO week period, whether the user has already submitted,
 * plus history, streak, total responses, and team participation.
 *
 * Response:
 *   200 — { success: true, data: { survey, questions, currentPeriod,
 *          alreadySubmitted, history, streak, totalResponses, teamParticipation } }
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

  // ── History (last 4 periods) ────────────────────────────────────────
  const historyPeriods = getRecentPeriods(4);
  const allResponses = await prisma.surveyResult.findMany({
    where: { userId: user.id, period: { in: historyPeriods } },
    select: { period: true },
  });
  const respondedPeriods = new Set(allResponses.map((r) => r.period!));

  const history = historyPeriods.map((p) => ({
    period: p,
    responded: respondedPeriods.has(p),
  }));

  // ── Streak ──────────────────────────────────────────────────────────
  const userPeriods = await prisma.surveyResult.findMany({
    where: { userId: user.id },
    select: { period: true },
    distinct: ["period"],
    orderBy: { period: "desc" },
  });
  const streak = calculateStreak(userPeriods.map((p) => p.period!).filter(Boolean));

  // ── Total responses ─────────────────────────────────────────────────
  const totalResponses = await prisma.surveyResult.count({
    where: { userId: user.id },
  });

  // ── Team participation ──────────────────────────────────────────────
  let teamParticipation: number | null = null;
  if (user.teamId) {
    const teamMemberCount = await prisma.user.count({
      where: { teamId: user.teamId },
    });
    if (teamMemberCount >= 5) {
      const teamResponded = await prisma.surveyResult.findMany({
        where: { teamId: user.teamId, period },
        select: { userId: true },
        distinct: ["userId"],
      });
      teamParticipation = Math.round((teamResponded.length / teamMemberCount) * 100);
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      survey: { id: activeSurvey.id, name: activeSurvey.name },
      questions: SURVEY_QUESTIONS,
      currentPeriod: period,
      alreadySubmitted: !!existingResponse,
      history,
      streak,
      totalResponses,
      teamParticipation,
    },
  });
}