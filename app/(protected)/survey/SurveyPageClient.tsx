"use client";

import { useState } from "react";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { ConfirmationView } from "@/components/survey/ConfirmationView";
import type { SURVEY_QUESTIONS } from "@/lib/survey-utils";

// ── Types ──────────────────────────────────────────────────────────────
interface SurveyPageClientProps {
  surveyName: string;
  questions: typeof SURVEY_QUESTIONS;
  period: string;
  alreadySubmitted: boolean;
}

// ── Component ──────────────────────────────────────────────────────────
export function SurveyPageClient({
  surveyName,
  questions,
  period,
  alreadySubmitted: initialSubmitted,
}: SurveyPageClientProps) {
  const [submitted, setSubmitted] = useState(initialSubmitted);

  if (submitted) {
    return <ConfirmationView period={period} />;
  }

  return (
    <SurveyForm
      surveyName={surveyName}
      questions={questions}
      period={period}
      onSubmitted={() => setSubmitted(true)}
    />
  );
}
