import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth/server";
import { requireRole } from "@/lib/auth/rbac";
import {
  aggregateTeamData,
  calculateOwiWeighted,
  calculateBurnoutRiskTeam,
  calculateAttritionRisk,
  privacyGuard,
} from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";

/**
 * POST /api/metrics/recalculate
 *
 * Triggers a full recalculation of wellbeing scores for all teams.
 * For each team, for each period with sufficient responses (≥ 5):
 *   1. Aggregates SurveyResult scores
 *   2. Calculates OWI, burnout risk, attrition risk
 *   3. Upserts into WellbeingScore (by teamId + period unique constraint)
 *
 * Access: ADMIN, HR_ANALYST only.
 */
export async function POST(): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "No active session." } },
      { status: 401 },
    );
  }

  requireRole(user, [USER_ROLE.ADMIN, USER_ROLE.HR_ANALYST]);

  // ── Process all teams ────────────────────────────────────────────
  const teams = await prisma.team.findMany({ select: { id: true } });

  let scoresCreated = 0;
  let teamsProcessed = 0;

  for (const team of teams) {
    // Get all distinct non-null periods for this team
    const periods = await prisma.surveyResult.findMany({
      where: { teamId: team.id, period: { not: null } },
      select: { period: true },
      distinct: ["period"],
    });

    if (periods.length === 0) continue;

    let teamHadScore = false;

    for (const { period } of periods) {
      if (!period) continue;

      const aggResult = await aggregateTeamData(team.id, period);
      const guard = privacyGuard(aggResult.responseCount);

      if (!guard.sufficient) continue;

      const owi = calculateOwiWeighted(aggResult);
      if (owi === null) continue;

      const averages = { ...aggResult, owi };
      const burnoutRisk = calculateBurnoutRiskTeam(owi);
      const attritionRisk = calculateAttritionRisk(averages);

      await prisma.wellbeingScore.upsert({
        where: {
          teamId_period: { teamId: team.id, period },
        },
        create: {
          teamId: team.id,
          period,
          owi,
          burnoutRisk,
          attritionRisk,
        },
        update: {
          owi,
          burnoutRisk,
          attritionRisk,
        },
      });

      scoresCreated++;
      teamHadScore = true;
    }

    if (teamHadScore) teamsProcessed++;
  }

  return NextResponse.json({
    success: true,
    data: { scoresCreated, teamsProcessed },
  });
}
