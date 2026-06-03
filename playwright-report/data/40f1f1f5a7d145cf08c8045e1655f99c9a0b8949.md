# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hr/hr.spec.ts >> HR Dashboard >> Shows trend chart section
- Location: tests/hr/hr.spec.ts:45:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Tendencia de OWI por Equipo')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByText('Tendencia de OWI por Equipo')

```

```yaml
- alert: PulseWell
- main:
  - heading "PULSEWELL" [level=1]
  - paragraph: Iniciá sesión para acceder al panel
  - text: Email
  - textbox "Email":
    - /placeholder: hr@pulsewell.demo
  - text: Contraseña
  - textbox "Contraseña":
    - /placeholder: ••••••••
  - button "Iniciar sesión"
  - paragraph: "Credenciales demo:"
  - text: admin@pulsewell.demo / Demo1234! (ADMIN) hr@pulsewell.demo / Demo1234! (HR_ANALYST) manager-eng@pulsewell.demo / Demo1234! (MANAGER) employee1-eng@pulsewell.demo / Demo1234! (EMPLOYEE)
  - paragraph: Ambiente demo. Los datos utilizados son simulados, anonimizados o sintéticos. Tus respuestas son privadas. Nunca se comparten de forma individual.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { loginAs } from "../helpers";
  3  | 
  4  | test.describe("HR Dashboard", { tag: ["@critical", "@e2e", "@hr"] }, () => {
  5  |   test.describe.configure({ timeout: 60000 });
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await loginAs(page, "hr");
  9  |     // Wait for data to finish loading — HR dashboard fetches from DB
  10 |     await page.waitForLoadState("networkidle");
  11 |     // Extra wait for charts to render
  12 |     await page.waitForTimeout(2000);
  13 |   });
  14 | 
  15 |   test("Shows all 4 global metric cards",
  16 |     { tag: ["@HR-E2E-001"] },
  17 |     async ({ page }) => {
  18 |       await expect(
  19 |         page.getByRole("heading", { name: "Panel de HR" })
  20 |       ).toBeVisible();
  21 |       await expect(
  22 |         page.getByText("OWI Global")
  23 |       ).toBeVisible();
  24 |       // "Equipos" appears multiple times — use heading
  25 |       await expect(
  26 |         page.getByRole("heading", { name: "Equipos" })
  27 |       ).toBeVisible();
  28 |       await expect(
  29 |         page.getByText("Alertas Activas").first()
  30 |       ).toBeVisible();
  31 |       await expect(
  32 |         page.getByText("OWI Proyectado").first()
  33 |       ).toBeVisible();
  34 |     });
  35 | 
  36 |   test("Shows team grid section",
  37 |     { tag: ["@HR-E2E-003"] },
  38 |     async ({ page }) => {
  39 |       // Team grid section header
  40 |       await expect(
  41 |         page.locator("section").filter({ hasText: "Equipos" }).first()
  42 |       ).toBeVisible();
  43 |     });
  44 | 
  45 |   test("Shows trend chart section",
  46 |     { tag: ["@HR-E2E-004"] },
  47 |     async ({ page }) => {
  48 |       // Trend chart loads Recharts — needs extra time
  49 |       await expect(
  50 |         page.getByText("Tendencia de OWI por Equipo")
> 51 |       ).toBeVisible({ timeout: 15000 });
     |         ^ Error: expect(locator).toBeVisible() failed
  52 |     });
  53 | 
  54 |   test("Shows active alerts section",
  55 |     { tag: ["@HR-E2E-005"] },
  56 |     async ({ page }) => {
  57 |       // Data-heavy page — alerts load from DB, need extra time
  58 |       await expect(
  59 |         page.getByRole("heading", { name: /Alertas/ })
  60 |       ).toBeVisible({ timeout: 20000 });
  61 |     });
  62 | 
  63 |   test("Shows recommendations section",
  64 |     { tag: ["@HR-E2E-006"] },
  65 |     async ({ page }) => {
  66 |       await expect(
  67 |         page.getByRole("heading", { name: /Recomendaciones/ })
  68 |       ).toBeVisible();
  69 |     });
  70 | 
  71 |   test("Privacy message visible",
  72 |     { tag: ["@HR-E2E-007"] },
  73 |     async ({ page }) => {
  74 |       await expect(
  75 |         page.getByText("privacidad individual")
  76 |       ).toBeVisible();
  77 |     });
  78 | 
  79 |   test("No individual data exposed",
  80 |     { tag: ["@HR-E2E-008"] },
  81 |     async ({ page }) => {
  82 |       await expect(page.getByText("@pulsewell.demo")).not.toBeVisible();
  83 |     });
  84 | });
  85 | 
```