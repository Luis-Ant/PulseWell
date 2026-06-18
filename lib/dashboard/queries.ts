import { prisma } from "@/lib/prisma";

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
