import type { AuthUser } from "./types";
import type { UserRole } from "@/lib/types";

/**
 * Require that the authenticated user has one of the specified roles.
 * Throws a 403 Forbidden response if the user's role is not in the
 * allowed list.
 *
 * Role values are checked against the Prisma UserRole enum (UPPERCASE).
 */
export function requireRole(user: AuthUser, roles: UserRole[]): void {
  if (!roles.includes(user.role)) {
    throw createForbiddenError("Insufficient permissions for this resource.");
  }
}

/**
 * Require that a MANAGER role user has access to the specified team.
 *
 * NON-MANAGER roles (ADMIN, HR_ANALYST) are NOT restricted by teamId —
 * they have cross-team access. EMPLOYEE role cannot pass this check.
 *
 * The teamId MUST come from the database (user.teamId), never from
 * client-supplied input.
 */
export function requireTeamAccess(user: AuthUser, teamId: string): void {
  // HR and ADMIN have cross-team access
  if (user.role === "ADMIN" || user.role === "HR_ANALYST") return;

  // EMPLOYEE cannot access team resources directly
  if (user.role === "EMPLOYEE" || !user.teamId || user.teamId !== teamId) {
    throw createForbiddenError(
      "You do not have access to this team's resources.",
    );
  }
}

/**
 * Validate that a session user exists and return a forbidden response if not.
 * Use this as a gate in route handlers before any data access.
 */
export function createForbiddenError(message: string) {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status: 403, headers: { "Content-Type": "application/json" } },
  );
}
