import type { UserRole } from "@/lib/types";
import { USER_ROLE } from "@/lib/types";

// ── Constants ─────────────────────────────────────────────────────

export const VALID_ROLES: readonly UserRole[] = [
  USER_ROLE.ADMIN,
  USER_ROLE.HR_ANALYST,
  USER_ROLE.MANAGER,
  USER_ROLE.EMPLOYEE,
] as const;

// ── Validation types ───────────────────────────────────────────────

export interface ValidationError {
  code: string;
  message: string;
}

export interface ValidatedName {
  value: string;
}

export interface ValidatedRole {
  value: UserRole;
}

// ── Validators ─────────────────────────────────────────────────────

export function validateName(name: unknown): ValidatedName | ValidationError {
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return { code: "VALIDATION", message: "El nombre es requerido." };
  }
  return { value: name.trim() };
}

export function validateRole(role: unknown): ValidatedRole | ValidationError {
  if (typeof role !== "string" || !VALID_ROLES.includes(role as UserRole)) {
    return { code: "VALIDATION", message: "Rol inválido." };
  }
  return { value: role as UserRole };
}

export function validateEmail(email: unknown): ValidatedName | ValidationError {
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    return { code: "VALIDATION", message: "El email es requerido." };
  }
  const trimmed = email.trim().toLowerCase();
  // Basic email shape check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { code: "VALIDATION", message: "El formato del email no es válido." };
  }
  return { value: trimmed };
}

export function validateRequired(
  value: unknown,
  fieldName: string,
): ValidatedName | ValidationError {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    return { code: "VALIDATION", message: `${fieldName} es requerido.` };
  }
  return { value: value.trim() };
}
