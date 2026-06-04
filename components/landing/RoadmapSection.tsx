import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

const PHASES = [
  {
    title: "MVP",
    subtitle: "Junio 2026",
    status: "completed",
    description:
      "Prototipo funcional con datos simulados. Dashboards HR y Manager, encuestas pulse, motor analítico, alertas y recomendaciones.",
    features: [
      "Auth con 4 roles",
      "Dashboard HR + Manager",
      "Encuestas pulse",
      "Motor analítico (OWI, riesgos)",
      "Alertas y recomendaciones dinámicas",
      "75 tests unitarios",
    ],
  },
  {
    title: "Piloto Controlado",
    subtitle: "Q3 2026",
    status: "next",
    description:
      "Validación con 1-3 empresas reales. Datos de empleados reales, feedback cualitativo y ajustes de producto.",
    features: [
      "Multi-empresa básico",
      "Encuestas configurables",
      "Panel Admin mejorado",
      "Export CSV",
      "Historial por periodos",
      "Registro de intervenciones",
    ],
  },
  {
    title: "Cumplimiento",
    subtitle: "",
    status: "planned",
    description:
      "Fortalecimiento de confianza y alineación con el mercado mexicano.",
    features: [
      "Módulo NOM-035 (STPS)",
      "Reporte de factores de riesgo",
      "Consentimiento explícito",
      "Auditoría de accesos",
      "Métricas antes/después",
    ],
  },
  {
    title: "Integraciones",
    subtitle: "",
    status: "planned",
    description:
      "Conexión con el ecosistema de trabajo sin comprometer la privacidad.",
    features: [
      "Slack metadata",
      "Microsoft Teams metadata",
      "Calendar workload indicators",
      "Webhooks internos",
      "Import CSV avanzado",
    ],
  },
  {
    title: "SaaS Comercial",
    subtitle: "",
    status: "planned",
    description:
      "Lanzamiento de versión lista para clientes de pago con todas las capacidades empresariales.",
    features: [
      "Multi-tenant robusto",
      "Billing y planes",
      "SSO empresarial",
      "Onboarding guiado",
      "SLA y hardening",
    ],
  },
];

export function RoadmapSection() {
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-cyan-300">
          Roadmap
        </p>
        <h2 className="mt-4 font-heading text-4xl font-bold text-white md:text-5xl">
          Evolución del producto
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-slate-400">
          De prototipo funcional a plataforma SaaS empresarial. Cada fase agrega
          valor sin comprometer la privacidad.
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 md:-translate-x-px" />

        <div className="space-y-12">
          {PHASES.map((phase, i) => {
            const isLeft = i % 2 === 0;
            const isCompleted = phase.status === "completed";
            const isNext = phase.status === "next";

            return (
              <div
                key={phase.title}
                className={`relative flex flex-col md:flex-row ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-8`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 top-0 md:-translate-x-1/2 z-10">
                  {isCompleted ? (
                    <CheckCircle2 className="size-8 text-emerald-400 bg-slate-950 rounded-full" />
                  ) : isNext ? (
                    <div className="size-8 rounded-full border-2 border-cyan-400 bg-slate-950 flex items-center justify-center">
                      <ArrowRight className="size-4 text-cyan-400" />
                    </div>
                  ) : (
                    <Circle className="size-8 text-slate-700 bg-slate-950 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`md:w-1/2 ${isLeft ? "md:pr-16" : "md:pl-16"} pl-16 md:pl-0`}
                >
                  <div
                    className={`rounded-2xl border p-6 ${
                      isCompleted
                        ? "border-emerald-800/40 bg-emerald-950/10"
                        : isNext
                          ? "border-cyan-800/40 bg-cyan-950/10"
                          : "border-slate-800 bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <h3
                        className={`text-lg font-bold ${isCompleted ? "text-emerald-300" : isNext ? "text-cyan-300" : "text-slate-400"}`}
                      >
                        {phase.title}
                      </h3>
                      {phase.subtitle && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            isCompleted
                              ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5"
                              : isNext
                                ? "text-cyan-400 border-cyan-400/20 bg-cyan-400/5"
                                : "text-slate-600 border-slate-600/20 bg-slate-600/5"
                          }`}
                        >
                          {phase.subtitle}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                      {phase.description}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {phase.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-xs text-slate-500"
                        >
                          <span
                            className={`mt-0.5 size-1.5 rounded-full shrink-0 ${isCompleted ? "bg-emerald-500" : isNext ? "bg-cyan-500" : "bg-slate-600"}`}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
