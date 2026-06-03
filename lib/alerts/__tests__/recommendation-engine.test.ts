import { describe, it, expect } from "vitest";
import { generateRecommendations } from "../recommendation-engine";
import type { AlertInsertData } from "../types";

function makeAlert(overrides: Partial<AlertInsertData> = {}): AlertInsertData {
  return {
    teamId: "team-1",
    type: "BURNOUT",
    severity: "HIGH",
    message: "Test message",
    driver: "Test driver",
    ...overrides,
  };
}

describe("generateRecommendations", () => {
  it("generates 2 recommendations for BURNOUT alert", () => {
    const alert = makeAlert({ type: "BURNOUT" });
    const recs = generateRecommendations([alert]);

    expect(recs).toHaveLength(2);
    expect(recs[0].teamId).toBe("team-1");
    expect(recs[0].category).toBe("workload");
    expect(recs[1].category).toBe("recovery");
  });

  it("generates 2 recommendations for ATTRITION alert", () => {
    const alert = makeAlert({ type: "ATTRITION" });
    const recs = generateRecommendations([alert]);

    expect(recs).toHaveLength(2);
    expect(recs[0].category).toBe("recognition");
    expect(recs[1].category).toBe("clarity");
  });

  it("generates 1 recommendation for WELLBEING alert", () => {
    const alert = makeAlert({ type: "WELLBEING" });
    const recs = generateRecommendations([alert]);

    expect(recs).toHaveLength(1);
    expect(recs[0].category).toBe("leadership");
  });

  it("generates 1 recommendation for TREND alert", () => {
    const alert = makeAlert({ type: "TREND" });
    const recs = generateRecommendations([alert]);

    expect(recs).toHaveLength(1);
    expect(recs[0].category).toBe("collaboration");
  });

  it("generates 1 recommendation for PRODUCTIVITY alert", () => {
    const alert = makeAlert({ type: "PRODUCTIVITY" });
    const recs = generateRecommendations([alert]);

    expect(recs).toHaveLength(1);
    expect(recs[0].category).toBe("workload");
  });

  it("generates 1 recommendation for PREDICTIVE alert", () => {
    const alert = makeAlert({ type: "PREDICTIVE" });
    const recs = generateRecommendations([alert]);

    expect(recs).toHaveLength(1);
    expect(recs[0].category).toBe("leadership");
  });

  it("generates fallback recommendation for unknown alert type", () => {
    const alert = makeAlert({ type: "UNKNOWN_TYPE" } as AlertInsertData);
    const recs = generateRecommendations([alert]);

    expect(recs).toHaveLength(1);
    expect(recs[0].category).toBe("leadership");
    expect(recs[0].action).toContain("Revisar el estado del equipo");
  });

  it("all recommendations have non-empty action strings in Spanish", () => {
    const alertTypes = [
      "BURNOUT",
      "ATTRITION",
      "WELLBEING",
      "TREND",
      "PRODUCTIVITY",
      "PREDICTIVE",
    ];

    for (const type of alertTypes) {
      const alert = makeAlert({ type });
      const recs = generateRecommendations([alert]);

      for (const rec of recs) {
        expect(rec.action).toBeTruthy();
        expect(rec.action.length).toBeGreaterThan(10);
      }
    }
  });

  it("returns empty array for empty alerts array", () => {
    const recs = generateRecommendations([]);
    expect(recs).toEqual([]);
  });

  it("alertId is undefined in all recommendations (caller links after insertion)", () => {
    const alert = makeAlert({ type: "BURNOUT" });
    const recs = generateRecommendations([alert]);

    for (const rec of recs) {
      expect(rec.alertId).toBeUndefined();
    }
  });
});
