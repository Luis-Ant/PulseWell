import { prisma } from "../lib/prisma";
import {
  calculateBurnoutRiskTeam,
  calculateTrend,
} from "../lib/analytics";

async function main() {
  console.log("🔍 Verificando escenarios demo...\n");
  let allPassed = true;

  // ── Engineering: CRITICAL or HIGH burnout ───────────────────────
  const engTeam = await prisma.team.findFirst({
    where: { name: "Engineering" },
  });
  if (engTeam) {
    const engScores = await prisma.wellbeingScore.findMany({
      where: { teamId: engTeam.id },
      orderBy: { period: "desc" },
    });

    if (engScores.length >= 2) {
      const latest = engScores[0];
      const risk = calculateBurnoutRiskTeam(latest.owi);
      const passed = risk === "CRITICAL" || risk === "HIGH";
      console.log(
        `${passed ? "✅" : "❌"} Engineering: burnout ${risk} (expected HIGH/CRITICAL, OWI=${latest.owi})`,
      );
      if (!passed) allPassed = false;

      const trend = calculateTrend(latest.owi, engScores[1].owi);
      console.log(
        `   Trend: ${trend.classification} (delta=${trend.delta})`,
      );
    } else {
      console.log("⚠️  Engineering: datos insuficientes para verificar tendencia");
    }
  } else {
    console.log("⚠️  Engineering: equipo no encontrado en seed data");
  }

  // ── Sales: declining trend ──────────────────────────────────────
  const salesTeam = await prisma.team.findFirst({
    where: { name: "Sales" },
  });
  if (salesTeam) {
    const salesScores = await prisma.wellbeingScore.findMany({
      where: { teamId: salesTeam.id },
      orderBy: { period: "desc" },
    });

    if (salesScores.length >= 2) {
      const trend = calculateTrend(salesScores[0].owi, salesScores[1].owi);
      const passed =
        trend.classification === "declining" || trend.delta < 0;
      console.log(
        `${passed ? "✅" : "❌"} Sales: trend ${trend.classification} (delta=${trend.delta})`,
      );
      if (!passed) allPassed = false;
    } else {
      console.log("⚠️  Sales: datos insuficientes para verificar tendencia");
    }
  } else {
    console.log("⚠️  Sales: equipo no encontrado en seed data");
  }

  // ── Operations: LOW risk (stable) ───────────────────────────────
  const opsTeam = await prisma.team.findFirst({
    where: { name: "Operations" },
  });
  if (opsTeam) {
    const opsScores = await prisma.wellbeingScore.findMany({
      where: { teamId: opsTeam.id },
      orderBy: { period: "desc" },
    });

    if (opsScores.length > 0) {
      const risk = calculateBurnoutRiskTeam(opsScores[0].owi);
      const passed = risk === "LOW";
      console.log(
        `${passed ? "✅" : "❌"} Operations: burnout ${risk} (expected LOW, OWI=${opsScores[0].owi})`,
      );
      if (!passed) allPassed = false;
    } else {
      console.log("⚠️  Operations: sin datos de wellbeing");
      allPassed = false;
    }
  } else {
    console.log("⚠️  Operations: equipo no encontrado en seed data");
  }

  // ── Customer Success: improving trend ───────────────────────────
  const csTeam = await prisma.team.findFirst({
    where: { name: "Customer Success" },
  });
  if (csTeam) {
    const csScores = await prisma.wellbeingScore.findMany({
      where: { teamId: csTeam.id },
      orderBy: { period: "desc" },
    });

    if (csScores.length >= 2) {
      const trend = calculateTrend(csScores[0].owi, csScores[1].owi);
      const passed =
        trend.classification === "improving" || trend.delta > 0;
      console.log(
        `${passed ? "✅" : "❌"} Customer Success: trend ${trend.classification} (delta=${trend.delta})`,
      );
      if (!passed) allPassed = false;
    } else {
      console.log(
        "⚠️  Customer Success: datos insuficientes para verificar tendencia",
      );
    }
  } else {
    console.log("⚠️  Customer Success: equipo no encontrado en seed data");
  }

  console.log(
    "\n" +
      (allPassed
        ? "✅ Todos los escenarios pasaron."
        : "❌ Algunos escenarios fallaron."),
  );

  await prisma.$disconnect();
  process.exit(allPassed ? 0 : 1);
}

main();
