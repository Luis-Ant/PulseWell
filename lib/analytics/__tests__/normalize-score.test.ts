import { describe, it, expect } from "vitest";
import { normalizeScore } from "../normalize-score";

describe("normalizeScore", () => {
  describe("positive polarity", () => {
    it("maps raw 5 → 100", () => {
      expect(normalizeScore(5, "positive")).toBe(100);
    });
    it("maps raw 1 → 0", () => {
      expect(normalizeScore(1, "positive")).toBe(0);
    });
    it("maps raw 3 → 50", () => {
      expect(normalizeScore(3, "positive")).toBe(50);
    });
    it("clamps values > 5 to 5", () => {
      expect(normalizeScore(10, "positive")).toBe(100);
    });
    it("clamps values < 1 to 1", () => {
      expect(normalizeScore(0, "positive")).toBe(0);
    });
  });

  describe("negative polarity", () => {
    it("inverts raw 5 → 0 (high stress = bad)", () => {
      expect(normalizeScore(5, "negative")).toBe(0);
    });
    it("inverts raw 1 → 100 (low stress = good)", () => {
      expect(normalizeScore(1, "negative")).toBe(100);
    });
    it("inverts raw 3 → 50", () => {
      expect(normalizeScore(3, "negative")).toBe(50);
    });
  });
});
