import { describe, it, expect } from "vitest";
import {
  validateName,
  validateRole,
  validateEmail,
  validateRequired,
  VALID_ROLES,
} from "@/lib/admin/validation";

describe("validateName", () => {
  it("returns value for valid name", () => {
    const result = validateName("  Test Team  ");
    expect(result).toEqual({ value: "Test Team" });
  });

  it("returns error for empty string", () => {
    const result = validateName("");
    expect(result).toHaveProperty("code", "VALIDATION");
    expect(result).toHaveProperty("message", "El nombre es requerido.");
  });

  it("returns error for whitespace-only string", () => {
    const result = validateName("   ");
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("returns error for null", () => {
    const result = validateName(null);
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("returns error for undefined", () => {
    const result = validateName(undefined);
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("returns error for non-string", () => {
    const result = validateName(123);
    expect(result).toHaveProperty("code", "VALIDATION");
  });
});

describe("validateRole", () => {
  it("accepts all valid roles", () => {
    for (const role of VALID_ROLES) {
      const result = validateRole(role);
      expect(result).toEqual({ value: role });
    }
  });

  it("rejects invalid role", () => {
    const result = validateRole("SUPER_ADMIN");
    expect(result).toHaveProperty("code", "VALIDATION");
    expect(result).toHaveProperty("message", "Rol inválido.");
  });

  it("rejects empty string", () => {
    const result = validateRole("");
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("rejects null", () => {
    const result = validateRole(null);
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("rejects non-string", () => {
    const result = validateRole(42);
    expect(result).toHaveProperty("code", "VALIDATION");
  });
});

describe("validateEmail", () => {
  it("returns trimmed lowercase value for valid email", () => {
    const result = validateEmail("  User@Example.COM  ");
    expect(result).toEqual({ value: "user@example.com" });
  });

  it("rejects empty string", () => {
    const result = validateEmail("");
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("rejects null", () => {
    const result = validateEmail(null);
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("rejects invalid format (no @)", () => {
    const result = validateEmail("notanemail");
    expect(result).toHaveProperty("code", "VALIDATION");
    expect(result).toHaveProperty("message", "El formato del email no es válido.");
  });

  it("rejects invalid format (no domain)", () => {
    const result = validateEmail("user@");
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("rejects invalid format (no user)", () => {
    const result = validateEmail("@domain.com");
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("rejects email with spaces", () => {
    const result = validateEmail("user name@domain.com");
    expect(result).toHaveProperty("code", "VALIDATION");
  });
});

describe("validateRequired", () => {
  it("returns trimmed value for valid string", () => {
    const result = validateRequired("  Hello  ", "Nombre");
    expect(result).toEqual({ value: "Hello" });
  });

  it("returns error with field name for empty string", () => {
    const result = validateRequired("", "Campo X");
    expect(result).toHaveProperty("code", "VALIDATION");
    expect(result).toHaveProperty("message", "Campo X es requerido.");
  });

  it("returns error for null", () => {
    const result = validateRequired(null, "Edad");
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("returns error for undefined", () => {
    const result = validateRequired(undefined, "Email");
    expect(result).toHaveProperty("code", "VALIDATION");
  });

  it("returns error for non-string", () => {
    const result = validateRequired(42, "Número");
    expect(result).toHaveProperty("code", "VALIDATION");
  });
});

describe("VALID_ROLES", () => {
  it("contains exactly 4 roles", () => {
    expect(VALID_ROLES).toHaveLength(4);
  });

  it("is readonly", () => {
    expect(VALID_ROLES).toContain("ADMIN");
    expect(VALID_ROLES).toContain("HR_ANALYST");
    expect(VALID_ROLES).toContain("MANAGER");
    expect(VALID_ROLES).toContain("EMPLOYEE");
  });
});
