import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import {
  getCurrentPeriod,
  validateSurveyResponse,
} from "@/lib/survey-utils";

/**
 * POST /api/responses
 *
 * Accepts a survey response with five 1–5 Likert-scale scores.
 * Validates input, checks for active survey, prevents duplicate
 * submissions for the same period, and persists the result.
 *
 * Response:
 *   201 — { success: true, data: { id, period, message } }
 *   400 — { success: false, error: { code: "VALIDATION_ERROR" | "NO_ACTIVE_SURVEY" | "NO_TEAM", message } }
 *   401 — { success: false, error: { code: "UNAUTHORIZED", message } }
 *   403 — { success: false, error: { code: "FORBIDDEN", message } }
 *   409 — { success: false, error: { code: "DUPLICATE", message } }
 */
export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "No active session." } },
      { status: 401 },
    );
  }

  if (user.role !== "EMPLOYEE") {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Solo empleados pueden responder encuestas." } },
      { status: 403 },
    );
  }

  if (!user.teamId) {
    return NextResponse.json(
      { success: false, error: { code: "NO_TEAM", message: "El empleado debe pertenecer a un equipo para responder." } },
      { status: 400 },
    );
  }

  // ── Parse and validate body ──────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Cuerpo de solicitud inválido." } },
      { status: 400 },
    );
  }

  const validation = validateSurveyResponse(body);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: validation.errors[0]!.message } },
      { status: 400 },
    );
  }

  // ── Check active survey ──────────────────────────────────────────
  const period = getCurrentPeriod();

  const activeSurvey = await prisma.survey.findFirst({
    where: { organizationId: user.organizationId, isActive: true },
  });

  if (!activeSurvey) {
    return NextResponse.json(
      { success: false, error: { code: "NO_ACTIVE_SURVEY", message: "No hay encuesta activa en este momento." } },
      { status: 400 },
    );
  }

  // ── Prevent duplicate ────────────────────────────────────────────
  const existing = await prisma.surveyResult.findUnique({
    where: { userId_period: { userId: user.id, period } },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, error: { code: "DUPLICATE", message: "Ya respondiste esta encuesta." } },
      { status: 409 },
    );
  }

  // ── Persist ──────────────────────────────────────────────────────
  const result = await prisma.surveyResult.create({
    data: {
      userId: user.id,
      teamId: user.teamId,
      period,
      energy: validation.data.energy,
      belonging: validation.data.belonging,
      clarity: validation.data.clarity,
      stress: validation.data.stress,
      workload: validation.data.workload,
      surveyId: activeSurvey.id,
    },
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        id: result.id,
        period,
        message: "Tu respuesta fue registrada. ¡Gracias por participar!",
      },
    },
    { status: 201 },
  );
}
