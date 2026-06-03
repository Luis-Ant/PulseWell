"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserFormProps {
  user?: { id: string; email: string; name: string; role: string; teamId: string | null };
  teams: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function UserForm({ user, teams, onSuccess, onCancel }: UserFormProps) {
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState(user?.role ?? "EMPLOYEE");
  const [teamId, setTeamId] = useState(user?.teamId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user && (!email.trim() || !name.trim())) {
      setError("Email y nombre son requeridos.");
      return;
    }

    setLoading(true);
    try {
      const url = user ? `/api/admin/users/${user.id}` : "/api/admin/users";
      const method = user ? "PUT" : "POST";
      const body: Record<string, unknown> = { name: name.trim(), role, teamId: teamId || null };
      if (!user) body.email = email.trim();

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Error al guardar el usuario.");
        return;
      }
      if (!user && json.data?.tempPassword) {
        setTempPassword(json.data.tempPassword);
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
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {user ? "Editar usuario" : "Crear usuario"}
        </h3>
        {onCancel && (
          <Button
            variant="secondary"
            className="px-3 py-1.5 text-xs"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </Button>
        )}
      </div>

      {tempPassword && (
        <div className="mt-3 rounded-lg border border-cyan-800 bg-cyan-950/30 px-4 py-2">
          <p className="text-xs text-cyan-300">
            Usuario creado. Contraseña temporal:{" "}
            <span className="font-mono font-bold">{tempPassword}</span>
          </p>
          <p className="mt-1 text-xs text-cyan-400/60">
            El usuario deberá cambiarla al iniciar sesión.
          </p>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {!user && (
          <div>
            <label className="mb-1 block text-xs text-slate-400">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              type="email"
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs text-slate-400">Nombre</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="ADMIN">Admin</option>
            <option value="HR_ANALYST">HR Analyst</option>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Equipo (opcional)</label>
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="">Sin equipo</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : user ? "Actualizar" : "Crear usuario"}
          </Button>
        </div>
      </div>
    </form>
  );
}
