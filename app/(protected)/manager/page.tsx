import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { USER_ROLE, RISK_LEVEL, type RiskLevel } from "@/lib/types";
import { calculateProductivityHealth, calculateProjection } from "@/lib/analytics";
import { formatPeriod } from "@/lib/format-utils";
import { TrendingUp, AlertTriangle, ShieldCheck, Brain, Users, MessageSquare } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { RiskBadge } from "@/components/dashboard/risk-badge";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { AlertCard } from "@/components/dashboard/alert-card";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { AutoRefresh } from "@/components/shared/AutoRefresh";

import type { AlertDto, RecommendationDto } from "@/lib/types";

interface TrendDataPoint {
  period: string;
  [teamName: string]: string | number;
}

export default async function ManagerPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-3xl font-bold text-white">Panel de Manager</h1>
        <p className="mt-4 text-slate-400">Iniciá sesión para acceder al panel.</p>
      </div>
    );
  }

  if (user.role !== USER_ROLE.MANAGER || !user.teamId) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-3xl font-bold text-white">Panel de Manager</h1>
        <p className="mt-4 text-slate-400">
          Este panel es exclusivo para managers con un equipo asignado.
        </p>
      </div>
    );
  }

  const teamId = user.teamId;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { id: true, name: true, _count: { select: { users: true } } },
  });

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-3xl font-bold text-white">Panel de Manager</h1>
        <p className="mt-4 text-slate-400">Equipo no encontrado.</p>
      </div>
    );
  }

  // Latest WellbeingScore
  const latestScore = await prisma.wellbeingScore.findFirst({
    where: { teamId },
    orderBy: { period: "desc" },
  });

  if (!latestScore) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12">
          <h1 className="text-3xl font-bold text-white">Panel de Manager — {team.name}</h1>
          <p className="mt-4 leading-relaxed text-slate-400">
            Datos insuficientes para mostrar métricas del equipo.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Se necesitan al menos 5 respuestas para preservar la privacidad individual.
          </p>
        </div>
      </div>
    );
  }

  // ── Team context ──────────────────────────────────────────────────
  const memberCount = team._count.users;

  const responseCount = await prisma.surveyResult.count({
    where: { teamId, period: latestScore.period ?? "" },
  });

  // Compute productivity health from OWI
  const productivityHealth = calculateProductivityHealth({
    energy: 0,
    belonging: 0,
    clarity: 0,
    stress: 0,
    workload: 0,
    owi: latestScore.owi,
  });

  // ── Dimension averages (latest period) ────────────────────────────
  const dimAverages = await prisma.surveyResult.aggregate({
    where: { teamId, period: latestScore.period ?? "" },
    _avg: { energy: true, belonging: true, clarity: true, stress: true, workload: true },
  });

  // ── Org average comparison ────────────────────────────────────────
  const allScores = await prisma.wellbeingScore.findMany({
    where: { period: latestScore.period ?? "" },
    select: { owi: true },
  });
  const orgAvgOwi =
    allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b.owi, 0) / allScores.length)
      : null;

  // ── Active alerts (single team) ───────────────────────────────────
  const dbAlerts = await prisma.smartAlert.findMany({
    where: { teamId, isActive: true, resolvedAt: null },
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

  // Recommendations (single team)
  const dbRecs = await prisma.recommendation.findMany({
    where: { teamId },
    include: {
      alert: { select: { type: true, message: true, severity: true } },
      team: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
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

  // Trend data (single team, last 4 periods)
  const rawScores = await prisma.wellbeingScore.findMany({
    where: { teamId },
    orderBy: { period: "desc" },
    take: 4,
  });
  const trendScores = rawScores.reverse();

  const trendData: TrendDataPoint[] = trendScores.map((s) => ({
    period: s.period ?? "",
    [team.name]: s.owi,
  }));

  // OWI projection
  const owiHistory = trendScores.map((s) => s.owi);
  const projectedOwi = calculateProjection(owiHistory);

  // Helper: classify OWI into RiskLevel
  const classifyOwi = (owi: number): RiskLevel => {
    if (owi >= 70) return RISK_LEVEL.LOW;
    if (owi >= 50) return RISK_LEVEL.MEDIUM;
    if (owi >= 30) return RISK_LEVEL.HIGH;
    return RISK_LEVEL.CRITICAL;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <AutoRefresh />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Panel de Manager</h1>
        <p className="mt-1 text-sm text-slate-400">
          Bienestar de{" "}
          <span className="font-semibold text-slate-300">{team.name}</span>
          {" · "}
          <span className="text-slate-500">{formatPeriod(latestScore.period ?? "")}</span>.
          Los datos se muestran de forma agregada para preservar la privacidad individual.
        </p>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" /> {memberCount} miembro{memberCount !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3" /> {responseCount} respuesta{responseCount !== 1 ? "s" : ""}
          </span>
        </p>
      </div>

      {/* ── Intervention Banner ─────────────────────────────────── */}
      {(latestScore.burnoutRisk === "HIGH" || latestScore.burnoutRisk === "CRITICAL" ||
        latestScore.attritionRisk === "HIGH" || latestScore.attritionRisk === "CRITICAL") && (
        <div className="rounded-2xl border border-red-800/40 bg-red-950/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-300">Tu equipo necesita atención</p>
              <p className="mt-1 text-xs leading-relaxed text-red-400/70">
                Se detectaron {[
                  latestScore.burnoutRisk === "HIGH" || latestScore.burnoutRisk === "CRITICAL" ? "riesgo de burnout" : null,
                  latestScore.attritionRisk === "HIGH" || latestScore.attritionRisk === "CRITICAL" ? "riesgo de rotación" : null,
                ].filter(Boolean).join(" y ")}. Revisá las recomendaciones y tomá acción para mejorar el bienestar del equipo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics row — 4 cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <MetricCard
            icon={TrendingUp}
            label="OWI del Equipo"
            value={String(latestScore.owi)}
            status={classifyOwi(latestScore.owi)}
          />
          {orgAvgOwi !== null && (() => {
            const diff = latestScore.owi - orgAvgOwi;
            const diffAbs = Math.abs(diff);
            const label = diff > 0
              ? `${diffAbs} puntos por encima del promedio`
              : diff < 0
                ? `${diffAbs} puntos por debajo del promedio`
                : "Igual al promedio";
            return (
              <p className={`mt-1 text-xs ${diff >= 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-slate-500"}`}>
                {label}
              </p>
            );
          })()}
        </div>
        <MetricCard
          icon={AlertTriangle}
          label="Alertas Activas"
          value={String(alerts.length)}
          status={classifyOwi(
            alerts.length === 0 ? 100 : alerts.length <= 2 ? 60 : alerts.length <= 5 ? 40 : 20,
          )}
        />
        {projectedOwi !== null && (
          <MetricCard
            icon={TrendingUp}
            label="OWI Proyectado"
            value={String(Math.round(projectedOwi))}
            status={classifyOwi(projectedOwi)}
          />
        )}
        <MetricCard
          icon={Brain}
          label="Productividad"
          value={productivityHealth === "LOW" ? "Baja" : productivityHealth === "MEDIUM" ? "Media" : productivityHealth === "HIGH" ? "Alta" : "Crítica"}
          status={productivityHealth}
        />
      </div>

      {/* Risk badges row */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Riesgos:</span>
          <RiskBadge level={latestScore.burnoutRisk as RiskLevel} label="Burnout" />
          <RiskBadge level={latestScore.attritionRisk as RiskLevel} label="Rotación" />
          <RiskBadge level={productivityHealth} label="Productividad" />
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-300">Desglose por dimensión</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(() => {
            const dims = [
              { label: "Energía", value: dimAverages._avg.energy ?? 0, max: 5, color: "bg-cyan-400" },
              { label: "Pertenencia", value: dimAverages._avg.belonging ?? 0, max: 5, color: "bg-purple-400" },
              { label: "Claridad", value: dimAverages._avg.clarity ?? 0, max: 5, color: "bg-blue-400" },
              { label: "Estrés", value: dimAverages._avg.stress ?? 0, max: 5, color: "bg-orange-400" },
              { label: "Carga", value: dimAverages._avg.workload ?? 0, max: 5, color: "bg-red-400" },
            ];
            return dims.map((dim) => (
              <div key={dim.label} className="flex flex-col items-center gap-2">
                <div className="h-2 w-full rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${dim.color}`}
                    style={{ width: `${(dim.value / dim.max) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">
                  {dim.label} ({dim.value.toFixed(1)})
                </span>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Trend chart */}
      {trendData.length > 0 && (
        <section>
          <TrendChart data={trendData} />
        </section>
      )}

      {/* Alerts */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Alertas ({alerts.length})
        </h2>
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AlertCard key={alert.alertId} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-emerald-800/50 bg-emerald-950/20 p-8 text-center">
            <p className="text-sm font-medium text-emerald-300">No hay alertas activas</p>
            <p className="mt-1 text-xs text-emerald-400/60">
              El equipo se encuentra dentro de rangos saludables.
            </p>
          </div>
        )}
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Recomendaciones ({recommendations.length})
        </h2>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.recommendationId} recommendation={rec} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-emerald-800/50 bg-emerald-950/20 p-8 text-center">
            <p className="text-sm font-medium text-emerald-300">No hay recomendaciones pendientes</p>
            <p className="mt-1 text-xs text-emerald-400/60">
              Las métricas actuales no requieren acciones preventivas adicionales.
            </p>
          </div>
        )}
      </section>

      {/* Privacy footer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
        <ShieldCheck className="mx-auto size-5 text-slate-600" />
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Los datos mostrados son agregados a nivel equipo. Las respuestas individuales
          nunca se comparten. Se requiere un mínimo de 5 respuestas para mostrar métricas.
        </p>
      </div>
    </div>
  );
}
