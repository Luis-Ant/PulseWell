import Link from "next/link";
import { Activity, Brain, ShieldCheck, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth/server";
import { getDemoWellbeingSummary } from "@/lib/mock-data";

function getDashboardPath(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "HR_ANALYST":
      return "/hr";
    case "MANAGER":
      return "/manager";
    default:
      return "/survey";
  }
}

export default async function HomePage() {
  const summary = getDemoWellbeingSummary();
  const user = await getUser();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Auth-aware header bar */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-white"
          >
            PulseWell
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">{user.name}</span>
              <Button
                variant="secondary"
                asChild
                className="px-3 py-1.5 text-xs"
              >
                <Link href={getDashboardPath(user.role)}>Dashboard</Link>
              </Button>
            </div>
          ) : (
            <Button asChild className="px-3 py-1.5 text-xs">
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:py-20">
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
            <Brain className="size-4 text-cyan-300" />
            Organizational Wellbeing Intelligence Platform
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="flex flex-col gap-5">
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white md:text-6xl">
                Converte señales de bienestar en decisiones inteligentes.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                PulseWell ayuda a Recursos Humanos y líderes de equipo a detectar
                riesgos de burnout, baja energía y desconexión antes de que escalen.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/40">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
                Organizational Wellbeing Index
              </p>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-6xl font-bold text-white">{summary.owi}</span>
                <span className="pb-2 text-sm text-emerald-300">/ 100</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Score sintético del MVP para validar tendencias y alertas preventivas.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>Ver dashboard demo</Button>
            <Button variant="secondary">Revisar alcance MVP</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Activity} label="Energía" value={`${summary.energy}/5`} />
          <MetricCard icon={ShieldCheck} label="Riesgo burnout" value={summary.burnoutRisk} />
          <MetricCard icon={TrendingUp} label="Tendencia" value={summary.trend} />
          <MetricCard icon={Brain} label="Equipos analizados" value={`${summary.teams}`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard
            title="Analítica agregada"
            description="Visualizá el estado de bienestar por equipo sin exponer datos individuales sensibles."
          />
          <SectionCard
            title="Alertas tempranas"
            description="Identificá estrés alto, carga excesiva y caída de energía antes de que afecten al negocio."
          />
          <SectionCard
            title="Recomendaciones"
            description="Recibí acciones preventivas para managers a partir del estado actual del equipo."
          />
        </div>
      </section>
    </main>
  );
}
