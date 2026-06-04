import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentPeriod, getRecentPeriods, SURVEY_QUESTIONS, calculateStreak } from "@/lib/survey-utils";
import { SurveyPageClient } from "./SurveyPageClient";
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

  const [activeSurvey, existingResponse, allResponses] = await Promise.all([
    prisma.survey.findFirst({
      where: { organizationId: user.organizationId, isActive: true },
    }),
    prisma.surveyResult.findUnique({
      where: { userId_period: { userId: user.id, period } },
    }),
    prisma.surveyResult.findMany({
      where: { userId: user.id },
      select: { period: true },
      distinct: ["period"],
      orderBy: { period: "desc" },
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

  const alreadySubmitted = !!existingResponse;

  // ── History ──────────────────────────────────────────────────────
  const historyPeriods = getRecentPeriods(4);
  const allUserPeriods = new Set(allResponses.map((r) => r.period!));
  const history = historyPeriods.map((p) => ({
    period: p,
    responded: allUserPeriods.has(p),
  }));

  // ── Streak ───────────────────────────────────────────────────────
  const userPeriods = allResponses.map((r) => r.period!).filter(Boolean);
  const streak = calculateStreak(userPeriods);

  // ── Total responses ──────────────────────────────────────────────
  const totalResponses = allResponses.length;

  // ── Team participation ───────────────────────────────────────────
  let teamParticipation: number | null = null;
  if (user.teamId) {
    const teamMemberCount = await prisma.user.count({
      where: { teamId: user.teamId },
    });
    if (teamMemberCount >= 5) {
      const teamResponded = await prisma.surveyResult.findMany({
        where: { teamId: user.teamId, period },
        select: { userId: true },
        distinct: ["userId"],
      });
      teamParticipation = Math.round((teamResponded.length / teamMemberCount) * 100);
    }
  }

  // ── Render dashboard ─────────────────────────────────────────────
  return (
    <SurveyPageClient
      surveyName={activeSurvey.name}
      questions={SURVEY_QUESTIONS}
      period={period}
      alreadySubmitted={alreadySubmitted}
      history={history}
      streak={streak}
      totalResponses={totalResponses}
      teamParticipation={teamParticipation}
    />
  );
}