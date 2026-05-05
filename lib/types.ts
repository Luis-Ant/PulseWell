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
  CRITICAL: "CRITICAL",
} as const;

export type RiskLevel = (typeof RISK_LEVEL)[keyof typeof RISK_LEVEL];

export interface PulseSurveyScore {
  energy: number;
  belonging: number;
  clarity: number;
  stress: number;
  workload: number;
}

// ── Analytics Engine Types ──

export interface TeamAverages extends PulseSurveyScore {
  owi: number;
}

export interface TeamMetrics {
  teamId: string;
  teamName: string;
  owi: number;
  burnoutRisk: RiskLevel;
  attritionRisk: RiskLevel;
  productivityHealth: RiskLevel;
  responseCount: number;
  period: string;
  insufficientData: boolean;
}

export type TrendClassification = "improving" | "declining" | "stable";

export interface OwiStatus {
  owi: number;
  trend: TrendClassification;
  delta: number;
  projectedOwi: number | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PrivacyGuardResult {
  sufficient: boolean;
  responseCount: number;
  message: string;
  code: string;
}

// ── Dashboard Summaries ──

export interface WellbeingSummary extends PulseSurveyScore {
  owi: number;
  burnoutRisk: RiskLevel;
  attritionRisk: RiskLevel;
  trend: TrendClassification;
  teams: number;
}

// ── API DTOs ──

export interface AlertDto {
  alertId: string;
  teamId: string;
  teamName: string;
  type: string;
  severity: string;
  message: string;
  description: string;
  triggeredAt: string;
  resolvedAt: string | null;
  isActive: boolean;
}

export interface RecommendationDto {
  recommendationId: string;
  alertId: string | null;
  teamId: string;
  teamName: string;
  type: string;
  title: string;
  description: string;
  actionableSteps: string[];
  createdAt: string;
}
