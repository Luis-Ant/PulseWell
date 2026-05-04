import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { AuthUser } from "./types";

/**
 * Server-side Supabase client — for Server Components, Route Handlers, and
 * Server Actions. Uses cookie store from `next/headers` for session persistence.
 *
 * IMPORTANT: Must be called within an async context (cookies() is async in Next.js 15).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot set cookies directly —
            // middleware handles session refresh.
          }
        },
      },
    },
  );
}

/**
 * Get the current Supabase session from the server-side cookie.
 * Returns null if no valid session exists.
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the internal PulseWell user from the database, resolved via the
 * Supabase session's `user.id` → `User.supabaseUid` lookup.
 *
 * Role and teamId come from the Prisma database (authoritative source),
 * never from Supabase auth metadata or JWT claims.
 */
export async function getUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUid: session.user.id },
  });

  if (!dbUser) return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    teamId: dbUser.teamId,
    supabaseUid: dbUser.supabaseUid,
  };
}
