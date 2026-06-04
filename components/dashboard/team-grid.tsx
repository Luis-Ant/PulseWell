"use client";

import { useState } from "react";
import { Lock, TrendingUp, BarChart3 } from "lucide-react";
import type { TeamMetrics } from "@/lib/types";
import { RiskBadge } from "./risk-badge";
import { cn } from "@/lib/utils";

interface TeamGridProps {
  teams: TeamMetrics[];
}

function getOwiLabel(owi: number): string {
  if (owi >= 70) return "Saludable";
  if (owi >= 50) return "Atención";
  if (owi >= 30) return "Riesgo";
  return "Crítico";
}

export function TeamGrid({ teams }: TeamGridProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  if (teams.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
        <p className="text-sm text-slate-500">No hay equipos disponibles</p>
      </div>
    );
  }

  const selectedTeam = teams.find((t) => t.teamId === selectedTeamId) ?? null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {teams.map((team) => {
          const isSelected = selectedTeamId === team.teamId;

          if (team.insufficientData) {
            return (
              <article
                key={team.teamId}
                className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-5 opacity-60"
              >
                <p className="text-sm font-semibold text-slate-300">{team.teamName}</p>
                <div className="mt-6 flex flex-col items-center gap-2 pb-2 text-center">
                  <Lock className="size-5 text-slate-500" />
                  <p className="text-xs leading-relaxed text-slate-500">
                    Datos insuficientes para mostrar métricas de equipo
                  </p>
                </div>
              </article>
            );
          }

          return (
            <article
              key={team.teamId}
              onClick={() =>
                setSelectedTeamId(isSelected ? null : team.teamId)
              }
              className={cn(
                "cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/50 transition",
                "hover:border-slate-600 hover:bg-slate-800/80",
                isSelected && "border-cyan-400 bg-slate-800 ring-1 ring-cyan-400/30",
              )}
            >
              <p
                className={cn(
                  "text-sm font-semibold",
                  isSelected ? "text-cyan-300" : "text-slate-300",
                )}
              >
                {team.teamName}
              </p>

              <p className="mt-3 text-4xl font-bold text-white">{team.owi}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <RiskBadge level={team.burnoutRisk} label="Burnout" />
                <RiskBadge level={team.attritionRisk} label="Rotación" />
                <RiskBadge level={team.productivityHealth} label="Productividad" />
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {team.responseCount} respuestas
                </span>
                <span className="text-[11px] text-slate-500">{team.period}</span>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Selected team details popover ────────────────────────── */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          selectedTeam ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          {selectedTeam && !selectedTeam.insufficientData && (
            <div className="rounded-2xl border border-cyan-800/30 bg-slate-900 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-cyan-300">{selectedTeam.teamName}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    OWI: <span className="font-bold text-white">{selectedTeam.owi}</span> — {getOwiLabel(selectedTeam.owi)}
                    {" · "}
                    {selectedTeam.responseCount} respuestas en {selectedTeam.period}
                  </p>
                </div>
                <div className="flex shrink-0 gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="size-3" /> OWI {selectedTeam.owi}/100
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="size-3" /> {selectedTeam.period}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">Burnout:</span>
                  <RiskBadge level={selectedTeam.burnoutRisk} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">Rotación:</span>
                  <RiskBadge level={selectedTeam.attritionRisk} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">Productividad:</span>
                  <RiskBadge level={selectedTeam.productivityHealth} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
