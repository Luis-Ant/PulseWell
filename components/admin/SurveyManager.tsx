"use client";

import { useState } from "react";

interface SurveyData {
  id: string;
  name: string;
  isActive: boolean;
  frequency: string;
  responseCount: number;
  createdAt: string;
}

interface SurveyManagerProps {
  surveys: SurveyData[];
}

export function SurveyManager({ surveys: initialSurveys }: SurveyManagerProps) {
  const [surveys, setSurveys] = useState(initialSurveys);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("WEEKLY");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admin/surveys");
    const json = await res.json();
    if (json.success) setSurveys(json.data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("El nombre es requerido."); return; }
    setLoading(true);
    const res = await fetch("/api/admin/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), frequency }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json?.error?.message ?? "Error al crear."); setLoading(false); return; }
    setName("");
    setShowForm(false);
    setLoading(false);
    await refresh();
  }

  async function toggleActive(surveyId: string, currentActive: boolean) {
    await fetch(`/api/admin/surveys/${surveyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentActive }),
    });
    await refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Encuestas ({surveys.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500 transition-colors"
        >
          {showForm ? "Cancelar" : "+ Nueva encuesta"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Crear encuesta</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Weekly Pulse Q3 2026"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "Creando..." : "Crear"}
              </button>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Frecuencia</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="WEEKLY">Semanal</option>
                <option value="BIWEEKLY">Quincenal</option>
              </select>
            </div>
          </div>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </form>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left">
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Nombre</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Estado</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Frecuencia</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Respuestas</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500">Creada</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((s) => (
              <tr key={s.id} className="border-b border-slate-800/50">
                <td className="px-4 py-3 text-slate-200">{s.name}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(s.id, s.isActive)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                      s.isActive
                        ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                        : "bg-slate-400/10 text-slate-500 border border-slate-400/20"
                    }`}
                  >
                    <span className={`size-1.5 rounded-full ${s.isActive ? "bg-emerald-400" : "bg-slate-500"}`} />
                    {s.isActive ? "Activa" : "Inactiva"}
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {s.frequency === "BIWEEKLY" ? "Quincenal" : "Semanal"}
                </td>
                <td className="px-4 py-3 text-slate-400">{s.responseCount}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {new Date(s.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3" />
              </tr>
            ))}
            {surveys.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  No hay encuestas creadas. Creá una para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
