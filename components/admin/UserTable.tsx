"use client";

import { useState, useEffect } from "react";
import { UserForm } from "./UserForm";
import { ConfirmDialog } from "./ConfirmDialog";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  teamId: string | null;
  teamName: string | null;
  createdAt: string;
}

interface TeamOption {
  id: string;
  name: string;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  HR_ANALYST: "HR",
  MANAGER: "Manager",
  EMPLOYEE: "Empleado",
};

export function UserTable({ users: initialUsers }: { users: UserData[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/teams")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setTeams(j.data);
      });
  }, []);

  async function refresh() {
    const res = await fetch("/api/admin/users");
    const json = await res.json();
    if (json.success) setUsers(json.data);
  }

  async function handleDelete(userId: string) {
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    await refresh();
  }

  function handleSuccess() {
    setEditingUser(null);
    setShowForm(false);
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Usuarios ({users.length})</h2>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(!showForm);
          }}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-slate-500"
        >
          {showForm ? "Cancelar" : "+ Nuevo usuario"}
        </button>
      </div>

      {showForm && !editingUser && (
        <UserForm
          teams={teams}
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingUser && (
        <UserForm
          user={{
            id: editingUser.id,
            email: editingUser.email,
            name: editingUser.name,
            role: editingUser.role,
            teamId: editingUser.teamId,
          }}
          teams={teams}
          onSuccess={handleSuccess}
          onCancel={() => setEditingUser(null)}
        />
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Nombre</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Email</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Rol</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Equipo</th>
              <th className="w-24 px-4 py-3 text-xs font-medium text-slate-500" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-800/50">
                <td className="px-4 py-3 text-slate-200">{u.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{u.teamName ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="text-xs text-slate-400 transition-colors hover:text-white"
                    >
                      Editar
                    </button>
                    <ConfirmDialog
                      title="Eliminar usuario"
                      message={`¿Estás seguro de eliminar a "${u.name}"? Esta acción no se puede deshacer.`}
                      onConfirm={() => handleDelete(u.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  No hay usuarios creados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
