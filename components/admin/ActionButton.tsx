"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  action: string;
  label: string;
  variant?: "primary" | "secondary";
}

type ActionStatus = "idle" | "loading" | "success" | "error";

export function ActionButton({ action, label, variant = "secondary" }: ActionButtonProps) {
  const [status, setStatus] = useState<ActionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleClick() {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch(action, { method: "POST" });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error?.message || "Error del servidor");
      }
      setStatus("success");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Error de conexión");
    }
  }

  return (
    <div>
      <Button
        variant={variant}
        className="text-xs"
        onClick={handleClick}
        disabled={status === "loading" || status === "success"}
      >
        {status === "loading" && <Loader2 className="mr-1.5 size-3 animate-spin" />}
        {status === "loading"
          ? "Procesando..."
          : status === "success"
            ? "✅ Completado"
            : status === "error"
              ? "❌ Error"
              : label}
      </Button>
      {errorMessage && (
        <p className="mt-1 text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
