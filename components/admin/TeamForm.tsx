"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TeamFormProps {
  team?: { id: string; name: string };
  onSuccess: () => void;
}

export function TeamForm({ team, onSuccess }: TeamFormProps) {
  const [name, setName] = useState(team?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre del equipo es requerido.");
      return;
    }

    setLoading(true);
    try {
      const url = team ? `/api/admin/teams/${team.id}` : "/api/admin/teams";
      const method = team ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Error al guardar el equipo.");
        return;
      }
      onSuccess();
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-sm font-semibold text-white">
        {team ? "Editar equipo" : "Crear equipo"}
      </h3>
      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="teamName" className="mb-1 block text-xs text-slate-400">
            Nombre
          </label>
          <Input
            id="teamName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del equipo"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : team ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </div>
    </form>
  );
}
