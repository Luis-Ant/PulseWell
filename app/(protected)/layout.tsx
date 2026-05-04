import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/server";
import type { ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

/**
 * Auth guard layout — wraps all protected routes.
 * Redirects to /auth/login if no authenticated session exists.
 *
 * Full nav bar with user info and logout button will be added in PR3.
 */
export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main>{children}</main>
    </div>
  );
}
