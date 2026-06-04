"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  action: string;
  label: string;
  variant?: "primary" | "secondary";
}

export function ActionButton({ action, label, variant = "secondary" }: ActionButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await fetch(action, { method: "POST" });
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  return (
    <Button
      variant={variant}
      className="text-xs"
      onClick={handleClick}
      disabled={loading}
    >
      {loading && <Loader2 className="mr-1.5 size-3 animate-spin" />}
      {loading ? "Procesando..." : label}
    </Button>
  );
}
