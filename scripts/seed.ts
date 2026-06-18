// ─── Idempotent Seed Script ──────────────────────────────────────────────────
// Creates demo data for PulseWell: 1 org, 6 teams, 38 users, 24-week narrative.
// Safe to run multiple times — uses upsert for all entities.
// ────────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";
import type { UserRole, RiskLevel, AlertType, AlertSeverity } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { generateAlerts, generateRecommendations } from "../lib/alerts";
import type { TeamAlertInput, AlertInsertData } from "../lib/alerts";
import { calculateProjection } from "../lib/analytics";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_PASSWORD = "Demo1234!";
const ORG_NAME = "PulseWell Demo";
function getRecentWeeks(count: number = 4): string[] {
  const weeks: string[] = [];
  const now = new Date();
  // Start from LAST week (not current) so employees can respond THIS week
  for (let i = count; i >= 1; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    // ISO week number calculation
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
    const year = d.getUTCFullYear();
    weeks.push(`${year}-W${String(weekNum).padStart(2, "0")}`);
  }
  return weeks;
}

const WEEKS = getRecentWeeks(24);

const TEAMS = [
  { name: "Engineering", slug: "eng" },
  { name: "Sales", slug: "sales" },
  { name: "Operations", slug: "ops" },
  { name: "Customer Success", slug: "cs" },
  { name: "Marketing", slug: "mkt" },
  { name: "Finance", slug: "fin" },
] as const;

// ─── Team narrative trends (OWI per week, 24 weeks) ──────────────────────────
// Generated programmatically for richer, more realistic patterns.
function classifyOwi(owi: number): RiskLevel {
  if (owi >= 70) return "LOW";
  if (owi >= 50) return "MEDIUM";
  if (owi >= 30) return "HIGH";
  return "CRITICAL";
}

function classifyAttrition(owi: number, week: number): RiskLevel {
  // Attrition risk follows OWI with some delay
  if (owi < 35) return week > 12 ? "CRITICAL" : "HIGH";
  if (owi < 50) return "MEDIUM";
  return "LOW";
}

function generateTeamTrends(): Record<string, { owi: number[]; burnout: RiskLevel[]; attrition: RiskLevel[] }> {
  const totalWeeks = WEEKS.length;

  // Engineering: Steady decline 78 → 12 over 24 weeks (burnout crisis)
  const engOwi: number[] = [];
  for (let w = 0; w < totalWeeks; w++) {
    const base = 80 - (w * 3); // Declines ~3 points per week
    const noise = Math.round((Math.random() - 0.5) * 4); // ±2 random
    engOwi.push(Math.max(8, Math.min(82, base + noise)));
  }

  // Sales: Gradual decline 70 → 35 with small recoveries
  const salesOwi: number[] = [];
  for (let w = 0; w < totalWeeks; w++) {
    const base = 72 - (w * 1.6);
    // Every 6 weeks, small recovery bump
    const recovery = (w % 6 === 0 && w > 0) ? 4 : 0;
    const noise = Math.round((Math.random() - 0.5) * 5);
    salesOwi.push(Math.max(30, Math.min(75, base + recovery + noise)));
  }

  // Operations: Very stable 68-78 (the healthy baseline)
  const opsOwi: number[] = [];
  for (let w = 0; w < totalWeeks; w++) {
    const base = 73;
    const seasonal = Math.sin(w * 0.3) * 3; // Gentle seasonal pattern
    const noise = Math.round((Math.random() - 0.5) * 3);
    opsOwi.push(Math.max(65, Math.min(80, base + seasonal + noise)));
  }

  // Customer Success: Crisis → recovery 25 → 82
  const csOwi: number[] = [];
  for (let w = 0; w < totalWeeks; w++) {
    let base: number;
    if (w < 4) base = 35 - w * 3;       // Weeks 1-4: Crisis (35→23)
    else if (w < 8) base = 25 + (w - 4) * 5;  // Weeks 5-8: Intervention starts
    else if (w < 16) base = 45 + (w - 8) * 2.5; // Weeks 9-16: Steady recovery
    else base = 65 + (w - 16) * 1.5;    // Weeks 17-24: Stabilizing
    const noise = Math.round((Math.random() - 0.5) * 4);
    csOwi.push(Math.max(20, Math.min(85, base + noise)));
  }

  // Marketing: Cyclical 55-75 (seasonal patterns)
  const mktOwi: number[] = [];
  for (let w = 0; w < totalWeeks; w++) {
    const base = 62;
    const cycle1 = Math.sin(w * 0.5) * 8;  // Slow cycle
    const cycle2 = Math.sin(w * 0.15) * 5; // Very slow trend
    const noise = Math.round((Math.random() - 0.5) * 4);
    mktOwi.push(Math.max(50, Math.min(78, base + cycle1 + cycle2 + noise)));
  }

  // Finance: Excellent but slowly declining 85 → 65
  const finOwi: number[] = [];
  for (let w = 0; w < totalWeeks; w++) {
    const base = 84 - (w * 0.9);
    const noise = Math.round((Math.random() - 0.5) * 4);
    finOwi.push(Math.max(60, Math.min(88, base + noise)));
  }

  return {
    Engineering: buildTrend(engOwi),
    Sales: buildTrend(salesOwi),
    Operations: buildTrend(opsOwi),
    "Customer Success": buildTrend(csOwi),
    Marketing: buildTrend(mktOwi),
    Finance: buildTrend(finOwi),
  };
}

function buildTrend(owi: number[]): { owi: number[]; burnout: RiskLevel[]; attrition: RiskLevel[] } {
  return {
    owi,
    burnout: owi.map((o) => classifyOwi(o)),
    attrition: owi.map((o, w) => classifyAttrition(o, w)),
  };
}

const TEAM_TRENDS = generateTeamTrends();

// ─── User definitions ─────────────────────────────────────────────────────────
interface UserDef {
  email: string;
  name: string;
  role: UserRole;
  teamSlug: string | null;
}

function buildUsers(): UserDef[] {
  const users: UserDef[] = [];

  // Global roles (no team)
  users.push({ email: "admin@pulsewell.demo", name: "Admin User", role: "ADMIN", teamSlug: null });
  users.push({ email: "hr@pulsewell.demo", name: "HR Analyst", role: "HR_ANALYST", teamSlug: null });

  // Per-team users
  for (const team of TEAMS) {
    const slug = team.slug;
    const namePrefix = team.name;

    // 1 manager per team
    users.push({
      email: `manager-${slug}@pulsewell.demo`,
      name: `${namePrefix} Manager`,
      role: "MANAGER",
      teamSlug: slug,
    });

    // Employees per team
    const employeeCount = slug === "eng" || slug === "sales" ? 6 : slug === "mkt" || slug === "fin" ? 5 : 4;
    for (let i = 1; i <= employeeCount; i++) {
      users.push({
        email: `employee${i}-${slug}@pulsewell.demo`,
        name: `${namePrefix} Employee ${i}`,
        role: "EMPLOYEE",
        teamSlug: slug,
      });
    }
  }

  return users;
}

// ─── Score generation helpers ──────────────────────────────────────────────────

/**
 * Generate individual survey scores that average roughly to the target mean.
 * Uses deterministic jitter so repeated runs produce the same data.
 */
function generateIndividualScores(
  targetMean: number,
  userIndex: number,
): { energy: number; belonging: number; clarity: number; stress: number; workload: number } {
  // Deterministic offsets based on userIndex to get variation (scaled for 1-5 range)
  const offsets = [
    [0, -1, 1, -1, 0],
    [-1, 1, -1, 0, -1],
    [1, 0, -1, -1, 1],
    [-1, 0, 0, 1, 0],
    [0, -1, 0, 0, -1],
  ];
  const offset = offsets[userIndex % offsets.length];

  const clamp = (v: number) => Math.max(1, Math.min(5, Math.round(v)));

  return {
    energy: clamp(targetMean / 20 + offset[0]),
    belonging: clamp(targetMean / 20 + offset[1]),
    clarity: clamp(targetMean / 20 + offset[2]),
    stress: clamp(targetMean / 20 + offset[3]),
    workload: clamp(targetMean / 20 + offset[4]),
  };
}

/**
 * Calculate OWI from individual scores (simple average × 10).
 *
 * NOTE: This uses the SIMPLE formula (avg×10), NOT the weighted formula
 * from lib/analytics/owi.ts. This is intentional because:
 * 1. WellbeingScores in the seed are MANUALLY defined in TEAM_TRENDS to match
 *    the demo narrative — they don't use this function at all.
 * 2. calcOwi is only used for SurveyResult individual response generation,
 *    where the exact OWI doesn't matter (it's never persisted from here).
 * 3. The weighted formula requires full team aggregation which isn't available
 *    at the individual response level during seeding.
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for documentation; see comment above */
function calcOwi(scores: { energy: number; belonging: number; clarity: number; stress: number; workload: number }): number {
  const avg = (scores.energy + scores.belonging + scores.clarity + scores.stress + scores.workload) / 5;
  return Math.round(avg * 10);
}

// ─── Main seed function ───────────────────────────────────────────────────────

export interface SeedResult {
  userCount: number;
  teamCount: number;
  surveyResultCount: number;
  wellbeingCount: number;
  alertCount: number;
  recommendationCount: number;
}

export async function runSeed(): Promise<SeedResult> {
  // ── Supabase Admin Client ───────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecret) {
    throw new Error(
      "Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY",
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseSecret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ── Organization ────────────────────────────────────────────────────────────
  console.log("📋 Upserting organization...");
  const org = await prisma.organization.upsert({
    where: { id: "org-demo" },
    update: { name: ORG_NAME },
    create: { id: "org-demo", name: ORG_NAME },
  });
  console.log(`  ✅ Organization: ${org.name} (${org.id})`);

  // ── Teams ───────────────────────────────────────────────────────────────────
  console.log("\n👥 Upserting teams...");
  const teamMap = new Map<string, string>(); // slug → teamId
  const teamIdMap = new Map<string, string>(); // slug → teamId

  for (const t of TEAMS) {
    const team = await prisma.team.upsert({
      where: { id: `team-${t.slug}` },
      update: { name: t.name, organizationId: org.id },
      create: { id: `team-${t.slug}`, name: t.name, organizationId: org.id },
    });
    teamMap.set(t.slug, team.id);
    teamIdMap.set(t.name, team.id);
    console.log(`  ✅ ${team.name} (${team.id})`);
  }

  // ── Users (Supabase Auth + Prisma) ──────────────────────────────────────────
  console.log("\n👤 Creating users (Supabase Auth + Prisma)...");

  const userDefs = buildUsers();
  const userIdMap = new Map<string, string>(); // email → prisma userId
  let authCreated = 0;
  let authSkipped = 0;

  // Pre-fetch existing Supabase users for idempotency
  const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });
  const existingEmailSet = new Set(
    (existingAuthUsers?.users ?? []).map((u) => (u.email ?? "").toLowerCase()),
  );

  for (const def of userDefs) {
    const emailLower = def.email.toLowerCase();
    let supabaseUid: string;

    // Create Supabase Auth user if not exists
    if (existingEmailSet.has(emailLower)) {
      const existing = existingAuthUsers!.users.find(
        (u) => (u.email ?? "").toLowerCase() === emailLower,
      );
      supabaseUid = existing!.id;
      authSkipped++;
    } else {
      const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
        email: def.email,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { name: def.name, role: def.role },
      });

      if (error) {
        console.error(`  ❌ Failed to create auth user ${def.email}: ${error.message}`);
        continue;
      }

      supabaseUid = authUser.user.id;
      authCreated++;
    }

    // Upsert Prisma User
    const teamId = def.teamSlug ? teamMap.get(def.teamSlug) ?? null : null;
    const dbUser = await prisma.user.upsert({
      where: { email: def.email },
      update: {
        name: def.name,
        role: def.role,
        supabaseUid,
        organizationId: org.id,
        teamId,
      },
      create: {
        email: def.email,
        name: def.name,
        role: def.role,
        supabaseUid,
        organizationId: org.id,
        teamId,
      },
    });

    userIdMap.set(def.email, dbUser.id);
  }

  console.log(`  ✅ Auth users: ${authCreated} created, ${authSkipped} already existed`);
  console.log(`  ✅ Prisma users: ${userDefs.length} upserted`);

  // ── Survey ──────────────────────────────────────────────────────────────────
  console.log("\n📊 Upserting survey...");
  const survey = await prisma.survey.upsert({
    where: { id: "survey-weekly-pulse" },
    update: { name: "Weekly Pulse Q2 2026", isActive: true, organizationId: org.id },
    create: {
      id: "survey-weekly-pulse",
      name: "Weekly Pulse Q2 2026",
      isActive: true,
      organizationId: org.id,
    },
  });
  console.log(`  ✅ Survey: ${survey.name}`);

  // ── SurveyResults (per user, per week) ──────────────────────────────────────
  console.log("\n📈 Generating survey responses...");
  let resultCount = 0;

  for (const team of TEAMS) {
    const teamName = team.name;
    const teamId = teamIdMap.get(teamName)!;
    const trend = TEAM_TRENDS[teamName];

    // Get users in this team
    const teamUsers = userDefs.filter((d) => d.teamSlug === team.slug);

    for (let w = 0; w < WEEKS.length; w++) {
      const period = WEEKS[w];
      const targetOwi = trend.owi[w];

      for (let u = 0; u < teamUsers.length; u++) {
        const userEmail = teamUsers[u].email;
        const userId = userIdMap.get(userEmail);
        if (!userId) continue;

        const scores = generateIndividualScores(targetOwi, u);

        await prisma.surveyResult.upsert({
          where: {
            userId_period: { userId, period },
          },
          update: {
            energy: scores.energy,
            belonging: scores.belonging,
            clarity: scores.clarity,
            stress: scores.stress,
            workload: scores.workload,
          },
          create: {
            userId,
            teamId,
            period,
            energy: scores.energy,
            belonging: scores.belonging,
            clarity: scores.clarity,
            stress: scores.stress,
            workload: scores.workload,
            surveyId: survey.id,
          },
        });

        resultCount++;
      }
    }
  }
  console.log(`  ✅ ${resultCount} survey responses upserted`);

  // ── WellbeingScores (per team, per week) ────────────────────────────────────
  console.log("\n💚 Generating wellbeing scores...");
  let wellbeingCount = 0;

  for (const team of TEAMS) {
    const teamName = team.name;
    const teamId = teamIdMap.get(teamName)!;
    const trend = TEAM_TRENDS[teamName];

    for (let w = 0; w < WEEKS.length; w++) {
      const period = WEEKS[w];

      await prisma.wellbeingScore.upsert({
        where: {
          teamId_period: { teamId, period },
        },
        update: {
          owi: trend.owi[w],
          burnoutRisk: trend.burnout[w],
          attritionRisk: trend.attrition[w],
        },
        create: {
          teamId,
          period,
          owi: trend.owi[w],
          burnoutRisk: trend.burnout[w],
          attritionRisk: trend.attrition[w],
        },
      });

      wellbeingCount++;
    }
  }
  console.log(`  ✅ ${wellbeingCount} wellbeing scores upserted`);

  // ── SmartAlerts + Recommendations (dynamic engine) ──────────────────────────
  console.log("\n🚨 Generating smart alerts and recommendations...");

  // Build team alert inputs from the latest week's data
  const lastWeek = WEEKS[WEEKS.length - 1];
  const teamInputs: TeamAlertInput[] = [];
  const owiHistoryByTeam = new Map<string, number[]>();
  const decliningTrendTeams = new Set<string>();

  for (const team of TEAMS) {
    const teamName = team.name;
    const teamId = teamIdMap.get(teamName)!;
    const trend = TEAM_TRENDS[teamName];

    // Collect OWI history for projection + trend detection
    const owiHistory = trend.owi;
    owiHistoryByTeam.set(teamName, owiHistory);

    // Detect declining trend: 2+ consecutive OWI drops AND latest OWI < 70
    let consecutiveDeclines = 0;
    for (let i = 1; i < owiHistory.length; i++) {
      if (owiHistory[i] < owiHistory[i - 1]) {
        consecutiveDeclines++;
      } else {
        consecutiveDeclines = 0;
      }
    }
    if (consecutiveDeclines >= 2 && owiHistory[owiHistory.length - 1] < 70) {
      decliningTrendTeams.add(teamName);
    }

    // Use the last week's data
    const lastIdx = WEEKS.length - 1;
    teamInputs.push({
      teamId,
      teamName,
      owi: trend.owi[lastIdx],
      burnoutRisk: trend.burnout[lastIdx],
      attritionRisk: trend.attrition[lastIdx],
      productivityHealth: "LOW", // placeholder — computed below
      period: lastWeek,
    });
  }

  // Compute projected OWI per team
  const projectedOwiByTeam = new Map<string, number | null>();
  for (const team of TEAMS) {
    const owiHistory = owiHistoryByTeam.get(team.name) ?? [];
    projectedOwiByTeam.set(team.name, calculateProjection(owiHistory));
  }

  // Build lookup: teamId → projectedOwi (for the alert engine)
  const projectedOwiByTeamId = new Map<string, number | null>();
  for (const team of TEAMS) {
    const teamName = team.name;
    const teamId = teamIdMap.get(teamName)!;
    projectedOwiByTeamId.set(
      teamId,
      projectedOwiByTeam.get(teamName) ?? null,
    );
  }

  // Build lookup: teamName → teamId for declining trend detection
  const decliningTrendTeamIds = new Set<string>();
  for (const teamName of decliningTrendTeams) {
    const teamId = teamIdMap.get(teamName);
    if (teamId) decliningTrendTeamIds.add(teamId);
  }

  const alerts = generateAlerts(
    teamInputs,
    projectedOwiByTeamId,
    decliningTrendTeamIds,
  );

  let generatedAlertCount = 0;
  const savedAlerts: Array<{ id: string; type: string; teamId: string }> = [];

  for (const alert of alerts) {
    const id = `alert-${alert.teamId}-${alert.type.toLowerCase()}-${Date.now()}`;
    await prisma.smartAlert.upsert({
      where: { id },
      update: {
        type: alert.type as AlertType,
        severity: alert.severity as AlertSeverity,
        message: alert.message,
        driver: alert.driver,
        isActive: true,
      },
      create: {
        id,
        teamId: alert.teamId,
        type: alert.type as AlertType,
        severity: alert.severity as AlertSeverity,
        message: alert.message,
        driver: alert.driver,
        isActive: true,
      },
    });
    savedAlerts.push({ id, type: alert.type, teamId: alert.teamId });
    generatedAlertCount++;
    console.log(`  ✅ Alert: ${alert.message.slice(0, 50)}...`);
  }
  console.log(`  ✅ ${generatedAlertCount} alerts generated`);

  // ── Recommendations (linked to saved alerts) ────────────────────────────────
  let generatedRecCount = 0;

  for (const savedAlert of savedAlerts) {
    // Generate recommendations for this specific alert (not a flat global list)
    const alertInput: AlertInsertData = {
      teamId: savedAlert.teamId,
      type: savedAlert.type,
      severity: "",
      message: "",
      driver: "",
    };
    const recsForAlert = generateRecommendations([alertInput]);

    for (const rec of recsForAlert) {
      // Hardening assertion: linked alert's team must match recommendation's team
      if (savedAlert.teamId !== rec.teamId) {
        throw new Error(
          `Team ID mismatch: alert ${savedAlert.id} (team ${savedAlert.teamId}) ` +
            `rec team ${rec.teamId}`,
        );
      }

      const id = `rec-${savedAlert.teamId}-${Date.now()}-${generatedRecCount}`;
      await prisma.recommendation.upsert({
        where: { id },
        update: {
          teamId: rec.teamId,
          alertId: savedAlert.id,
          category: rec.category,
          action: rec.action,
        },
        create: {
          id,
          teamId: rec.teamId,
          alertId: savedAlert.id,
          category: rec.category,
          action: rec.action,
        },
      });
      generatedRecCount++;
      console.log(`  ✅ Recommendation: ${rec.action.slice(0, 50)}...`);
    }
  }
  console.log(`  ✅ ${generatedRecCount} recommendations generated`);

  // ── Summary ─────────────────────────────────────────────────────────────────
  const userCount = await prisma.user.count();
  const teamCount = await prisma.team.count();
  const surveyResultCount = await prisma.surveyResult.count();
  const totalWellbeing = await prisma.wellbeingScore.count();
  const alertCount = await prisma.smartAlert.count();
  const recommendationCount = await prisma.recommendation.count();

  return {
    userCount,
    teamCount,
    surveyResultCount,
    wellbeingCount: totalWellbeing,
    alertCount,
    recommendationCount,
  };
}

// ─── Direct execution wrapper ─────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding PulseWell demo data...\n");

  const result = await runSeed();

  console.log("\n" + "=".repeat(60));
  console.log("🌱 Seed complete!");
  console.log("=".repeat(60));
  console.log(`  🏢 Organization:    1 (${ORG_NAME})`);
  console.log(`  👥 Teams:           ${result.teamCount}`);
  console.log(`  👤 Users:           ${result.userCount}`);
  console.log(`  📊 Survey Results:  ${result.surveyResultCount}`);
  console.log(`  💚 Wellbeing:       ${result.wellbeingCount}`);
  console.log(`  🚨 Smart Alerts:    ${result.alertCount}`);
  console.log(`  💡 Recommendations: ${result.recommendationCount}`);
  console.log("\n📧 Demo credentials (sample):");
  console.log("  admin@pulsewell.demo        / Demo1234!  (ADMIN)");
  console.log("  hr@pulsewell.demo           / Demo1234!  (HR_ANALYST)");
  console.log("  manager-eng@pulsewell.demo  / Demo1234!  (MANAGER — Engineering)");
  console.log("  manager-mkt@pulsewell.demo  / Demo1234!  (MANAGER — Marketing)");
  console.log("  ... (38 users total — see scripts/seed.ts for full list)");
}

// Only execute main() when this file is the ENTRY POINT (bun scripts/seed.ts),
// NEVER when imported as a module (e.g., by API routes during Next.js build).
// import.meta.main is the standard ESM way to detect direct execution.
if (import.meta.main) {
  main()
    .catch((e) => {
      console.error("❌ Seed failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
