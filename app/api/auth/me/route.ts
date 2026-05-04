import { NextResponse } from "next/server";
import { getSession, getUser } from "@/lib/auth/server";

/**
 * GET /api/auth/me
 *
 * Returns the current authenticated user's profile.
 * Session is validated server-side via Supabase's getUser().
 * The response NEVER exposes sensitive fields (supabaseUid).
 *
 * Response:
 *   200 — { success: true, data: { id, email, name, role, organizationId, teamId } }
 *   401 — { success: false, error: { code: "UNAUTHORIZED", message: "No active session." } }
 */
export async function GET() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "No active session." },
      },
      { status: 401 },
    );
  }

  const authUser = await getUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "Authenticated user not found in PulseWell database.",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: authUser.id,
      email: authUser.email,
      name: authUser.name,
      role: authUser.role,
      organizationId: authUser.organizationId,
      teamId: authUser.teamId,
    },
  });
}
