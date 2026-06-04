import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { getCurrentPeriod } from "@/lib/survey-utils";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import type { ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

function roleLabel(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "HR_ANALYST":
      return "HR Analyst";
    case "MANAGER":
      return "Manager";
    case "EMPLOYEE":
      return "Employee";
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top nav bar */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="font-brand text-lg font-bold tracking-tight text-white">
              PulseWell
            </span>
            <span className="font-ui hidden rounded-full border border-slate-700 px-2.5 py-0.5 text-xs tracking-[0.12em] uppercase text-slate-500 sm:inline">
              {roleLabel(user.role)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {hasPendingSurvey && (
              <div className="relative">
                <Bell className="size-5 text-cyan-400" />
                <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-red-500 ring-2 ring-slate-950" />
              </div>
            )}
            <span className="text-sm text-slate-400">{user.name}</span>
            <form action={signOut}>
              <Button
                type="submit"
                variant="secondary"
                className="px-3 py-1.5 text-xs"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Cerrar sesión
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
