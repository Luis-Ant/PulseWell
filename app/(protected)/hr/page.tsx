import { getUser } from "@/lib/auth";
import { requireRole } from "@/lib/auth/rbac";
import { prisma } from "@/lib/prisma";
import { USER_ROLE, type TeamMetrics } from "@/lib/types";
import { calculateProductivityHealth } from "@/lib/analytics";
import { AlertTriangle, TrendingUp, Users } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { TeamGrid } from "@/components/dashboard/team-grid";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { AlertCard } from "@/components/dashboard/alert-card";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";

import type { AlertDto, RecommendationDto } from "@/lib/types";

// ── Trend data point shape ──────────────────────────────────────────
interface TrendDataPoint {
  period: string;
  [teamName: string]: string | number;
}

// ── Page ────────────────────────────────────────────────────────────
export default async function HrPage() {
  // ── Auth ──────────────────────────────────────────────────────────
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-3xl font-bold text-white">Panel de HR</h1>
        <p className="mt-4 text-slate-400">
          Iniciá sesión para acceder al panel.
        </p>
      </div>
    );
  }

  requireRole(user, [USER_ROLE.ADMIN, USER_ROLE.HR_ANALYST, USER_ROLE.MANAGER]);

  const managerTeamId =
    user.role === USER_ROLE.MANAGER ? user.teamId : null;

  // ── Teams ─────────────────────────────────────────────────────────
  const teams = await prisma.team.findMany({
    where: managerTeamId ? { id: managerTeamId } : undefined,
    select: { id: true, name: true },
  });

  if (teams.length === 0) {
    return <EmptyState />;
  }

  const teamIds = teams.map((t: { id: string; name: string }) => t.id);

  // ── Latest WellbeingScore per team ─────────────────────────────────
  const latestScores = await prisma.wellbeingScore.findMany({
    where: { teamId: { in: teamIds } },
    orderBy: { period: "desc" },
  });

  // Keep only the latest score per team
  const latestByTeam = new Map<
    string,
    {
      owi: number;
      burnoutRisk: string;
      attritionRisk: string;
      period: string;
    }
  >();

  for (const score of latestScores) {
    if (!latestByTeam.has(score.teamId)) {
      latestByTeam.set(score.teamId, {
        owi: score.owi,
        burnoutRisk: score.burnoutRisk,
        attritionRisk: score.attritionRisk,
        period: score.period ?? "",
      });
    }
  }

  // ── Build TeamMetrics[] ───────────────────────────────────────────
  const teamMetricsList: TeamMetrics[] = [];
  const teamOwis: number[] = [];

  for (const team of teams) {
    const latest = latestByTeam.get(team.id);

    if (!latest) {
      teamMetricsList.push({
        teamId: team.id,
        teamName: team.name,
        owi: 0,
        burnoutRisk: "LOW",
        attritionRisk: "LOW",
        productivityHealth: "LOW",
        responseCount: 0,
        period: "",
        insufficientData: true,
      });
      continue;
    }

    // Compute productivity health from OWI (not stored in WellbeingScore)
    const productivityHealth = calculateProductivityHealth({
      energy: 0,
      belonging: 0,
      clarity: 0,
      stress: 0,
      workload: 0,
      owi: latest.owi,
    });

    teamOwis.push(latest.owi);

    teamMetricsList.push({
      teamId: team.id,
      teamName: team.name,
      owi: latest.owi,
      burnoutRisk: latest.burnoutRisk as TeamMetrics["burnoutRisk"],
      attritionRisk: latest.attritionRisk as TeamMetrics["attritionRisk"],
      productivityHealth,
      responseCount: 0, // Will be populated if we had count data
      period: latest.period,
      insufficientData: false,
    });
  }

  // ── Active alerts ─────────────────────────────────────────────────
  const dbAlerts = await prisma.smartAlert.findMany({
    where: {
      teamId: { in: teamIds },
      isActive: true,
      resolvedAt: null,
    },
    include: { team: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

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

  // ── Recommendations ───────────────────────────────────────────────
  const dbRecs = await prisma.recommendation.findMany({
    where: { teamId: { in: teamIds } },
    include: {
      alert: { select: { type: true, message: true, severity: true } },
      team: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
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

  // ── Trend data (last 4 periods) ───────────────────────────────────
  const distinctPeriods = await prisma.wellbeingScore.findMany({
    where: { teamId: { in: teamIds } },
    select: { period: true },
    distinct: ["period"],
    orderBy: { period: "desc" },
    take: 4,
  });

  const last4Periods = distinctPeriods
    .map((p) => p.period)
    .filter((p): p is string => p !== null)
    .reverse();

  const trendScores =
    last4Periods.length > 0
      ? await prisma.wellbeingScore.findMany({
          where: {
            teamId: { in: teamIds },
            period: { in: last4Periods },
          },
          include: { team: { select: { name: true } } },
          orderBy: { period: "asc" },
        })
      : [];

  const trendData: TrendDataPoint[] = last4Periods.map((period) => {
    const point: TrendDataPoint = { period };
    for (const score of trendScores.filter((s) => s.period === period)) {
      point[score.team.name] = score.owi;
    }
    return point;
  });

  // ── Global metrics ────────────────────────────────────────────────
  const globalOwi =
    teamOwis.length > 0
      ? Math.round(teamOwis.reduce((a, b) => a + b, 0) / teamOwis.length)
      : 0;

  const activeTeams = teamMetricsList.filter((t) => !t.insufficientData).length;

  // ── Render ────────────────────────────────────────────────────────
  const hasAnyData = teamMetricsList.some((t) => !t.insufficientData);

  if (!hasAnyData) {
    return <InsufficientDataState />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-white">Panel de HR</h1>
        <p className="mt-1 text-sm text-slate-400">
          Analíticas agregadas, tendencias y alertas por equipo. Los datos se
          muestran únicamente cuando hay suficientes respuestas para preservar
          la privacidad individual.
        </p>
      </div>

      {/* ── Global Metrics Row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={TrendingUp}
          label="OWI Global"
          value={String(globalOwi)}
          status={
            globalOwi >= 70
              ? "LOW"
              : globalOwi >= 50
                ? "MEDIUM"
                : globalOwi >= 30
                  ? "HIGH"
                  : "CRITICAL"
          }
        />

        <MetricCard
          icon={Users}
          label="Equipos"
          value={String(activeTeams)}
        />

        <MetricCard
          icon={AlertTriangle}
          label="Alertas Activas"
          value={String(alerts.length)}
          status={
            alerts.length === 0
              ? "LOW"
              : alerts.length <= 2
                ? "MEDIUM"
                : alerts.length <= 5
                  ? "HIGH"
                  : "CRITICAL"
          }
        />
      </div>

      {/* ── Team Grid ───────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Equipos
        </h2>
        <TeamGrid teams={teamMetricsList} />
      </section>

      {/* ── Trend Chart ─────────────────────────────────────────── */}
      {trendData.length > 0 && (
        <section>
          <TrendChart data={trendData} />
        </section>
      )}

      {/* ── Alerts ──────────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Alertas ({alerts.length})
          </h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AlertCard key={alert.alertId} alert={alert} />
            ))}
          </div>
        </section>
      )}

      {/* ── Recommendations ─────────────────────────────────────── */}
      {recommendations.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Recomendaciones ({recommendations.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.recommendationId}
                recommendation={rec}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <h1 className="text-3xl font-bold text-white">Panel de HR</h1>
      <p className="mt-4 text-slate-400">
        No hay datos disponibles.
      </p>
    </div>
  );
}

// ── Insufficient Data State ──────────────────────────────────────────
function InsufficientDataState() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12">
        <h1 className="text-3xl font-bold text-white">Panel de HR</h1>
        <p className="mt-4 leading-relaxed text-slate-400">
          Datos insuficientes para mostrar métricas de equipo.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Se necesitan al menos 5 respuestas por equipo para mostrar
          analíticas agregadas y preservar la privacidad individual.
        </p>
      </div>
    </div>
  );
}
