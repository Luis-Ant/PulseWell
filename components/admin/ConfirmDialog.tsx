"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  triggerLabel?: string;
}

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  triggerLabel = "Eliminar",
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="secondary"
        className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300"
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <p className="mt-3 text-sm text-slate-400">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-600 px-3 py-1.5 text-xs hover:bg-red-500"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
