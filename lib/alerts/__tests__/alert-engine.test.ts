import { describe, it, expect } from "vitest";
import { generateAlerts } from "../alert-engine";
import type { TeamAlertInput } from "../types";

function makeTeam(overrides: Partial<TeamAlertInput> = {}): TeamAlertInput {
  return {
    teamId: "team-1",
    teamName: "Test Team",
    owi: 65,
    burnoutRisk: "LOW",
    attritionRisk: "LOW",
    productivityHealth: "LOW",
    period: "2026-W22",
    ...overrides,
  };
}

describe("generateAlerts", () => {
  it("generates BURNOUT alert when burnoutRisk is HIGH", () => {
    const team = makeTeam({ burnoutRisk: "HIGH" });
    const alerts = generateAlerts([team], new Map(), new Set());

    const burnoutAlert = alerts.find((a) => a.type === "BURNOUT");
    expect(burnoutAlert).toBeDefined();
    expect(burnoutAlert!.severity).toBe("HIGH");
    expect(burnoutAlert!.message).toContain("Test Team");
    expect(burnoutAlert!.message).toContain("indicadores elevados de riesgo de burnout");
  });

  it("generates NO alert when burnoutRisk is LOW", () => {
    const team = makeTeam({ burnoutRisk: "LOW" });
    const alerts = generateAlerts([team], new Map(), new Set());

    expect(alerts.find((a) => a.type === "BURNOUT")).toBeUndefined();
  });

  it("generates ATTRITION alert when attritionRisk is CRITICAL", () => {
    const team = makeTeam({ attritionRisk: "CRITICAL" });
    const alerts = generateAlerts([team], new Map(), new Set());

    const attritionAlert = alerts.find((a) => a.type === "ATTRITION");
    expect(attritionAlert).toBeDefined();
    expect(attritionAlert!.severity).toBe("CRITICAL");
    expect(attritionAlert!.message).toContain("señales de riesgo de rotación");
  });

  it("generates WELLBEING alert when OWI < 50", () => {
    const team = makeTeam({ owi: 45 });
    const alerts = generateAlerts([team], new Map(), new Set());

    const wellbeingAlert = alerts.find((a) => a.type === "WELLBEING");
    expect(wellbeingAlert).toBeDefined();
    expect(wellbeingAlert!.severity).toBe("MEDIUM");
    expect(wellbeingAlert!.message).toContain("45/100");
  });

  it("generates HIGH severity WELLBEING alert when OWI < 35", () => {
    const team = makeTeam({ owi: 30 });
    const alerts = generateAlerts([team], new Map(), new Set());

    const wellbeingAlert = alerts.find((a) => a.type === "WELLBEING");
    expect(wellbeingAlert).toBeDefined();
    expect(wellbeingAlert!.severity).toBe("HIGH");
  });

  it("generates NO wellbeing alert when OWI >= 50", () => {
    const team = makeTeam({ owi: 65 });
    const alerts = generateAlerts([team], new Map(), new Set());

    expect(alerts.find((a) => a.type === "WELLBEING")).toBeUndefined();
  });

  it("generates TREND alert when team is in decliningTrendTeams", () => {
    const team = makeTeam({ owi: 45 });
    const decliningTrendTeams = new Set(["team-1"]);
    const alerts = generateAlerts([team], new Map(), decliningTrendTeams);

    const trendAlert = alerts.find((a) => a.type === "TREND");
    expect(trendAlert).toBeDefined();
    expect(trendAlert!.severity).toBe("HIGH"); // owi < 50
    expect(trendAlert!.message).toContain("tendencia negativa consecutiva");
  });

  it("generates NO trend alert when team is NOT in decliningTrendTeams", () => {
    const team = makeTeam({ owi: 45 });
    const alerts = generateAlerts([team], new Map(), new Set());

    expect(alerts.find((a) => a.type === "TREND")).toBeUndefined();
  });

  it("generates PRODUCTIVITY alert when productivityHealth is HIGH", () => {
    const team = makeTeam({ productivityHealth: "HIGH" });
    const alerts = generateAlerts([team], new Map(), new Set());

    const productivityAlert = alerts.find((a) => a.type === "PRODUCTIVITY");
    expect(productivityAlert).toBeDefined();
    expect(productivityAlert!.severity).toBe("HIGH");
    expect(productivityAlert!.message).toContain("baja productividad");
  });

  it("generates PREDICTIVE alert when projected OWI < 50", () => {
    const team = makeTeam({ owi: 55 });
    const projectedOwiByTeam = new Map<string, number | null>([
      ["team-1", 42],
    ]);
    const alerts = generateAlerts([team], projectedOwiByTeam, new Set());

    const predictiveAlert = alerts.find((a) => a.type === "PREDICTIVE");
    expect(predictiveAlert).toBeDefined();
    expect(predictiveAlert!.severity).toBe("MEDIUM");
    expect(predictiveAlert!.message).toContain("42");
    expect(predictiveAlert!.message).toContain("Proyección simulada");
  });

  it("generates NO predictive alert when projected OWI >= 50", () => {
    const team = makeTeam({ owi: 55 });
    const projectedOwiByTeam = new Map<string, number | null>([
      ["team-1", 65],
    ]);
    const alerts = generateAlerts([team], projectedOwiByTeam, new Set());

    expect(alerts.find((a) => a.type === "PREDICTIVE")).toBeUndefined();
  });

  it("generates NO alerts for team with owi=0 (no data)", () => {
    const team = makeTeam({
      owi: 0,
      burnoutRisk: "CRITICAL",
      attritionRisk: "CRITICAL",
      productivityHealth: "CRITICAL",
    });
    const projectedOwiByTeam = new Map<string, number | null>([
      ["team-1", 20],
    ]);
    const decliningTrendTeams = new Set(["team-1"]);

    const alerts = generateAlerts(
      [team],
      projectedOwiByTeam,
      decliningTrendTeams,
    );
    expect(alerts).toHaveLength(0);
  });

  it("can generate multiple alerts for the same team", () => {
    const team = makeTeam({
      owi: 33,
      burnoutRisk: "HIGH",
      attritionRisk: "HIGH",
      productivityHealth: "HIGH",
    });
    const projectedOwiByTeam = new Map<string, number | null>([
      ["team-1", 28],
    ]);
    const decliningTrendTeams = new Set(["team-1"]);

    const alerts = generateAlerts(
      [team],
      projectedOwiByTeam,
      decliningTrendTeams,
    );

    // Should have BURNOUT, ATTRITION, WELLBEING, TREND, PRODUCTIVITY, PREDICTIVE
    expect(alerts.length).toBeGreaterThanOrEqual(4);

    const types = alerts.map((a) => a.type);
    expect(types).toContain("BURNOUT");
    expect(types).toContain("ATTRITION");
    expect(types).toContain("WELLBEING");
    expect(types).toContain("TREND");
    expect(types).toContain("PRODUCTIVITY");
    expect(types).toContain("PREDICTIVE");
  });

  it("returns empty array for empty input", () => {
    const alerts = generateAlerts([], new Map(), new Set());
    expect(alerts).toEqual([]);
  });

  it("never uses clinical language like 'tiene burnout'", () => {
    const team = makeTeam({ burnoutRisk: "CRITICAL", owi: 30 });
    const alerts = generateAlerts([team], new Map(), new Set());

    for (const alert of alerts) {
      expect(alert.message).not.toMatch(/tiene burnout/i);
      expect(alert.message).not.toMatch(/tiene estrés/i);
    }

    const burnoutAlert = alerts.find((a) => a.type === "BURNOUT");
    expect(burnoutAlert!.message).toMatch(/muestra indicadores/i);
  });
});
