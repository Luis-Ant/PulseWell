import { MetricCard } from "@/components/dashboard/metric-card";
import { SectionCard } from "@/components/dashboard/section-card";
import { getDemoWellbeingSummary } from "@/lib/mock-data";
import { Activity, ShieldAlert, Users } from "lucide-react";

export default function DashboardPage() {
  const summary = getDemoWellbeingSummary();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-300">
            Dashboard MVP
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">PulseWell Analytics</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Vista inicial para validar métricas de bienestar, alertas y recomendaciones.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard icon={Activity} label="OWI" value={`${summary.owi}/100`} />
          <MetricCard icon={ShieldAlert} label="Riesgo" value={summary.burnoutRisk} />
          <MetricCard icon={Users} label="Equipos" value={`${summary.teams}`} />
        </div>

        <SectionCard
          title="Siguiente paso"
          description="Conectar esta vista con Prisma, Supabase y gráficos Recharts cuando existan datos persistidos."
        />
      </section>
    </main>
  );
}
