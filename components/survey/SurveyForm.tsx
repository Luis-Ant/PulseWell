"use client";

import { useState, useTransition } from "react";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrivacyBanner } from "@/components/shared/PrivacyBanner";
import type { SURVEY_QUESTIONS } from "@/lib/survey-utils";

// ── Types ──────────────────────────────────────────────────────────────
interface SurveyFormProps {
  surveyName: string;
  questions: typeof SURVEY_QUESTIONS;
  period: string;
  onSubmitted: () => void;
  onCancel?: () => void;
}

type Scores = Record<string, number | null>;

// ── Component ──────────────────────────────────────────────────────────
export function SurveyForm({ surveyName, questions, period, onSubmitted, onCancel }: SurveyFormProps) {
  const [scores, setScores] = useState<Scores>({});
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const questionList = Object.values(questions);

  const answeredCount = questionList.filter((q) => {
    const val = scores[q.key];
    return val !== undefined && val !== null;
  }).length;

  function handleSelect(questionKey: string, value: number) {
    setScores((prev) => ({ ...prev, [questionKey]: value }));
    // Clear field error on change
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[questionKey];
      return next;
    });
  }

  function handleSubmit() {
    // Client-side validation — all fields required
    const errors: Record<string, string> = {};
    for (const q of questionList) {
      const val = scores[q.key];
      if (val === undefined || val === null) {
        errors[q.key] = "Selecciona un valor para esta pregunta.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const body: Record<string, number> = {};
        for (const q of questionList) {
          body[q.key] = scores[q.key]!;
        }

        const res = await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const json = await res.json();

        if (!res.ok) {
          const msg = json?.error?.message ?? "Error al enviar la respuesta.";
          setError(msg);
          return;
        }

        onSubmitted();
      } catch {
        setError("Error de conexión. Intenta nuevamente.");
      }
    });
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        {onCancel && (
          <button
            onClick={onCancel}
            className="mb-4 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="size-3" />
            Volver al panel
          </button>
        )}
        <h1 className="text-3xl font-bold text-white">{surveyName}</h1>
        <p className="mt-2 text-sm text-slate-400">
          Período: {period}
        </p>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${(answeredCount / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-500">{answeredCount}/5</span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {questionList.map((q) => {
          const hasError = fieldErrors[q.key];
          return (
            <div
              key={q.key}
              className="rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-5"
            >
              <label
                htmlFor={`question-${q.key}`}
                className="mb-4 block text-base font-semibold text-slate-100"
              >
                {q.question}
              </label>

              {/* Likert scale */}
              <div className="flex items-center justify-between gap-1">
                <span className="min-w-[5rem] text-right text-xs text-slate-500">
                  {q.lowLabel}
                </span>

                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const isSelected = scores[q.key] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleSelect(q.key, value)}
                        className={`flex size-11 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                          isSelected
                            ? "border-emerald-400 bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/50"
                            : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                        }`}
                        aria-label={`${q.label}: ${value}`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>

                <span className="min-w-[5rem] text-xs text-slate-500">
                  {q.highLabel}
                </span>
              </div>

              {hasError && (
                <p className="mt-3 text-xs text-red-400">{hasError}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-800 bg-red-950/50 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="mt-8 flex justify-end">
        <Button
          type="button"
          variant="primary"
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Enviar respuestas
            </>
          )}
        </Button>
      </div>

      {/* Privacy */}
      <div className="mt-6">
        <PrivacyBanner />
      </div>
    </div>
  );
}
