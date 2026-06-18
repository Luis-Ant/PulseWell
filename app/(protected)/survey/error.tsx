"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────
interface SurveyErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// ── Component ──────────────────────────────────────────────────────────
export default function SurveyError({ error, reset }: SurveyErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <AlertTriangle className="size-12 text-yellow-400" />

      <h1 className="mt-6 text-2xl font-bold text-white">
        Error al cargar la encuesta
      </h1>

      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-slate-400">
        No se pudo cargar la encuesta. Intenta nuevamente en unos segundos.
      </p>

      {process.env.NODE_ENV !== "production" && (
        <p className="mt-4 max-w-md rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs font-mono text-red-400 break-all">
          {error.message}
        </p>
      )}

      <Button
        variant="secondary"
        className="mt-6 inline-flex items-center gap-2"
        onClick={reset}
      >
        <RefreshCw className="size-4" />
        Reintentar
      </Button>
    </div>
  );
}
