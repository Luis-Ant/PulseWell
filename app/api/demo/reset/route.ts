import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { requireRole } from "@/lib/auth/rbac";
import { runSeed } from "@/scripts/seed";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/demo/reset
 *
 * Deletes all demo data and re-seeds from scratch.
 * Requires ADMIN role.
 *
 * Deletion order respects FK dependencies (children first):
 *   Recommendations → SmartAlerts → SurveyResults → WellbeingScores
 *   → Users (demo) → Teams → Surveys → Organization
 *
 * Response:
 *   200 — { success: true, data: { deletedCount, ...SeedResult, message: "Reset completado" } }
 *   401 — No session
 *   403 — Non-ADMIN role
 *   500 — Reset failed
 */
export async function POST() {
  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "No active session." },
      },
      { status: 401 },
    );
  }

  try {
    requireRole(authUser, ["ADMIN"]);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "FORBIDDEN", message: "Admin access required." },
      },
      { status: 403 },
    );
  }

  try {
    // Delete in reverse-dependency order to avoid FK violations.
    const deleteRecs = await prisma.recommendation.deleteMany();
    const deleteAlerts = await prisma.smartAlert.deleteMany();
    const deleteResults = await prisma.surveyResult.deleteMany();
    const deleteWellbeing = await prisma.wellbeingScore.deleteMany();
    const deleteUsers = await prisma.user.deleteMany({
      where: { supabaseUid: { not: null } },
    });
    const deleteTeams = await prisma.team.deleteMany();
    const deleteSurveys = await prisma.survey.deleteMany();
    const deleteOrgs = await prisma.organization.deleteMany();

    const deletedCount =
      deleteUsers.count +
      deleteTeams.count +
      deleteResults.count +
      deleteWellbeing.count +
      deleteAlerts.count +
      deleteRecs.count +
      deleteSurveys.count +
      deleteOrgs.count;

    // Re-seed fresh data
    const seedResult = await runSeed();

    return NextResponse.json({
      success: true,
      data: {
        deletedCount,
        ...seedResult,
        message: "Reset completado",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RESET_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
