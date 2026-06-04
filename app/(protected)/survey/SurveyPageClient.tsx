"use client";

import { useState } from "react";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { ConfirmationView } from "@/components/survey/ConfirmationView";
import { StatusCard } from "@/components/survey/StatusCard";
import { HistoryGrid } from "@/components/survey/HistoryGrid";
import { StatsRow } from "@/components/survey/StatsRow";
import type { SURVEY_QUESTIONS } from "@/lib/survey-utils";
import { PrivacyBanner } from "@/components/shared/PrivacyBanner";

interface HistoryItem {
  period: string;
  responded: boolean;
}

// ── Types ──────────────────────────────────────────────────────────────
interface SurveyPageClientProps {
  surveyName: string;
  questions: typeof SURVEY_QUESTIONS;
  period: string;
  alreadySubmitted: boolean;
  history: HistoryItem[];
  streak: number;
  totalResponses: number;
  teamParticipation: number | null;
  teamMemberCount: number | null;
  teamRespondedCount: number | null;
}

// ── Component ──────────────────────────────────────────────────────────
export function SurveyPageClient({
  surveyName,
  questions,
  period,
  alreadySubmitted: initialSubmitted,
  history,
  streak,
  totalResponses,
  teamParticipation,
  teamMemberCount,
  teamRespondedCount,
}: SurveyPageClientProps) {
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [showForm, setShowForm] = useState(false);

  // If showing the form
  if (showForm && !submitted) {
    return (
      <SurveyForm
        surveyName={surveyName}
        questions={questions}
        period={period}
        onSubmitted={() => {
          setSubmitted(true);
          setShowForm(false);
        }}
      />
    );
  }

  // If submitted and we want to show confirmation (right after submitting)
  if (submitted && !initialSubmitted) {
    return <ConfirmationView period={period} />;
  }

  // Default: dashboard view
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      <StatusCard
        alreadySubmitted={submitted}
        streak={streak}
        period={period}
        onStartSurvey={() => setShowForm(true)}
        teamMemberCount={teamMemberCount}
        teamRespondedCount={teamRespondedCount}
      />

      <StatsRow
        totalResponses={totalResponses}
        streak={streak}
        teamParticipation={teamParticipation}
      />

      <HistoryGrid history={history} />

      <PrivacyBanner />
    </div>
  );
}