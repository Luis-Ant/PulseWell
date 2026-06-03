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
      {/* ─── Header ──────────────────────────────────────── */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="font-display text-xl uppercase tracking-[0.15em] text-white"
          >
            PULSEWELL
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-ui text-sm tracking-wide text-slate-400">
                {user.name}
              </span>
              <Button
                variant="secondary"
                asChild
                className="font-ui px-3 py-1.5 text-xs tracking-wide"
              >
                <Link href={getDashboardPath(user.role)}>Dashboard</Link>
              </Button>
            </div>
          ) : (
            <Button asChild className="font-ui px-3 py-1.5 text-xs tracking-wide">
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:py-20">
        <div className="flex flex-col gap-8">
          {/* Section kicker — Ailerons all caps */}
          <p className="font-display text-xs uppercase tracking-[0.3em] text-cyan-300">
            Organizational Wellbeing Intelligence
          </p>

          {/* Hero headline + OWI card */}
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="flex flex-col gap-6">
              <h1 className="font-heading max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
                Convertí señales
                <br />
                de bienestar en
                <br />
                decisiones inteligentes.
              </h1>
              <p className="font-light max-w-2xl text-lg leading-8 text-slate-400">
                PulseWell ayuda a Recursos Humanos y líderes de equipo a detectar
                riesgos de burnout, baja energía y desconexión antes de que escalen.
              </p>
            </div>

            {/* OWI Score Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/40 lg:mt-4">
              <p className="font-ui text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                índice OWI
              </p>
              <div className="mt-4 flex items-end gap-3">
                <span className="font-heading text-7xl font-bold leading-none text-white">
                  {summary.owi}
                </span>
                <span className="font-subheading pb-1 text-lg tracking-wide text-emerald-300">
                  / 100
                </span>
              </div>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-slate-800 to-transparent" />
              <p className="font-light mt-4 text-sm leading-relaxed text-slate-500">
                Score sintético del MVP para validar tendencias y alertas
                preventivas.
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button className="font-brand text-sm tracking-wide">
              Ver dashboard demo
            </Button>
            <Button variant="secondary" className="font-light text-sm">
              Revisar alcance MVP
            </Button>
          </div>
        </div>

        {/* ─── Metrics Grid ──────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Activity}
            label="Energía"
            value={`${summary.energy}/5`}
          />
          <MetricCard
            icon={ShieldCheck}
            label="Riesgo burnout"
            value={summary.burnoutRisk}
          />
          <MetricCard
            icon={TrendingUp}
            label="Tendencia"
            value={summary.trend}
          />
          <MetricCard
            icon={Brain}
            label="Equipos"
            value={`${summary.teams}`}
          />
        </div>

        {/* ─── Feature Cards ─────────────────────────────── */}
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
