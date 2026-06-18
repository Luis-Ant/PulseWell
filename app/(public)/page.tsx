import Link from "next/link";
import { Activity, Brain, ShieldCheck, TrendingUp, ClipboardList, Banknote } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { Button } from "@/components/ui/button";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
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
              <h1 className="font-heading max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
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
                <span className="font-sans text-7xl font-bold leading-none text-white">
                  {summary.owi}
                </span>
                <span className="font-sans pb-1 text-lg font-medium tracking-wide text-emerald-300">
                  / 100
                </span>
              </div>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-slate-800 to-transparent" />
              <p className="font-light mt-4 text-sm leading-relaxed text-slate-500">
                Indicador compuesto de bienestar organizacional. Se actualiza semanalmente con datos agregados de las encuestas.
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild className="font-brand text-sm tracking-wide">
              <Link href="/auth/login">Ver dashboard demo</Link>
            </Button>
            <Button variant="secondary" asChild className="font-light text-sm">
              <Link href="#features">Conocer más</Link>
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
            value={
              summary.burnoutRisk === "LOW"
                ? "Bajo"
                : summary.burnoutRisk === "MEDIUM"
                  ? "Medio"
                  : summary.burnoutRisk === "HIGH"
                    ? "Alto"
                    : "Crítico"
            }
            status={summary.burnoutRisk}
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
        <div id="features" className="grid gap-4 scroll-mt-20 lg:grid-cols-3">
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

      {/* ─── Why PulseWell Section ──────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-cyan-300">
            Diferenciación
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            ¿Por qué PulseWell?
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Encuestas tradicionales",
              description: "Datos sin procesar. Respuestas individuales visibles. Sin análisis automático. Requieren interpretación manual.",
              icon: <ClipboardList className="size-6 text-slate-400" />,
              vs: "vs",
            },
            {
              title: "PulseWell",
              description: "Análisis agregado automático. Privacidad por diseño. Alertas tempranas con recomendaciones accionables. Sin exponer datos individuales.",
              icon: <Brain className="size-6 text-cyan-400" />,
              highlight: true,
            },
            {
              title: "Consultoría tradicional",
              description: "Cara, esporádica, basada en muestras. Resultados en semanas, no en tiempo real. Sin seguimiento continuo.",
              icon: <Banknote className="size-6 text-slate-400" />,
              vs: "vs",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border p-6 ${
                item.highlight
                  ? "border-cyan-800/40 bg-gradient-to-b from-cyan-950/30 to-slate-900 ring-1 ring-cyan-400/20"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800/30 transition-all cursor-default"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <h3 className={`text-sm font-bold ${item.highlight ? "text-cyan-300" : "text-slate-300"}`}>
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>
              {item.vs && (
                <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{item.vs}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Roadmap ─────────────────────────────────────── */}
      <RoadmapSection />

      {/* ─── Pilot CTA ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-cyan-800/30 bg-gradient-to-r from-cyan-950/40 to-slate-900 p-10 text-center">
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            ¿Querés probar PulseWell en tu empresa?
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-slate-400">
            Estamos buscando empresas para nuestro programa de piloto controlado.
            Sin costo durante la fase de validación.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="font-brand text-sm tracking-wide">
              <Link href="/auth/login">Ver demo ahora</Link>
            </Button>
            <p className="text-xs text-slate-600">
              Piloto Q3 2026 · Cupos limitados · Sin compromiso
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between">
            <div>
              <p className="text-xs text-slate-600">
                PulseWell MVP — Organizational Wellbeing Intelligence
              </p>
              <p className="mt-1 text-xs text-slate-700">
                Ambiente demo. Datos simulados. No constituye diagnóstico clínico.
              </p>
            </div>
            <div className="flex gap-6">
              <Link
                href="/auth/login"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Iniciar sesión
              </Link>
              <span className="text-xs text-slate-700">v0.1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
