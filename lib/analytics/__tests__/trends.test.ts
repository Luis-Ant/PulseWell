import { describe, it, expect } from "vitest";
import { calculateTrend, calculateProjection } from "../trends";

describe("calculateTrend", () => {
  it("returns 'improving' when delta > 2", () => {
    const result = calculateTrend(100, 95);
    expect(result.delta).toBe(5);
    expect(result.classification).toBe("improving");
  });

  it("returns 'declining' when delta < -2", () => {
    const result = calculateTrend(100, 103);
    expect(result.delta).toBe(-3);
    expect(result.classification).toBe("declining");
  });

  it("returns 'stable' when delta is -1 (within ±2)", () => {
    const result = calculateTrend(100, 99);
    expect(result.delta).toBe(1);
    expect(result.classification).toBe("stable");
  });

  it("returns 'stable' when delta is 2 (within ±2)", () => {
    const result = calculateTrend(100, 102);
    expect(result.delta).toBe(-2);
    expect(result.classification).toBe("stable");
  });

  it("returns 'stable' when delta is exactly 0", () => {
    const result = calculateTrend(50, 50);
    expect(result.delta).toBe(0);
    expect(result.classification).toBe("stable");
  });

  it("returns 'stable' when delta is exactly 2 (boundary)", () => {
    const result = calculateTrend(102, 100);
    expect(result.delta).toBe(2);
    expect(result.classification).toBe("stable");
  });

  it("returns 'improving' when delta is exactly 2.01", () => {
    const result = calculateTrend(102.01, 100);
    expect(result.delta).toBe(2.01);
    expect(result.classification).toBe("improving");
  });
});

describe("calculateProjection", () => {
  it("returns projected value for [50, 60, 70] (linear)", () => {
    const result = calculateProjection([50, 60, 70]);
    expect(result).toBe(80);
  });

  it("returns null for only 1 data point", () => {
    expect(calculateProjection([50])).toBeNull();
  });

  it("returns null for empty array", () => {
    expect(calculateProjection([])).toBeNull();
  });

  it("returns projected value for [40, 60] (2 points)", () => {
    // slope = (60-40)/(1-0.5) = 20/0.5 = 40, actually let's compute:
    // n=2, xs=[0,1], meanX=0.5, meanY=50
    // num = (0-0.5)*(40-50) + (1-0.5)*(60-50) = (-0.5)*(-10) + 0.5*10 = 5+5 = 10
    // den = 0.25+0.25 = 0.5
    // slope = 10/0.5 = 20
    // projected = 50 + 20*(2-0.5) = 50 + 30 = 80
    const result = calculateProjection([40, 60]);
    expect(result).toBe(80);
  });

  it("returns mean if all values are identical (zero slope)", () => {
    const result = calculateProjection([50, 50, 50]);
    expect(result).toBe(50);
  });
});
