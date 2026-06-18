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

  // ── Avatar URL ──────────────────────────────────────────────────
  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=1e293b&textColor=94a3b8`;

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
