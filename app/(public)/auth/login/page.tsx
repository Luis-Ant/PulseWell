import Link from "next/link";
import { ArrowLeft, Activity, TrendingUp, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PrivacyBanner } from "@/components/shared/PrivacyBanner";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-slate-950">
      {/* ─── Left Panel — Branding ──────────────────────────── */}
      <div className="relative hidden w-5/12 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-950 to-blue-950 p-10 lg:flex">

        {/* Right-edge blur transition */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-10" />
        {/* Back link */}
        <Link
          href="/"
          className="relative inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>

        {/* Brand content */}
        <div className="relative flex-1 flex flex-col justify-center">
          <div className="space-y-8">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-cyan-300">
                Organizational Wellbeing Intelligence
              </p>
              <h1 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-white">
                PulseWell
              </h1>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-slate-400">
                Convertí señales de bienestar en decisiones inteligentes para tu equipo.
              </p>
            </div>

            {/* Feature pills */}
            <div className="space-y-3">
              {[
                { icon: TrendingUp, text: "Métricas agregadas por equipo" },
                { icon: Activity, text: "Alertas tempranas de riesgo" },
                { icon: ShieldCheck, text: "Privacidad por diseño" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-slate-800/50">
                    <item.icon className="size-4 text-cyan-400" />
                  </div>
                  <span className="text-sm text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-slate-600">
          MVP · Datos simulados · No constituye diagnóstico clínico
        </p>
      </div>

      {/* ─── Right Panel — Login Form ───────────────────────── */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-7/12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile-only header */}
          <div className="text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6">
              <ArrowLeft className="size-4" />
              Volver al inicio
            </Link>
            <h1 className="font-display text-2xl uppercase tracking-[0.15em] text-white">
              PULSEWELL
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Iniciá sesión para acceder al panel
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm">
            <h2 className="mb-6 text-xl font-bold text-white">Iniciar sesión</h2>
            <LoginForm />
          </div>

          <PrivacyBanner />
        </div>
      </div>
    </main>
  );
}
