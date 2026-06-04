import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/AdminNav";
import { SurveyManager } from "@/components/admin/SurveyManager";
import { AutoRefresh } from "@/components/shared/AutoRefresh";
import { Shield } from "lucide-react";

export default async function AdminSurveysPage() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Shield className="size-12 text-slate-600" />
        <h1 className="mt-6 text-2xl font-bold text-white">Acceso denegado</h1>
      </div>
    );
  }

  const surveys = await prisma.survey.findMany({
    include: { _count: { select: { responses: true } } },
    orderBy: { createdAt: "desc" },
  });

  const surveyData = surveys.map((s) => ({
    id: s.id,
    name: s.name,
    isActive: s.isActive,
    frequency: s.frequency,
    responseCount: s._count.responses,
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <AutoRefresh />
      <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
      <AdminNav />
      <SurveyManager surveys={surveyData} />
    </div>
  );
}
