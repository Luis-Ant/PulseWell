import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

/**
 * Create a Supabase client for use inside Next.js middleware.
 *
 * Reads cookies from the incoming request and writes refreshed tokens
 * back to the response via NextResponse.cookies.set().
 *
 * IMPORTANT: Do NOT call supabase.auth.getUser() between creating this
 * client and the actual getUser() call. A simple mistake here can cause
 * random user logouts.
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse,
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
}
