"use client";

import { CheckCircle2, Clock, ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPeriod } from "@/lib/format-utils";

interface StatusCardProps {
  alreadySubmitted: boolean;
  streak: number;
  period: string;
  onStartSurvey: () => void;
  teamMemberCount: number | null;
  teamRespondedCount: number | null;
}

export function StatusCard({ alreadySubmitted, streak, period, onStartSurvey, teamMemberCount, teamRespondedCount }: StatusCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border p-6",
      alreadySubmitted
        ? "border-emerald-800/40 bg-emerald-950/20"
        : "border-cyan-800/40 bg-cyan-950/20"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Esta semana · {formatPeriod(period)}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {alreadySubmitted ? "¡Ya respondiste!" : "Encuesta pendiente"}
          </h2>
          {alreadySubmitted ? (
            <p className="mt-1 text-sm text-emerald-400">
              {streak > 1
                ? `Racha: ${streak} semanas consecutivas 🔥`
                : "¡Primera semana completada!"}
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-400">
              Tus respuestas ayudan a mejorar el equipo.
            </p>
          )}
        </div>
        <div className={cn(
          "flex size-14 items-center justify-center rounded-full",
          alreadySubmitted ? "bg-emerald-400/10" : "bg-cyan-400/10"
        )}>
          {alreadySubmitted ? (
            <CheckCircle2 className="size-8 text-emerald-400" />
          ) : (
            <Clock className="size-8 text-cyan-400" />
          )}
        </div>
      </div>

      {teamMemberCount && teamMemberCount >= 5 && teamRespondedCount !== null && (
        <div className="mt-2 flex items-center gap-2">
          <Users className="size-4 text-slate-500" />
          <p className="text-xs text-slate-400">
            {teamRespondedCount === teamMemberCount ? (
              <span>🎉 ¡Todos respondieron!</span>
            ) : (
              <span>Tu equipo: {teamRespondedCount}/{teamMemberCount} respondieron</span>
            )}
          </p>
        </div>
      )}

      {!alreadySubmitted && (
        <button
          onClick={onStartSurvey}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors"
        >
          Responder ahora
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}