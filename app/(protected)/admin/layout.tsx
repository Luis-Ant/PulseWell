import { getUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") redirect("/auth/login");

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AdminSidebar userName={user.name} userRole={user.role} />
      {/* Main content offset by sidebar width */}
      <div className="flex-1 lg:pl-64">
        {children}
      </div>
    </div>
  );
}
