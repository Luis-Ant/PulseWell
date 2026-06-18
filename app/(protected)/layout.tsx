import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getCurrentPeriod } from "@/lib/survey-utils";
import { UserMenu } from "@/components/layout/UserMenu";
import type { ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

function roleLabel(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "HR_ANALYST":
      return "RRHH";
    case "MANAGER":
      return "Manager";
    case "EMPLOYEE":
      return "Empleado";
    default:
      return role;
  }
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // ── Pending survey notification ───────────────────────────────────
  let hasPendingSurvey = false;
  if (user.role === "EMPLOYEE") {
    const period = getCurrentPeriod();
    const existingResponse = await prisma.surveyResult.findUnique({
      where: { userId_period: { userId: user.id, period } },
    });
    hasPendingSurvey = !existingResponse;
  }

  // ── Avatar SVG (inline) ─────────────────────────────────────────
  // Generate initials inline — no external API calls, no flash on hydration,
  // no rate limits or CSP issues.
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const avatarUrl =
    `data:image/svg+xml,` +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="50" fill="#1e293b"/>
        <text x="50" y="50" dominant-baseline="central" text-anchor="middle"
              font-family="Arial,sans-serif" font-size="44" font-weight="600"
              fill="#94a3b8">${initials}</text>
      </svg>`,
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top nav bar */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg uppercase tracking-[0.15em] text-white">
              PULSEWELL
            </span>
            <span className="font-ui hidden rounded-full border border-slate-700 px-2.5 py-0.5 text-xs tracking-[0.12em] uppercase text-slate-500 sm:inline">
              {roleLabel(user.role)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <UserMenu
              userName={user.name}
              userRole={user.role}
              hasPendingSurvey={hasPendingSurvey}
              userImage={avatarUrl}
            />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
