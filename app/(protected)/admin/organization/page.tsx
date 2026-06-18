import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Building2, Users, Calendar } from "lucide-react";

export default async function OrganizationPage() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-2xl font-bold text-white">Acceso denegado</h1>
      </div>
    );
  }

  const org = await prisma.organization.findFirst({
    include: { _count: { select: { users: true, teams: true, surveys: true } } },
  });

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-2xl font-bold text-white">Sin organización</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Organización</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configuración y detalles de tu organización.
        </p>
      </div>

      {/* Org info card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-cyan-400/10">
            <Building2 className="size-7 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{org.name}</h2>
            <p className="text-xs text-slate-500">
              Creada el {new Date(org.createdAt).toLocaleDateString("es-MX")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Miembros", value: org._count.users },
          { icon: Users, label: "Equipos", value: org._count.teams },
          { icon: Calendar, label: "Encuestas", value: org._count.surveys },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center"
          >
            <stat.icon className="mx-auto size-5 text-slate-500" />
            <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-center">
        <p className="text-sm text-slate-500">
          La edición de configuración estará disponible en la próxima versión.
        </p>
      </div>
    </div>
  );
}
