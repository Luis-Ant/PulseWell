import type { UserRole } from "@/lib/types";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  teamId: string | null;
  supabaseUid: string | null;
}

export interface SessionUser {
  id: string;
  email: string;
}
