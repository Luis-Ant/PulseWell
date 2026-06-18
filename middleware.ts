import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/auth/middleware";

const PUBLIC_PATHS = new Set(["/", "/auth/login"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and Next.js internals are handled by the matcher config
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Allow public assets under /auth/login (e.g. favicon, images)
  if (pathname.startsWith("/auth/login")) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });

  const supabase = createMiddlewareClient(request, response);

  // IMPORTANT: Do NOT insert any logic between createMiddlewareClient and
  // supabase.auth.getUser(). A simple mistake could cause random user logouts.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Preserve the original path so we can redirect back after login
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as-is
  // (it carries the refreshed session cookies).
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|otf|woff|woff2|eot)$).*)",
  ],
};
