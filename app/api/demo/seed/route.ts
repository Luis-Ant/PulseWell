import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/server";
import { requireRole } from "@/lib/auth/rbac";
import { runSeed } from "@/scripts/seed";

/**
 * POST /api/demo/seed
 *
 * Seeds the database with demo data (org, teams, users, survey results, etc.).
 * Requires ADMIN role.
 *
 * Response:
 *   200 — { success: true, data: { ...SeedResult, message: "Seed completado" } }
 *   401 — No session
 *   403 — Non-ADMIN role
 *   500 — Seed failed
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
    const result = await runSeed();
    return NextResponse.json({
      success: true,
      data: { ...result, message: "Seed completado" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SEED_FAILED",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
