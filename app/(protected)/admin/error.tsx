"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <AlertTriangle className="size-12 text-yellow-400" />
      <h1 className="mt-6 text-2xl font-bold text-white">Error al cargar el panel</h1>
      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-slate-400">
        Ocurrió un error al obtener los datos de administración. Intenta nuevamente.
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-slate-600">ID: {error.digest}</p>
      )}
      <Button variant="secondary" className="mt-6 inline-flex items-center gap-2" onClick={reset}>
        <RefreshCw className="size-4" /> Reintentar
      </Button>
    </div>
  );
}
