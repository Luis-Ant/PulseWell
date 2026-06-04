import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/server";

/**
 * POST /api/auth/signout
 *
 * Destroys the current Supabase session server-side.
 * Used by the UserMenu component for client-side logout.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SIGNOUT_ERROR", message: "Error al cerrar sesión." } },
      { status: 500 },
    );
  }
}
