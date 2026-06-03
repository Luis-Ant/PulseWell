import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth/server";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";
import { generateAlerts, generateRecommendations } from "@/lib/alerts";
import type { TeamAlertInput } from "@/lib/alerts";
import {
  aggregateTeamData,
  calculateOwiWeighted,
  calculateBurnoutRiskTeam,
  calculateAttritionRisk,
  calculateProductivityHealth,
  calculateProjection,
  privacyGuard,
} from "@/lib/analytics";

/**
 * POST /api/alerts/regenerate
 *
 * Limpia todas las alertas y recomendaciones existentes, y las regenera
 * desde los WellbeingScores y SurveyResults actuales usando los motores
 * de alertas y recomendaciones.
 *
 * Acceso: ADMIN, HR_ANALYST únicamente.
 *
 * Respuesta:
 *   200 — { success: true, data: { alertsCreated, recommendationsCreated } }
 *   401 — No autenticado
 *   403 — Rol no autorizado
 */
export async function POST(): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "No active session." },
      },
      { status: 401 },
    );
  }

  requireRole(user, [USER_ROLE.ADMIN, USER_ROLE.HR_ANALYST]);

  // ── Delete existing alerts and recommendations ───────────────────
  await prisma.recommendation.deleteMany();
  await prisma.smartAlert.deleteMany();

  // ── Gather all teams ─────────────────────────────────────────────
  const teams = await prisma.team.findMany({
    select: { id: true, name: true },
  });

  const teamIds = teams.map((t) => t.id);

  // ── Find latest period per team ──────────────────────────────────
  const allPeriods = await prisma.surveyResult.findMany({
    where: { period: { not: null } },
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

  // ── Fetch well-being scores history per team ─────────────────────
  const allScores = await prisma.wellbeingScore.findMany({
    where: { teamId: { in: teamIds } },
    orderBy: { period: "desc" },
  });

  const owiHistoryByTeam = new Map<string, number[]>();
  for (const score of allScores) {
    if (!owiHistoryByTeam.has(score.teamId)) {
      owiHistoryByTeam.set(score.teamId, []);
    }
    owiHistoryByTeam.get(score.teamId)!.push(score.owi);
  }

  // ── Build TeamAlertInput[] ───────────────────────────────────────
  const teamInputs: TeamAlertInput[] = [];
  const decliningTrendTeams = new Set<string>();
  const projectedOwiByTeam = new Map<string, number | null>();

  for (const team of teams) {
    const period = latestPeriodByTeam.get(team.id);
    if (!period) continue;

    const aggResult = await aggregateTeamData(team.id, period);
    const guard = privacyGuard(aggResult.responseCount);
    if (!guard.sufficient) continue;

    const owi = calculateOwiWeighted(aggResult);
    if (owi === null) continue;

    const averages = { ...aggResult, owi };
    const burnoutRisk = calculateBurnoutRiskTeam(owi);
    const attritionRisk = calculateAttritionRisk(averages);
    const productivityHealth = calculateProductivityHealth(averages);

    // Detect declining trend
    const history = owiHistoryByTeam.get(team.id) ?? [];
    let consecutiveDeclines = 0;
    for (let i = 1; i < history.length; i++) {
      if (history[i] < history[i - 1]) {
        consecutiveDeclines++;
      } else {
        consecutiveDeclines = 0;
      }
    }
    if (consecutiveDeclines >= 2 && owi < 70) {
      decliningTrendTeams.add(team.id);
    }

    // Compute projection
    projectedOwiByTeam.set(team.id, calculateProjection(history));

    teamInputs.push({
      teamId: team.id,
      teamName: team.name,
      owi,
      burnoutRisk,
      attritionRisk,
      productivityHealth,
      period,
    });
  }

  // ── Generate alerts ──────────────────────────────────────────────
  const alerts = generateAlerts(
    teamInputs,
    projectedOwiByTeam,
    decliningTrendTeams,
  );

  let alertsCreated = 0;
  const savedAlerts: Array<{ id: string }> = [];

  for (const alert of alerts) {
    const saved = await prisma.smartAlert.create({
      data: {
        teamId: alert.teamId,
        type: alert.type as never,
        severity: alert.severity as never,
        message: alert.message,
        driver: alert.driver,
        isActive: true,
      },
    });
    savedAlerts.push({ id: saved.id });
    alertsCreated++;
  }

  // ── Generate recommendations (linked to saved alerts) ────────────
  const recommendations = generateRecommendations(alerts);
  let recsCreated = 0;

  for (let i = 0; i < recommendations.length; i++) {
    const rec = recommendations[i];
    const alertIdx = Math.min(i, savedAlerts.length - 1);
    const linkedAlert = savedAlerts[alertIdx];

    await prisma.recommendation.create({
      data: {
        teamId: rec.teamId,
        alertId: linkedAlert.id,
        category: rec.category,
        action: rec.action,
      },
    });
    recsCreated++;
  }

  return NextResponse.json({
    success: true,
    data: {
      alertsCreated,
      recommendationsCreated: recsCreated,
    },
  });
}
