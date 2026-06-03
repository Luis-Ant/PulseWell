import { describe, it, expect } from "vitest";
import { calculateProductivityHealth } from "../productivity-health";
import type { TeamAverages } from "@/lib/types";

describe("calculateProductivityHealth", () => {
  it("returns LOW when all 4 dimensions are healthy", () => {
    const input: TeamAverages = {
      clarity: 4,
      energy: 4,
      workload: 2,
      belonging: 4,
      stress: 3,
      owi: 0,
    };
    expect(calculateProductivityHealth(input)).toBe("LOW");
  });

  it("returns MEDIUM when 3 dimensions are healthy", () => {
    const input: TeamAverages = {
      clarity: 4,
      energy: 4,
      workload: 2,
      belonging: 3,
      stress: 3,
      owi: 0,
    };
    expect(calculateProductivityHealth(input)).toBe("MEDIUM");
  });

  it("returns HIGH when 2 dimensions are healthy", () => {
    const input: TeamAverages = {
      clarity: 4,
      energy: 3,
      workload: 4,
      belonging: 4,
      stress: 3,
      owi: 0,
    };
    expect(calculateProductivityHealth(input)).toBe("HIGH");
  });

  it("returns CRITICAL when 1 dimension is healthy", () => {
    const input: TeamAverages = {
      clarity: 4,
      energy: 3,
      workload: 4,
      belonging: 3,
      stress: 3,
      owi: 0,
    };
    expect(calculateProductivityHealth(input)).toBe("CRITICAL");
  });

  it("returns CRITICAL when 0 dimensions are healthy", () => {
    const input: TeamAverages = {
      clarity: 3,
      energy: 3,
      workload: 4,
      belonging: 3,
      stress: 3,
      owi: 0,
    };
    expect(calculateProductivityHealth(input)).toBe("CRITICAL");
  });

  it("correctly uses thresholds: clarity ≥ 3.5, energy ≥ 3.5, workload ≤ 3.5, belonging ≥ 3.5", () => {
    // Borderline: exactly at threshold
    const input: TeamAverages = {
      clarity: 3.5,
      energy: 3.5,
      workload: 3.5,
      belonging: 3.5,
      stress: 3,
      owi: 0,
    };
    expect(calculateProductivityHealth(input)).toBe("LOW");
  });
});
