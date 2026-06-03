import { describe, it, expect } from "vitest";
import { calculateBurnoutRiskTeam } from "../burnout-risk";

describe("calculateBurnoutRiskTeam", () => {
  it("returns LOW for OWI >= 70", () => {
    expect(calculateBurnoutRiskTeam(100)).toBe("LOW");
    expect(calculateBurnoutRiskTeam(70)).toBe("LOW");
  });

  it("returns MEDIUM for OWI 50-69", () => {
    expect(calculateBurnoutRiskTeam(69)).toBe("MEDIUM");
    expect(calculateBurnoutRiskTeam(50)).toBe("MEDIUM");
  });

  it("returns HIGH for OWI 30-49", () => {
    expect(calculateBurnoutRiskTeam(49)).toBe("HIGH");
    expect(calculateBurnoutRiskTeam(30)).toBe("HIGH");
  });

  it("returns CRITICAL for OWI < 30", () => {
    expect(calculateBurnoutRiskTeam(29)).toBe("CRITICAL");
    expect(calculateBurnoutRiskTeam(0)).toBe("CRITICAL");
  });
});
