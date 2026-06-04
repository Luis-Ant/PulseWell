import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TeamTable } from "@/components/admin/TeamTable";
import { Shield } from "lucide-react";

export default async function AdminTeamsPage() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Shield className="size-12 text-slate-600" />
        <h1 className="mt-6 text-2xl font-bold text-white">Acceso denegado</h1>
      </div>
    );
  }

  const teams = await prisma.team.findMany({
    include: {
      _count: { select: { users: true, surveyResults: true } },
      wellbeingScore: { orderBy: { period: "desc" }, take: 1, select: { owi: true } },
    },
  });

  const teamData = teams.map((t) => ({
    id: t.id,
    name: t.name,
    userCount: t._count.users,
    responseCount: t._count.surveyResults,
    latestOwi: t.wellbeingScore[0]?.owi ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <TeamTable teams={teamData} />
    </div>
  );
}
