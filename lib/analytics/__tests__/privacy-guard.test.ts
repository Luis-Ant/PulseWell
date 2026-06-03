import { describe, it, expect } from "vitest";
import { privacyGuard } from "../privacy-guard";

describe("privacyGuard", () => {
  it("returns insufficient for 0 responses", () => {
    const result = privacyGuard(0);
    expect(result.sufficient).toBe(false);
    expect(result.message).toBe(
      "Datos insuficientes para mostrar métricas de equipo",
    );
  });

  it("returns insufficient for 4 responses (below default threshold)", () => {
    const result = privacyGuard(4);
    expect(result.sufficient).toBe(false);
    expect(result.message).toBe(
      "Datos insuficientes para mostrar métricas de equipo",
    );
  });

  it("returns sufficient for 5 responses (at default threshold)", () => {
    const result = privacyGuard(5);
    expect(result.sufficient).toBe(true);
    expect(result.message).toBe("");
  });

  it("returns sufficient for 10 responses (above threshold)", () => {
    const result = privacyGuard(10);
    expect(result.sufficient).toBe(true);
    expect(result.message).toBe("");
  });

  it("respects custom threshold (3)", () => {
    const result = privacyGuard(3, 3);
    expect(result.sufficient).toBe(true);
  });

  it("returns insufficient with custom threshold (3 of 5)", () => {
    const result = privacyGuard(3, 5);
    expect(result.sufficient).toBe(false);
  });

  it("includes responseCount in result", () => {
    const result = privacyGuard(7);
    expect(result.responseCount).toBe(7);
  });
});
