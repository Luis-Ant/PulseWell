import { prisma } from "@/lib/prisma";
import { Building2, Users, ClipboardList, RefreshCw, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ActionButton } from "@/components/admin/ActionButton";
import { TrendChart } from "@/components/dashboard/trend-chart";

export default async function AdminPage() {
  const [orgCount, teamCount, userCount, surveyCount, alertCount, trendScores] = await Promise.all([
    prisma.organization.count(),
    prisma.team.count(),
    prisma.user.count(),
    prisma.survey.count(),
    prisma.smartAlert.count({ where: { isActive: true } }),
    prisma.wellbeingScore.findMany({
      orderBy: { period: "asc" },
      take: 16,
      include: { team: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { icon: Building2, label: "Organización", value: String(orgCount) },
    { icon: Users, label: "Equipos", value: String(teamCount) },
    { icon: Users, label: "Usuarios", value: String(userCount) },
    { icon: ClipboardList, label: "Encuestas", value: String(surveyCount) },
    { icon: AlertTriangle, label: "Alertas activas", value: String(alertCount) },
  ];

  // Build OWI trend data
  const periods = [...new Set(trendScores.map((s) => s.period!))].sort();
  const trendData = periods.map((period) => {
    const point: { period: string;[key: string]: string | number } = { period };
    for (const s of trendScores.filter((s) => s.period === period)) {
      point[s.team.name] = s.owi;
    }
    return point;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
        <p className="mt-1 text-sm text-slate-400">
          Gestioná tu organización, equipos, usuarios y encuestas.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-slate-950/50"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
              <stat.icon className="size-4 text-cyan-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Regenerate Seed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <RefreshCw className="size-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Regenerar datos demo</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Restablecé la base de datos con datos de demostración. Esto elimina todos los datos actuales.
          </p>
          <div className="mt-4 flex gap-3">
            <ActionButton action="/api/demo/seed" label="Regenerar seed" />
            <ActionButton action="/api/demo/reset" label="Reset completo" />
          </div>
        </div>

        {/* Regenerate Alerts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Regenerar alertas</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Recalculá alertas y recomendaciones desde las métricas actuales de los equipos.
          </p>
          <div className="mt-4">
            <ActionButton action="/api/alerts/regenerate" label="Regenerar ahora" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <Users className="size-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Accesos rápidos</h3>
          </div>
          <div className="mt-3 space-y-2">
            <Link
              href="/admin/teams"
              className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 hover:border-slate-600 transition-colors"
            >
              Gestionar equipos <ArrowRight className="size-3 text-slate-500" />
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 hover:border-slate-600 transition-colors"
            >
              Gestionar usuarios <ArrowRight className="size-3 text-slate-500" />
            </Link>
            <Link
              href="/admin/surveys"
              className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 hover:border-slate-600 transition-colors"
            >
              Gestionar encuestas <ArrowRight className="size-3 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* OWI Trend Chart */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Tendencia de OWI</h2>
        <TrendChart data={trendData} />
      </section>

      {/* Info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
        <p className="text-xs text-slate-600">
          Panel de administración — PulseWell v0.1.0. Las acciones de regeneración afectan a todos los datos.
        </p>
      </div>
    </div>
  );
}
