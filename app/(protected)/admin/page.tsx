import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { USER_ROLE } from "@/lib/types";
import { Building2, Users, ClipboardList, RefreshCw, AlertTriangle, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin/AdminNav";
import { AutoRefresh } from "@/components/shared/AutoRefresh";

export default async function AdminPage() {
  const user = await getUser();

  if (!user || user.role !== USER_ROLE.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Shield className="size-12 text-slate-600" />
        <h1 className="mt-6 text-2xl font-bold text-white">Acceso denegado</h1>
        <p className="mt-2 text-slate-400">Este panel es exclusivo para administradores.</p>
      </div>
    );
  }

  const [orgCount, teamCount, userCount, surveyCount, alertCount] = await Promise.all([
    prisma.organization.count(),
    prisma.team.count(),
    prisma.user.count(),
    prisma.survey.count(),
    prisma.smartAlert.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { icon: Building2, label: "Organización", value: String(orgCount) },
    { icon: Users, label: "Equipos", value: String(teamCount) },
    { icon: Users, label: "Usuarios", value: String(userCount) },
    { icon: ClipboardList, label: "Encuestas", value: String(surveyCount) },
    { icon: AlertTriangle, label: "Alertas activas", value: String(alertCount) },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <AutoRefresh />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
        <p className="mt-1 text-sm text-slate-400">
          Gestioná tu organización, equipos, usuarios y encuestas.
        </p>
      </div>

      {/* Admin Nav */}
      <AdminNav />

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
            <form action="/api/demo/seed" method="POST">
              <Button type="submit" variant="secondary" className="text-xs">
                Regenerar seed
              </Button>
            </form>
            <form action="/api/demo/reset" method="POST">
              <Button type="submit" variant="secondary" className="text-xs">
                Reset completo
              </Button>
            </form>
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
            <form action="/api/alerts/regenerate" method="POST">
              <Button type="submit" variant="secondary" className="text-xs">
                Regenerar ahora
              </Button>
            </form>
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

      {/* Info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
        <p className="text-xs text-slate-600">
          Panel de administración — PulseWell v0.1.0. Las acciones de regeneración afectan a todos los datos.
        </p>
      </div>
    </div>
  );
}
