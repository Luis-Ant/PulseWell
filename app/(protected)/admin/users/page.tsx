import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserTable } from "@/components/admin/UserTable";
import { Shield } from "lucide-react";

export default async function AdminUsersPage() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Shield className="size-12 text-slate-600" />
        <h1 className="mt-6 text-2xl font-bold text-white">Acceso denegado</h1>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    include: { team: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const userData = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    teamId: u.teamId,
    teamName: u.team?.name ?? null,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <UserTable users={userData} />
    </div>
  );
}
