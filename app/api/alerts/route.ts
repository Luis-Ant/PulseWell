import { NextResponse } from "next/server";

import { getUser } from "@/lib/auth/server";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { USER_ROLE, type AlertDto } from "@/lib/types";

/**
 * GET /api/alerts
 *
 * Returns active alerts (isActive: true, resolvedAt: null) sorted by
 * severity (CRITICAL first, then HIGH, MEDIUM, LOW) and then recency.
 *
 * Access:
 *   ADMIN, HR_ANALYST → all active alerts
 *   MANAGER            → only alerts for own team (user.teamId)
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

  // ── Query alerts ─────────────────────────────────────────────────
  const dbAlerts = await prisma.smartAlert.findMany({
    where: {
      isActive: true,
      resolvedAt: null,
      ...(managerTeamId ? { teamId: managerTeamId } : {}),
    },
    include: { team: { select: { name: true } } },
  });

  // ── Sort by severity (CRITICAL > HIGH > MEDIUM > LOW) then date ─
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

  // ── Map to AlertDto[] ────────────────────────────────────────────
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

  return NextResponse.json({
    success: true,
    data: { alerts },
  });
}
