"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TeamForm } from "./TeamForm";
import { ConfirmDialog } from "./ConfirmDialog";

interface TeamData {
  id: string;
  name: string;
  userCount: number;
  responseCount: number;
  latestOwi: number | null;
}

interface TeamTableProps {
  teams: TeamData[];
}

export function TeamTable({ teams: initialTeams }: TeamTableProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [editingTeam, setEditingTeam] = useState<{ id: string; name: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    const res = await fetch("/api/admin/teams");
    const json = await res.json();
    if (json.success) setTeams(json.data);
    setRefreshing(false);
  }

  async function handleDelete(teamId: string) {
    const res = await fetch(`/api/admin/teams/${teamId}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok) {
      toast.success("Equipo eliminado");
    } else {
      toast.error(json?.error?.message ?? "Error al eliminar");
    }
    await refresh();
  }

  function handleEditSuccess() {
    setEditingTeam(null);
    setShowForm(false);
    refresh();
  }

  function handleCreateSuccess() {
    setShowForm(false);
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Equipos ({teams.length})</h2>
        <button
          onClick={() => {
            setEditingTeam(null);
            setShowForm(!showForm);
          }}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-slate-500"
        >
          {showForm ? "Cancelar" : "+ Nuevo equipo"}
        </button>
      </div>

      {showForm && !editingTeam && <TeamForm onSuccess={handleCreateSuccess} />}

      {editingTeam && <TeamForm team={editingTeam} onSuccess={handleEditSuccess} />}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Nombre</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Usuarios</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Respuestas</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">OWI</th>
              <th className="w-24 px-4 py-3 text-xs font-medium text-slate-500" />
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b border-slate-800/50">
                <td className="px-4 py-3 text-slate-200">{team.name}</td>
                <td className="px-4 py-3 text-slate-400">{team.userCount}</td>
                <td className="px-4 py-3 text-slate-400">{team.responseCount}</td>
                <td className="px-4 py-3">
                  {team.latestOwi !== null ? (
                    <span
                      className={`font-semibold ${
                        team.latestOwi >= 70
                          ? "text-emerald-400"
                          : team.latestOwi >= 50
                            ? "text-amber-400"
                            : "text-red-400"
                      }`}
                    >
                      {team.latestOwi}
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingTeam({ id: team.id, name: team.name });
                        setShowForm(false);
                      }}
                      disabled={refreshing}
                      className="text-xs text-slate-400 transition-colors hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Editar
                    </button>
                    <ConfirmDialog
                      title="Eliminar equipo"
                      message={`¿Estás seguro de eliminar "${team.name}"? Esta acción no se puede deshacer.`}
                      onConfirm={() => handleDelete(team.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {teams.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No hay equipos creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
