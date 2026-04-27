export const USER_ROLE = {
  ADMIN: "admin",
  HR_ANALYST: "hr_analyst",
  MANAGER: "manager",
  EMPLOYEE: "employee",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const RISK_LEVEL = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
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
