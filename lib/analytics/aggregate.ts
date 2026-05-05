import { prisma } from "@/lib/prisma";
import type { TeamAverages } from "@/lib/types";

const RAW_MIN = 1;
const RAW_MAX = 5;

/**
 * Result returned by {@link aggregateTeamData}.
 */
export interface AggregationResult extends TeamAverages {
  responseCount: number;
}

/**
 * Aggregate raw SurveyResult scores for a given team and week period.
 *
 * Fetches all SurveyResult rows matching `teamId` and `period`,
 * then computes per-dimension averages and calls `calculateOwiWeighted`
 * to derive the weighted OWI.
 */
export async function aggregateTeamData(
  teamId: string,
  period: string,
): Promise<AggregationResult> {
  const rows = await prisma.surveyResult.findMany({
    where: { teamId, period },
    select: {
      energy: true,
      belonging: true,
      clarity: true,
      stress: true,
      workload: true,
    },
  });

  const responseCount = rows.length;

  if (responseCount === 0) {
    return {
      energy: 0,
      belonging: 0,
      clarity: 0,
      stress: 0,
      workload: 0,
      owi: 0,
      responseCount: 0,
    };
  }

  const sum = { energy: 0, belonging: 0, clarity: 0, stress: 0, workload: 0 };

  for (const row of rows) {
    sum.energy += clamp(row.energy);
    sum.belonging += clamp(row.belonging);
    sum.clarity += clamp(row.clarity);
    sum.stress += clamp(row.stress);
    sum.workload += clamp(row.workload);
  }

  const avg: TeamAverages = {
    energy: parseFloat((sum.energy / responseCount).toFixed(2)),
    belonging: parseFloat((sum.belonging / responseCount).toFixed(2)),
    clarity: parseFloat((sum.clarity / responseCount).toFixed(2)),
    stress: parseFloat((sum.stress / responseCount).toFixed(2)),
    workload: parseFloat((sum.workload / responseCount).toFixed(2)),
    owi: 0, // placeholder — caller computes OWI via calculateOwiWeighted
  };

  return { ...avg, responseCount };
}

/** Clamp raw score to valid 1-5 range (safety belt). */
function clamp(value: number): number {
  return Math.max(RAW_MIN, Math.min(RAW_MAX, value));
}
