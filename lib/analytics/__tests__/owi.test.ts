import { describe, it, expect } from "vitest";
import { calculateOwiWeighted } from "../owi";
import type { TeamAverages } from "@/lib/types";

describe("calculateOwiWeighted", () => {
  it("returns 100 for perfect wellbeing (low stress/workload)", () => {
    const input: TeamAverages = {
      energy: 5,
      belonging: 5,
      clarity: 5,
      stress: 1,
      workload: 1,
      owi: 0,
    };
    const result = calculateOwiWeighted(input);
    expect(result).toBe(100);
  });

  it("returns 0 for worst wellbeing (high stress/workload)", () => {
    const input: TeamAverages = {
      energy: 1,
      belonging: 1,
      clarity: 1,
      stress: 5,
      workload: 5,
      owi: 0,
    };
    const result = calculateOwiWeighted(input);
    expect(result).toBe(0);
  });

  it("returns 50 for all mid scores (3)", () => {
    const input: TeamAverages = {
      energy: 3,
      belonging: 3,
      clarity: 3,
      stress: 3,
      workload: 3,
      owi: 0,
    };
    const result = calculateOwiWeighted(input);
    expect(result).toBe(50);
  });

  it("returns null if any dimension is NaN", () => {
    const input = {
      energy: NaN,
      belonging: 3,
      clarity: 3,
      stress: 3,
      workload: 3,
      owi: 0,
    } as unknown as TeamAverages;
    expect(calculateOwiWeighted(input)).toBeNull();
  });

  it("returns null if any dimension is null", () => {
    const input = {
      energy: null,
      belonging: 3,
      clarity: 3,
      stress: 3,
      workload: 3,
      owi: 0,
    } as unknown as TeamAverages;
    expect(calculateOwiWeighted(input)).toBeNull();
  });

  it("returns null if any dimension is undefined", () => {
    const input = {
      energy: undefined,
      belonging: 3,
      clarity: 3,
      stress: 3,
      workload: 3,
      owi: 0,
    } as unknown as TeamAverages;
    expect(calculateOwiWeighted(input)).toBeNull();
  });

  it("applies correct weight distribution", () => {
    // energy=5(100)*0.25 + belonging=5(100)*0.20 + clarity=5(100)*0.20
    // + stress=5→inverted→0*0.20 + workload=5→inverted→0*0.15
    // = 25 + 20 + 20 + 0 + 0 = 65
    const input: TeamAverages = {
      energy: 5,
      belonging: 5,
      clarity: 5,
      stress: 5,
      workload: 5,
      owi: 0,
    };
    const result = calculateOwiWeighted(input);
    expect(result).toBe(65);
  });
});
