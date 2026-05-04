export const USER_ROLE = {
  ADMIN: "ADMIN",
  HR_ANALYST: "HR_ANALYST",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const RISK_LEVEL = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type RiskLevel = (typeof RISK_LEVEL)[keyof typeof RISK_LEVEL];

export interface PulseSurveyScore {
  energy: number;
  belonging: number;
  clarity: number;
  stress: number;
  workload: number;
}

export interface WellbeingSummary extends PulseSurveyScore {
  owi: number;
  burnoutRisk: RiskLevel;
  trend: string;
  teams: number;
}
