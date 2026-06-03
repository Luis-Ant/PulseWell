import { describe, it, expect } from "vitest";
import { calculateAttritionRisk } from "../attrition-risk";
import type { TeamAverages } from "@/lib/types";

const base: TeamAverages = {
  energy: 3,
  belonging: 3,
  clarity: 3,
  stress: 3,
  workload: 3,
  owi: 60,
};

describe("calculateAttritionRisk", () => {
  it("returns LOW for 0 signals", () => {
    expect(calculateAttritionRisk(base)).toBe("LOW");
  });

  it("returns LOW for 1 signal (low energy)", () => {
    const input: TeamAverages = { ...base, energy: 2 };
    expect(calculateAttritionRisk(input)).toBe("LOW");
  });

  it("returns MEDIUM for 2 signals (low energy + low belonging)", () => {
    const input: TeamAverages = { ...base, energy: 2, belonging: 2 };
    expect(calculateAttritionRisk(input)).toBe("MEDIUM");
  });

  it("returns HIGH for 3 signals", () => {
    const input: TeamAverages = {
      ...base,
      energy: 2,
      belonging: 2,
      workload: 4.5,
    };
    expect(calculateAttritionRisk(input)).toBe("HIGH");
  });

  it("returns HIGH for 4 signals WITHOUT decline", () => {
    const input: TeamAverages = {
      energy: 2,
      belonging: 2,
      clarity: 3,
      stress: 4.5,
      workload: 4.5,
      owi: 60,
    };
    expect(calculateAttritionRisk(input, 50)).toBe("HIGH");
  });

  it("returns CRITICAL for 4 signals WITH decline", () => {
    const input: TeamAverages = {
      energy: 2,
      belonging: 2,
      clarity: 3,
      stress: 4.5,
      workload: 4.5,
      owi: 40,
    };
    expect(calculateAttritionRisk(input, 60)).toBe("CRITICAL");
  });
});
