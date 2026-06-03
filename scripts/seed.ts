// ─── Idempotent Seed Script ──────────────────────────────────────────────────
// Creates demo data for PulseWell: 1 org, 4 teams, 20 users, narrative trends.
// Safe to run multiple times — uses upsert for all entities.
// ────────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";
import type { UserRole, RiskLevel } from "@prisma/client";
import { prisma } from "../lib/prisma";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_PASSWORD = "Demo1234!";
const ORG_NAME = "PulseWell Demo";
function getRecentWeeks(count: number = 4): string[] {
  const weeks: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
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

const WEEKS = getRecentWeeks(4);

const TEAMS = [
  { name: "Engineering", slug: "eng" },
  { name: "Sales", slug: "sales" },
  { name: "Operations", slug: "ops" },
  { name: "Customer Success", slug: "cs" },
] as const;

// ─── Team narrative trends (OWI per week) ─────────────────────────────────────
const TEAM_TRENDS: Record<string, { owi: number[]; burnout: RiskLevel[]; attrition: RiskLevel[] }> = {
  Engineering: {
    owi: [65, 52, 41, 33],
    burnout: ["HIGH", "HIGH", "HIGH", "HIGH"],
    attrition: ["LOW", "MEDIUM", "MEDIUM", "HIGH"],
  },
  Sales: {
    owi: [58, 55, 50, 47],
    burnout: ["LOW", "LOW", "MEDIUM", "MEDIUM"],
    attrition: ["LOW", "MEDIUM", "MEDIUM", "MEDIUM"],
  },
  Operations: {
    owi: [72, 74, 71, 73],
    burnout: ["LOW", "LOW", "LOW", "LOW"],
    attrition: ["LOW", "LOW", "LOW", "LOW"],
  },
  "Customer Success": {
    owi: [45, 52, 60, 68],
    burnout: ["HIGH", "MEDIUM", "MEDIUM", "LOW"],
    attrition: ["MEDIUM", "LOW", "LOW", "LOW"],
  },
};

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

    // Employees per team (vary to hit 20 total: 4+4+3+3 = 14)
    const employeeCount = slug === "eng" || slug === "sales" ? 4 : 3;
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

  // ── SmartAlerts ─────────────────────────────────────────────────────────────
  console.log("\n🚨 Creating smart alerts...");

  const engTeamId = teamIdMap.get("Engineering")!;
  const salesTeamId = teamIdMap.get("Sales")!;
  const opsTeamId = teamIdMap.get("Operations")!;

  // Alert 1: Engineering burnout alert (HIGH severity)
  const alert1 = await prisma.smartAlert.upsert({
    where: { id: "alert-eng-burnout" },
    update: {
      type: "BURNOUT",
      severity: "HIGH",
      message: "Engineering team OWI dropped 49% over 4 weeks — burnout risk is critical.",
      driver: "Sustained high workload + declining belonging scores",
      isActive: true,
    },
    create: {
      id: "alert-eng-burnout",
      teamId: engTeamId,
      type: "BURNOUT",
      severity: "HIGH",
      message: "Engineering team OWI dropped 49% over 4 weeks — burnout risk is critical.",
      driver: "Sustained high workload + declining belonging scores",
      isActive: true,
    },
  });
  console.log(`  ✅ Alert: ${alert1.message.slice(0, 50)}...`);

  // Alert 2: Sales attrition risk (MEDIUM severity)
  const alert2 = await prisma.smartAlert.upsert({
    where: { id: "alert-sales-attrition" },
    update: {
      type: "ATTRITION",
      severity: "MEDIUM",
      message: "Sales team showing declining engagement trends — attrition risk is rising.",
      driver: "Consistent OWI decline + low clarity scores",
      isActive: true,
    },
    create: {
      id: "alert-sales-attrition",
      teamId: salesTeamId,
      type: "ATTRITION",
      severity: "MEDIUM",
      message: "Sales team showing declining engagement trends — attrition risk is rising.",
      driver: "Consistent OWI decline + low clarity scores",
      isActive: true,
    },
  });
  console.log(`  ✅ Alert: ${alert2.message.slice(0, 50)}...`);

  // Alert 3: Operations stable (LOW severity — positive check)
  // Wait, LOW is not a valid AlertSeverity value? No, LOW IS in AlertSeverity: LOW, MEDIUM, HIGH, CRITICAL
  const alert3 = await prisma.smartAlert.upsert({
    where: { id: "alert-ops-stable" },
    update: {
      type: "WELLBEING",
      severity: "LOW",
      message: "Operations team maintaining stable wellbeing throughout Q2.",
      driver: "Consistent scores, no significant declines detected",
      isActive: true,
    },
    create: {
      id: "alert-ops-stable",
      teamId: opsTeamId,
      type: "WELLBEING",
      severity: "LOW",
      message: "Operations team maintaining stable wellbeing throughout Q2.",
      driver: "Consistent scores, no significant declines detected",
      isActive: true,
    },
  });
  console.log(`  ✅ Alert: ${alert3.message.slice(0, 50)}...`);

  // Alert 4: Engineering productivity trend (MEDIUM severity)
  const alert4 = await prisma.smartAlert.upsert({
    where: { id: "alert-eng-productivity" },
    update: {
      type: "PRODUCTIVITY",
      severity: "MEDIUM",
      message: "Engineering energy scores dropping — productivity impact likely within 2 weeks.",
      driver: "Energy scores declined from 8 to 4 over the period",
      isActive: true,
    },
    create: {
      id: "alert-eng-productivity",
      teamId: engTeamId,
      type: "PRODUCTIVITY",
      severity: "MEDIUM",
      message: "Engineering energy scores dropping — productivity impact likely within 2 weeks.",
      driver: "Energy scores declined from 8 to 4 over the period",
      isActive: true,
    },
  });
  console.log(`  ✅ Alert: ${alert4.message.slice(0, 50)}...`);

  // ── Recommendations ─────────────────────────────────────────────────────────
  console.log("\n💡 Creating recommendations...");

  // Recommendation linked to alert1 (Eng burnout)
  const rec1 = await prisma.recommendation.upsert({
    where: { id: "rec-eng-workload" },
    update: {
      teamId: engTeamId,
      alertId: alert1.id,
      category: "workload",
      action: "Redistribute sprint tickets across Engineering. Cap at 8 story points per engineer for the next 2 sprints.",
    },
    create: {
      id: "rec-eng-workload",
      teamId: engTeamId,
      alertId: alert1.id,
      category: "workload",
      action: "Redistribute sprint tickets across Engineering. Cap at 8 story points per engineer for the next 2 sprints.",
    },
  });
  console.log(`  ✅ Recommendation: ${rec1.action.slice(0, 50)}...`);

  // Recommendation linked to alert1 (Eng burnout — wellness action)
  const rec2 = await prisma.recommendation.upsert({
    where: { id: "rec-eng-beloning" },
    update: {
      teamId: engTeamId,
      alertId: alert1.id,
      category: "team-building",
      action: "Schedule a team offsite or hackathon. Belonging scores are the fastest declining metric.",
    },
    create: {
      id: "rec-eng-beloning",
      teamId: engTeamId,
      alertId: alert1.id,
      category: "team-building",
      action: "Schedule a team offsite or hackathon. Belonging scores are the fastest declining metric.",
    },
  });
  console.log(`  ✅ Recommendation: ${rec2.action.slice(0, 50)}...`);

  // Recommendation linked to alert2 (Sales attrition)
  const rec3 = await prisma.recommendation.upsert({
    where: { id: "rec-sales-clarity" },
    update: {
      teamId: salesTeamId,
      alertId: alert2.id,
      category: "workload",
      action: "Run a roadmap clarity session with Sales leadership. Low clarity scores are driving attrition risk.",
    },
    create: {
      id: "rec-sales-clarity",
      teamId: salesTeamId,
      alertId: alert2.id,
      category: "workload",
      action: "Run a roadmap clarity session with Sales leadership. Low clarity scores are driving attrition risk.",
    },
  });
  console.log(`  ✅ Recommendation: ${rec3.action.slice(0, 50)}...`);

  // Recommendation for stable ops (wellness maintenance)
  const rec4 = await prisma.recommendation.upsert({
    where: { id: "rec-ops-continue" },
    update: {
      teamId: opsTeamId,
      alertId: alert3.id,
      category: "wellness",
      action: "Continue current wellness initiatives. Operations team is a model for other departments.",
    },
    create: {
      id: "rec-ops-continue",
      teamId: opsTeamId,
      alertId: alert3.id,
      category: "wellness",
      action: "Continue current wellness initiatives. Operations team is a model for other departments.",
    },
  });
  console.log(`  ✅ Recommendation: ${rec4.action.slice(0, 50)}...`);

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
  console.log("\n📧 Demo credentials:");
  console.log("  admin@pulsewell.demo      / Demo1234!  (ADMIN)");
  console.log("  hr@pulsewell.demo         / Demo1234!  (HR_ANALYST)");
  console.log(
    "  manager-eng@pulsewell.demo / Demo1234!  (MANAGER — Engineering)",
  );
  console.log(
    "  employee1-eng@pulsewell.demo / Demo1234! (EMPLOYEE — Engineering)",
  );
  console.log("  ... (see scripts/seed.ts for full list)");
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
