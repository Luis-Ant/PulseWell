"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProtectedError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <AlertTriangle className="size-12 text-yellow-400" />
      <h1 className="mt-6 text-2xl font-bold text-white">Error inesperado</h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        Ocurrió un error al cargar esta página. Intentá nuevamente.
      </p>

      {process.env.NODE_ENV !== "production" && (
        <p className="mt-4 max-w-md rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs font-mono text-red-400 break-all">
          {error.message}
        </p>
      )}

      <Button variant="secondary" className="mt-6" onClick={reset}>
        <RefreshCw className="mr-2 size-4" /> Reintentar
      </Button>
    </div>
  );
}
