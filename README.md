# PulseWell

> **Academic SaaS prototype** focused on organizational wellbeing intelligence.
> Built as a personal academic project to explore how a professional-grade SaaS can be designed with scalable architecture, clear responsibility boundaries, privacy-first analytics, and AI-assisted development workflows.

[Live demo](https://pulse-well.vercel.app/) · [Getting started](#getting-started) · [Architecture](#architecture) · [Roadmap](#roadmap)

---

## Overview

PulseWell is a simulated B2B SaaS platform for aggregated employee wellbeing analytics. It helps leadership teams understand organizational health through team-level indicators, early risk signals, alerts, and action-oriented recommendations.

The project was not designed only as a functional MVP. Its goal was to practice building a product with professional engineering criteria: modular boundaries, strict typing, role-based access, server-side business rules, testable logic, and a foundation that could evolve into a larger product.

> **Status:** MVP completed — June 2026. Functional prototype with simulated data.
> **Current deployment:** <https://pulse-well.vercel.app/>
> **Next step:** controlled pilot with real-world validation and production-hardening work.

---

## Academic Purpose

PulseWell was developed as a personal academic project with three main objectives:

| Objective | Purpose |
|-----------|---------|
| Product thinking | Model a realistic SaaS product around organizational wellbeing, privacy, and decision support. |
| Software architecture | Apply separation of responsibilities, domain-focused modules, reusable components, and scalable data modeling. |
| AI-assisted delivery | Accelerate implementation with agentic AI while maintaining human technical direction, review, and validation. |

The project explores how modern software teams can combine traditional engineering discipline with AI-assisted workflows without treating AI as a replacement for architecture, product judgment, or testing.

---

## Product Vision

PulseWell focuses on a common organizational problem: companies often react to burnout, disengagement, or attrition risk too late. The platform proposes a preventive approach by aggregating wellbeing signals into readable, leadership-oriented insights.

Core product principles:

- **Privacy-first analytics:** individual employee responses are never exposed in dashboards.
- **Aggregated decision support:** metrics are shown at team and organizational levels.
- **Early risk detection:** alerts highlight teams that may need attention before problems escalate.
- **Actionable recommendations:** each alert can generate suggested leadership actions.
- **Executive readability:** dashboards are designed for quick interpretation, not raw data inspection.

---

## Live Demo

The project is deployed on Vercel:

**https://pulse-well.vercel.app/**

Use the demo accounts below to explore the different role-based dashboards.

---

## Demo Credentials

All accounts use password: **`Demo1234!`**

| Email | Role | Scope |
|-------|------|-------|
| `admin@pulsewell.demo` | Admin | Full system access |
| `hr@pulsewell.demo` | HR Analyst | Global dashboards and alerts |
| `manager-eng@pulsewell.demo` | Manager | Engineering team — high-risk narrative |
| `manager-sales@pulsewell.demo` | Manager | Sales team — declining trend |
| `manager-ops@pulsewell.demo` | Manager | Operations team — healthy reference |
| `manager-cs@pulsewell.demo` | Manager | Customer Success — recovering trend |

---

## Features

### Analytics and wellbeing intelligence

- [x] **OWI (Organizational Wellbeing Index)** — weighted formula: `energy×0.25 + belonging×0.20 + clarity×0.20 + stress×0.20 + workload×0.15`, normalized to 0–100
- [x] Burnout risk detection per team
- [x] Attrition risk estimation per team
- [x] Productivity health scoring
- [x] OWI trend charts with a 4-period window
- [x] OWI projection simulation using linear regression on historical data

### Leadership workflows

- [x] Role-based dashboards for Admin, HR Analyst, Manager, and Employee
- [x] Smart Alerts ordered by severity: CRITICAL → LOW
- [x] Recommendation engine with generated actions per alert
- [x] Executive insight banner at the top of dashboards
- [x] Positive empty states for alerts and recommendations
- [x] Loading skeletons aligned with dashboard layouts

### Privacy and access control

- [x] Custom RBAC on top of Supabase Auth
- [x] Aggregated-only dashboard views
- [x] Minimum response threshold to avoid exposing individual responses
- [x] Simulated data only — no real employee information

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 — App Router |
| Language | TypeScript — strict mode |
| UI | React 19, Tailwind CSS 4 |
| Components | shadcn/ui, Radix UI primitives |
| ORM | Prisma 7 |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth + custom RBAC |
| Charts | Recharts |
| Runtime / Package Manager | Bun |
| Testing | Vitest, Playwright |
| Deployment | Vercel |

---

## Architecture

PulseWell follows a responsibility-oriented structure. The goal is to keep routing, UI, authentication, analytics, alert generation, and persistence concerns separated enough to support future growth.

```text
app/
├── (auth)/          # Login, signup, auth callback
├── (protected)/
│   ├── admin/       # Admin dashboard
│   ├── employee/    # Pulse survey experience
│   ├── hr/          # HR analytics dashboard
│   └── manager/     # Team-level manager dashboard
├── api/             # REST endpoints for OWI, trends, alerts, and scenarios
└── layout.tsx       # Root layout with providers

lib/
├── analytics/       # OWI engine, projections, trends, and shared analytics logic
├── auth/            # RBAC middleware and user resolution helpers
├── alerts/          # Smart alert and recommendation generation
├── dashboard/       # Dashboard queries and aggregation helpers
└── prisma.ts        # Singleton Prisma client

components/
├── dashboard/       # MetricCard, TeamGrid, TrendChart, AlertCard, RecommendationCard
└── ui/              # Shared shadcn/ui primitives

prisma/
└── schema.prisma    # Organization, Team, User, WellbeingScore, SmartAlert, Recommendation
```

### Architectural decisions

| Area | Decision |
|------|----------|
| Routing | Next.js App Router route groups separate public, auth, and protected experiences. |
| Business logic | Analytics, alerts, and dashboard aggregation live outside UI components. |
| Authorization | Access rules are centralized through role-based helpers instead of being scattered across pages. |
| Data model | The schema models organizations, teams, users, wellbeing scores, alerts, and recommendations as separate concepts. |
| Privacy | Dashboards rely on aggregated team-level metrics and avoid exposing individual wellbeing data. |
| Testing | Core business logic is covered with Vitest; end-to-end behavior can be validated with Playwright. |

### Analytics engine

The OWI engine computes wellbeing indicators from survey dimension scores. Alerts and recommendations are generated server-side by evaluating team metrics against configurable thresholds. This keeps the product behavior deterministic, testable, and independent from the presentation layer.

---

## AI-Assisted Development and Harness

PulseWell was developed with an agentic AI workflow as an acceleration layer. AI was used to support planning, implementation, refactoring, documentation, debugging, and verification, while the human developer remained responsible for architectural direction and final decisions.

The project also used an AI Harness approach: structured prompts, scoped tasks, persistent memory, verification steps, and review-oriented workflows to reduce uncontrolled AI output.

| Practice | Purpose |
|----------|---------|
| Spec-driven planning | Break changes into proposals, specs, designs, and tasks before implementation. |
| Agentic implementation | Delegate bounded implementation work while preserving architectural intent. |
| Persistent memory | Keep track of decisions, bug fixes, gotchas, and project conventions across sessions. |
| Verification loops | Use tests, scenario checks, and review passes to validate AI-assisted changes. |
| Review workload control | Keep changes reviewable and avoid oversized implementation batches. |

This approach reflects the main engineering lesson of the project: AI can accelerate delivery, but it works best when constrained by clear architecture, explicit tasks, and validation gates.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- A [Supabase](https://supabase.com) project with PostgreSQL

### Setup

```bash
git clone <repo-url> && cd pulsewell
cp .env.example .env
bun install
bunx prisma migrate dev
bun seed:reset
bun dev
```

The local application runs at:

```text
http://localhost:3000
```

### Environment Variables

See `.env.example`. Required values:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

---

## Scripts

| Command | What it does |
|---------|--------------|
| `bun dev` | Start the Next.js dev server |
| `bun build` | Create a production build |
| `bun lint` | Run ESLint |
| `bun test` | Run unit tests with Vitest |
| `bun test:e2e` | Reset demo data and run Playwright tests |
| `bun seed` | Seed demo data with upsert-safe data |
| `bun seed:reset` | Reset the database and re-seed demo data |
| `bun verify:scenarios` | Run scenario verification |

---

## Project Structure

```text
pulsewell/
├── app/                  # Next.js App Router routes and route groups
├── components/           # Shared UI and dashboard components
├── lib/                  # Business logic, analytics, auth, dashboard helpers
├── prisma/               # Schema and migrations
├── scripts/              # Seed and scenario verification scripts
├── public/               # Static assets
├── tests/                # Unit and E2E tests
├── .env.example          # Environment variable template
├── package.json          # Dependencies and scripts
└── bun.lock              # Bun lockfile
```

---

## Roadmap

The MVP demonstrates the core product and technical foundation. Future work would focus on moving from academic prototype to production-ready SaaS.

- [ ] Replace simulated data with a controlled real-data pilot
- [ ] Add organization onboarding and tenant provisioning flows
- [ ] Expand survey configuration and scheduling
- [ ] Improve alert threshold configuration per organization
- [ ] Add exportable reports for leadership teams
- [ ] Harden observability, logging, and production monitoring
- [ ] Add more complete automated test coverage for critical flows
- [ ] Strengthen compliance review around privacy and sensitive wellbeing data

---

## Disclaimer

PulseWell is an **academic MVP / prototype** for product validation and technical demonstration.

- It uses **simulated data** only.
- It is **not a clinical tool** and does not diagnose medical or psychological conditions.
- It should **not** be used to evaluate individual employee mental health.
- It aggregates metrics at team level; individual responses are never exposed in dashboards.
- Any production version would require deeper legal, privacy, compliance, and organizational ethics review.
