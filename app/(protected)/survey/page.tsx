import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentPeriod, SURVEY_QUESTIONS } from "@/lib/survey-utils";
import { SurveyPageClient } from "./SurveyPageClient";
import { ConfirmationView } from "@/components/survey/ConfirmationView";
import { AlertTriangle, Shield } from "lucide-react";

// ── Page (Server Component) ────────────────────────────────────────────
export default async function SurveyPage() {
  const user = await getUser();

  // ── Unauthorized ─────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <Shield className="size-12 text-slate-600" />
        <h1 className="mt-6 text-2xl font-bold text-white">
          Iniciá sesión
        </h1>
        <p className="mt-2 text-slate-400">
          Necesitás iniciar sesión para acceder a la encuesta.
        </p>
      </div>
    );
  }

  // ── Role guard ───────────────────────────────────────────────────
  if (user.role !== "EMPLOYEE") {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <Shield className="size-12 text-slate-600" />
        <h1 className="mt-6 text-2xl font-bold text-white">
          Acceso denegado
        </h1>
        <p className="mt-2 text-slate-400">
          Solo empleados pueden responder la encuesta semanal.
        </p>
      </div>
    );
  }

  // ── TeamId guard ─────────────────────────────────────────────────
  if (!user.teamId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <AlertTriangle className="size-12 text-yellow-400" />
        <h1 className="mt-6 text-2xl font-bold text-white">
          Sin equipo asignado
        </h1>
        <p className="mt-2 text-slate-400">
          No estás asignado a ningún equipo. Contactá a tu administrador.
        </p>
      </div>
    );
  }

  // ── Fetch data ───────────────────────────────────────────────────
  const period = getCurrentPeriod();

  const [activeSurvey, existingResponse] = await Promise.all([
    prisma.survey.findFirst({
      where: { organizationId: user.organizationId, isActive: true },
    }),
    prisma.surveyResult.findUnique({
      where: { userId_period: { userId: user.id, period } },
    }),
  ]);

  // ── No active survey ─────────────────────────────────────────────
  if (!activeSurvey) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <AlertTriangle className="size-12 text-yellow-400" />
        <h1 className="mt-6 text-2xl font-bold text-white">
          No hay encuesta activa
        </h1>
        <p className="mt-2 text-slate-400">
          No hay encuestas disponibles en este momento. Volvé más tarde.
        </p>
      </div>
    );
  }

  // ── Already submitted → confirmation ─────────────────────────────
  if (existingResponse) {
    return <ConfirmationView period={period} />;
  }

  // ── Render form ──────────────────────────────────────────────────
  return (
    <SurveyPageClient
      surveyName={activeSurvey.name}
      questions={SURVEY_QUESTIONS}
      period={period}
      alreadySubmitted={false}
    />
  );
}
