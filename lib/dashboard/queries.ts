import { prisma } from "@/lib/prisma";

export interface TrendDataPoint {
  period: string;
  [teamName: string]: string | number;
}

export interface LatestOwiPerTeam {
  teamId: string;
  teamName: string;
  owi: number;
  burnoutRisk: string;
  attritionRisk: string;
  period: string;
}

/**
 * Returns the latest wellbeing score per team.
 *
 * Queries all wellbeing scores ordered by period descending, then groups by
 * teamId taking only the first (latest) entry per team. Mirrors the HR
 * dashboard pattern at `app/(protected)/hr/page.tsx` lines ~60–115.
 *
 * @param teamIds — optional filter; when omitted returns scores for all teams.
 */
export async function getLatestOwiPerTeam(
  teamIds?: string[],
): Promise<LatestOwiPerTeam[]> {
  const scores = await prisma.wellbeingScore.findMany({
    where: teamIds ? { teamId: { in: teamIds } } : undefined,
    orderBy: { period: "desc" },
    include: { team: { select: { name: true } } },
  });

  const latestByTeam = new Map<string, LatestOwiPerTeam>();
  for (const score of scores) {
    if (!latestByTeam.has(score.teamId)) {
      latestByTeam.set(score.teamId, {
        teamId: score.teamId,
        teamName: score.team.name,
        owi: score.owi,
        burnoutRisk: score.burnoutRisk,
        attritionRisk: score.attritionRisk,
        period: score.period ?? "",
      });
    }
  }

  return Array.from(latestByTeam.values());
}

/**
 * Returns OWI trend data for the last N periods, with scores pivoted by team.
 *
 * Fetches the last `maxPeriods` distinct periods, then queries all wellbeing
 * scores for those periods across the specified teams (or all teams if no
 * filter is provided). The result is formatted for use with TrendChart.
 *
 * Mirrors the HR dashboard pattern at `app/(protected)/hr/page.tsx` lines
 * ~87–236.
 *
 * @param teamIds — optional filter; when omitted returns scores for all teams.
 * @param maxPeriods — number of periods to include (default 4).
 */
export async function getOwiTrend(
  teamIds?: string[],
  maxPeriods: number = 4,
): Promise<TrendDataPoint[]> {
  const distinctPeriods = await prisma.wellbeingScore.findMany({
    where: teamIds ? { teamId: { in: teamIds } } : undefined,
    select: { period: true },
    distinct: ["period"],
    orderBy: { period: "desc" },
    take: maxPeriods,
  });

  const periods = distinctPeriods
    .map((p) => p.period)
    .filter((p): p is string => p !== null)
    .reverse();

  if (periods.length === 0) return [];

  const scores = await prisma.wellbeingScore.findMany({
    where: {
      ...(teamIds ? { teamId: { in: teamIds } } : {}),
      period: { in: periods },
    },
    include: { team: { select: { name: true } } },
    orderBy: { period: "asc" },
  });

  return periods.map((period) => {
    const point: TrendDataPoint = { period };
    for (const score of scores.filter((s) => s.period === period)) {
      point[score.team.name] = score.owi;
    }
    return point;
  });
}
