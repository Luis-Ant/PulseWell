import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

test.describe("HR Dashboard", { tag: ["@critical", "@e2e", "@hr"] }, () => {
  test.describe.configure({ timeout: 60000 });

  test.beforeEach(async ({ page }) => {
    await loginAs(page, "hr");
    // Wait for data to finish loading — HR dashboard fetches from DB
    await page.waitForLoadState("networkidle");
    // Extra wait for charts to render
    await page.waitForTimeout(2000);
  });

  test("Shows all 4 global metric cards",
    { tag: ["@HR-E2E-001"] },
    async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Panel de HR" })
      ).toBeVisible();
      await expect(
        page.getByText("OWI Global")
      ).toBeVisible();
      // "Equipos" appears multiple times — use heading
      await expect(
        page.getByRole("heading", { name: "Equipos" })
      ).toBeVisible();
      await expect(
        page.getByText("Alertas Activas").first()
      ).toBeVisible();
      await expect(
        page.getByText("OWI Proyectado").first()
      ).toBeVisible();
    });

  test("Shows team grid section",
    { tag: ["@HR-E2E-003"] },
    async ({ page }) => {
      // Team grid section header
      await expect(
        page.locator("section").filter({ hasText: "Equipos" }).first()
      ).toBeVisible();
    });

  test("Shows trend chart section",
    { tag: ["@HR-E2E-004"] },
    async ({ page }) => {
      // Trend chart loads Recharts — needs extra time
      await expect(
        page.getByText("Tendencia de OWI por Equipo")
      ).toBeVisible({ timeout: 15000 });
    });

  test("Shows active alerts section",
    { tag: ["@HR-E2E-005"] },
    async ({ page }) => {
      // Data-heavy page — alerts load from DB, need extra time
      await expect(
        page.getByRole("heading", { name: /Alertas/ })
      ).toBeVisible({ timeout: 20000 });
    });

  test("Shows recommendations section",
    { tag: ["@HR-E2E-006"] },
    async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /Recomendaciones/ })
      ).toBeVisible();
    });

  test("Privacy message visible",
    { tag: ["@HR-E2E-007"] },
    async ({ page }) => {
      await expect(
        page.getByText("privacidad individual")
      ).toBeVisible();
    });

  test("No individual data exposed",
    { tag: ["@HR-E2E-008"] },
    async ({ page }) => {
      await expect(page.getByText("@pulsewell.demo")).not.toBeVisible();
    });
});
