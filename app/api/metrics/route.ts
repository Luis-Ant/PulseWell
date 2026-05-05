import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth/server";
import { requireRole } from "@/lib/auth/rbac";
import {
  aggregateTeamData,
  calculateOwiWeighted,
  calculateBurnoutRiskTeam,
  calculateAttritionRisk,
  calculateProductivityHealth,
  privacyGuard,
} from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { USER_ROLE, type AlertDto, type RecommendationDto, type TeamMetrics } from "@/lib/types";

/**
 * GET /api/metrics
 *
 * Returns global OWI, per-team metrics (OWI, burnout risk, attrition risk,
 * productivity health), active alerts, and recommendations.
 *
 * Access:
 *   ADMIN, HR_ANALYST → all teams
 *   MANAGER            → own team only (filtered by user.teamId)
 *   EMPLOYEE           → 403 Forbidden
 *
 * Privacy guard: teams with < 5 responses get insufficientData: true.
 * NEVER returns individual responses, userId, or email.
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

  // ── Fetch teams ──────────────────────────────────────────────────
  const teams = await prisma.team.findMany({
    where: managerTeamId ? { id: managerTeamId } : undefined,
    select: { id: true, name: true },
  });

  // ── Latest period per team ───────────────────────────────────────
  const allPeriods = await prisma.surveyResult.findMany({
    where: {
      period: { not: null },
      ...(managerTeamId ? { teamId: managerTeamId } : {}),
    },
    select: { teamId: true, period: true },
    distinct: ["teamId", "period"],
    orderBy: { period: "desc" },
  });

  const latestPeriodByTeam = new Map<string, string>();
  for (const row of allPeriods) {
    if (!latestPeriodByTeam.has(row.teamId) && row.period) {
      latestPeriodByTeam.set(row.teamId, row.period);
    }
  }

  // ── Build TeamMetrics[] ──────────────────────────────────────────
  const teamMetricsList: TeamMetrics[] = [];
  const teamOwis: number[] = [];

  for (const team of teams) {
    const period = latestPeriodByTeam.get(team.id);

    if (!period) {
      teamMetricsList.push({
        teamId: team.id,
        teamName: team.name,
        owi: 0,
        burnoutRisk: "LOW" as const,
        attritionRisk: "LOW" as const,
        productivityHealth: "LOW" as const,
        responseCount: 0,
        period: "",
        insufficientData: true,
      });
      continue;
    }

    const aggResult = await aggregateTeamData(team.id, period);
    const guard = privacyGuard(aggResult.responseCount);

    if (!guard.sufficient) {
      teamMetricsList.push({
        teamId: team.id,
        teamName: team.name,
        owi: 0,
        burnoutRisk: "LOW" as const,
        attritionRisk: "LOW" as const,
        productivityHealth: "LOW" as const,
        responseCount: aggResult.responseCount,
        period,
        insufficientData: true,
      });
      continue;
    }

    const owi = calculateOwiWeighted(aggResult);
    if (owi === null) {
      teamMetricsList.push({
        teamId: team.id,
        teamName: team.name,
        owi: 0,
        burnoutRisk: "LOW" as const,
        attritionRisk: "LOW" as const,
        productivityHealth: "LOW" as const,
        responseCount: aggResult.responseCount,
        period,
        insufficientData: true,
      });
      continue;
    }

    // Patch computed OWI into averages for risk functions that need it
    const averages = { ...aggResult, owi };
    const burnoutRisk = calculateBurnoutRiskTeam(owi);
    const attritionRisk = calculateAttritionRisk(averages);
    const productivityHealth = calculateProductivityHealth(averages);

    teamOwis.push(owi);

    teamMetricsList.push({
      teamId: team.id,
      teamName: team.name,
      owi,
      burnoutRisk,
      attritionRisk,
      productivityHealth,
      responseCount: aggResult.responseCount,
      period,
      insufficientData: false,
    });
  }

  // ── Global OWI ───────────────────────────────────────────────────
  const globalOwi =
    teamOwis.length > 0
      ? Math.round(teamOwis.reduce((a, b) => a + b, 0) / teamOwis.length)
      : 0;

  // ── Active alerts ────────────────────────────────────────────────
  const teamIds = teams.map((t) => t.id);

  const dbAlerts = await prisma.smartAlert.findMany({
    where: {
      teamId: { in: teamIds },
      isActive: true,
      resolvedAt: null,
    },
    include: { team: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Sort by severity (CRITICAL > HIGH > MEDIUM > LOW) then date
  const severityOrder: Record<string, number> = {
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  dbAlerts.sort(
    (a, b) =>
      (severityOrder[b.severity] ?? 0) - (severityOrder[a.severity] ?? 0) ||
      b.createdAt.getTime() - a.createdAt.getTime(),
  );

  const alerts: AlertDto[] = dbAlerts.map((a) => ({
    alertId: a.id,
    teamId: a.teamId,
    teamName: a.team.name,
    type: a.type,
    severity: a.severity,
    message: a.message,
    description: a.driver ? `${a.message} — ${a.driver}` : a.message,
    triggeredAt: a.createdAt.toISOString(),
    resolvedAt: a.resolvedAt?.toISOString() ?? null,
    isActive: a.isActive,
  }));

  // ── Recommendations ──────────────────────────────────────────────
  const dbRecs = await prisma.recommendation.findMany({
    where: { teamId: { in: teamIds } },
    include: {
      alert: { select: { type: true, message: true, severity: true } },
      team: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

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

  // ── Response ─────────────────────────────────────────────────────
  return NextResponse.json({
    success: true,
    data: {
      globalOwi,
      teams: teamMetricsList,
      alerts,
      recommendations,
    },
  });
}
