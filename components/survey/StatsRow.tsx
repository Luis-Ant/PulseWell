import { CheckCircle2, Flame, Users } from "lucide-react";

interface StatsRowProps {
  totalResponses: number;
  streak: number;
  teamParticipation: number | null;
}

export function StatsRow({ totalResponses, streak, teamParticipation }: StatsRowProps) {
  const stats = [
    {
      icon: CheckCircle2,
      label: "Total respondidas",
      value: String(totalResponses),
      color: "text-emerald-400",
    },
    {
      icon: Flame,
      label: "Racha actual",
      value: `${streak} semana${streak !== 1 ? "s" : ""}`,
      color: "text-orange-400",
    },
    {
      icon: Users,
      label: "Participación del equipo",
      value: teamParticipation !== null ? `${teamParticipation}%` : "Privado",
      color: "text-cyan-400",
      title: teamParticipation === null ? "Se requiere un mínimo de 5 miembros para mostrar participación" : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center"
          title={stat.title}
        >
          <stat.icon className={`size-5 ${stat.color}`} />
          <span className="text-lg font-bold text-white">{stat.value}</span>
          <span className="text-[10px] text-slate-500">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}