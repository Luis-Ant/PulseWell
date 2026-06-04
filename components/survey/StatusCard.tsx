"use client";

import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  alreadySubmitted: boolean;
  streak: number;
  period: string;
  onStartSurvey: () => void;
}

export function StatusCard({ alreadySubmitted, streak, period, onStartSurvey }: StatusCardProps) {
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
            Esta semana · {period}
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