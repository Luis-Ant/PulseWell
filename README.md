# PulseWell

> 🚀 **MVP Completado** — Junio 2026. Prototipo funcional con datos simulados.  
> **Próximo paso**: Piloto controlado con datos reales (ver [Roadmap](#roadmap)).

> **Organizational Wellbeing Intelligence** — SaaS MVP for aggregated wellbeing analytics, early risk detection, and actionable leadership insights.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS 4 |
| Components | shadcn/ui |
| ORM | Prisma 7 |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth + custom RBAC |
| Charts | Recharts |
| Runtime / PM | Bun |
| Testing | Vitest |

---

## Features

- [x] Role-based dashboards (Admin, HR Analyst, Manager, Employee)
- [x] **OWI (Organizational Wellbeing Index)** — weighted formula: `energy×0.25 + belonging×0.20 + clarity×0.20 + stress×0.20 + workload×0.15`, normalized to 0–100
- [x] Burnout risk detection per team
- [x] Attrition risk estimation per team
- [x] Productivity health scoring
- [x] OWI trend charts (4-period window)
- [x] **Smart Alerts** — severity-ordered: CRITICAL → LOW
- [x] **Recommendation engine** — auto-generated actions per alert
- [x] Executive insight banner (dashboard top)
- [x] Positive empty states (alerts & recommendations)
- [x] Loading skeleton matching layout
- [x] Privacy-first: no individual data exposed, minimum response threshold, aggregated-only views
- [x] OWI projection simulation (linear regression on history)

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) >= 1.0
- A [Supabase](https://supabase.com) project (PostgreSQL)

### Setup

```bash
git clone <repo-url> && cd pulsewell
cp .env.example .env     # fill in Supabase + DB credentials
bun install               # installs deps + generates Prisma client
bunx prisma migrate dev   # apply schema to DB
bun seed:reset            # seed demo data (idempotent)
bun dev                   # http://localhost:3000
```

### Environment Variables

See `.env.example` — requires `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`.

---

## Demo Credentials

All accounts use password: **`Demo1234!`**

| Email | Role | Scope |
|-------|------|-------|
| `admin@pulsewell.demo` | Admin | Full system access |
| `hr@pulsewell.demo` | HR Analyst | Global dashboards & alerts |
| `manager-eng@pulsewell.demo` | Manager | Engineering team (high-risk narrative) |
| `manager-sales@pulsewell.demo` | Manager | Sales team (declining trend) |
| `manager-ops@pulsewell.demo` | Manager | Operations team (healthy reference) |
| `manager-cs@pulsewell.demo` | Manager | Customer Success (recovering) |

---

## Scripts

| Command | What it does |
|---------|-------------|
| `bun dev` | Start Next.js dev server |
| `bun build` | Production build |
| `bun lint` | ESLint (next/core-web-vitals) |
| `bun test` | Vitest — 75 tests |
| `bun seed` | Seed demo data (upsert-safe) |
| `bun seed:reset` | Reset DB + re-seed |
| `bun verify:scenarios` | Run scenario verification |

---

## Architecture

```
app/
├── (auth)/          # Login, signup, auth callback
├── (protected)/
│   ├── admin/       # Admin dashboard
│   ├── employee/    # Pulse survey
│   ├── hr/          # HR analytics dashboard ← main deliverable
│   └── manager/     # Team-level view
├── api/             # REST endpoints (OWI, trends, alerts)
└── layout.tsx       # Root layout with providers

lib/
├── analytics/       # OWI engine, projections, trends
├── auth/            # RBAC middleware, getUser
├── alerts/          # Smart alert + recommendation generation
└── prisma.ts        # Singleton Prisma client

components/
└── dashboard/       # MetricCard, TeamGrid, TrendChart, AlertCard, RecommendationCard

prisma/
└── schema.prisma    # Org → Team → User, WellbeingScore, SmartAlert, Recommendation
```

**Analytics engine**: OWI is computed in `lib/analytics/` from survey dimension scores using the weighted formula above. Alerts and recommendations are generated server-side during seed (`scripts/seed.ts`) by evaluating team metrics against configurable thresholds.

---

## Project Structure

```
pulsewell/
├── app/                  # Next.js App Router (route groups)
├── components/           # Shared UI components
├── lib/                  # Business logic, analytics, auth
├── prisma/               # Schema & migrations
├── scripts/              # Seed, scenario verification
├── public/               # Static assets
├── .env.example          # Env var template
├── package.json          # Dependencies & scripts
└── bun.lock              # Bun lockfile
```

---

## Disclaimer

PulseWell is an **MVP / prototype** for product validation and technical demonstration. It:

- Uses **simulated data** — no real employee information
- Is **not a clinical tool** — does not diagnose medical or psychological conditions
- Should **not** be used to evaluate individual employee mental health
- Aggregates all metrics at team level — individual responses are never exposed
