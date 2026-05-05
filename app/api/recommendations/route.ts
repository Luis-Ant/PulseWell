import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth/server";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { USER_ROLE, type RecommendationDto } from "@/lib/types";

/**
 * GET /api/recommendations
 *
 * Returns recommendations linked to active alerts (and general ones),
 * ordered by recency (newest first).
 *
 * Access:
 *   ADMIN, HR_ANALYST → all recommendations
 *   MANAGER            → only recommendations for own team (user.teamId)
 *   EMPLOYEE           → 403 Forbidden
 */
export async function GET(): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "No active session." } },
      { status: 401 },
    );
  }

  requireRole(user, [USER_ROLE.ADMIN, USER_ROLE.HR_ANALYST, USER_ROLE.MANAGER]);

  const managerTeamId = user.role === USER_ROLE.MANAGER ? user.teamId : null;

  // ── Query recommendations ────────────────────────────────────────
  const dbRecs = await prisma.recommendation.findMany({
    where: {
      ...(managerTeamId ? { teamId: managerTeamId } : {}),
    },
    include: {
      alert: { select: { type: true, message: true, severity: true } },
      team: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // ── Map to RecommendationDto[] ───────────────────────────────────
  const recommendations: RecommendationDto[] = dbRecs.map((r) => ({
    recommendationId: r.id,
    alertId: r.alertId,
    teamId: r.teamId,
    teamName: r.team.name,
    type: r.alert?.type ?? r.category,
    title: r.alert?.message ?? r.category,
    description: r.action,
    actionableSteps: [r.action],
    createdAt: r.createdAt.toISOString(),
  }));

  return NextResponse.json({
    success: true,
    data: { recommendations },
  });
}
