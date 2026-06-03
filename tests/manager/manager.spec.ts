import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

test.describe("Manager Dashboard", { tag: ["@critical", "@e2e", "@manager"] }, () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "manager");
  });

  test("Shows manager heading",
    { tag: ["@MGR-E2E-001"] },
    async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "Panel de Manager" })
      ).toBeVisible();
    });

  test("Shows OWI and trend chart",
    { tag: ["@MGR-E2E-002"] },
    async ({ page }) => {
      await expect(
        page.getByText("Tendencia de OWI por Equipo")
      ).toBeVisible();
    });

  test("Shows risk badges section",
    { tag: ["@MGR-E2E-003"] },
    async ({ page }) => {
      await expect(page.getByText("Riesgos:")).toBeVisible();
    });

  test("Does NOT show other teams",
    { tag: ["@MGR-E2E-005"] },
    async ({ page }) => {
      // Other team names should NOT appear as section headings
      const headingTexts = await page.getByRole("heading").allTextContents();
      const otherTeams = headingTexts.filter(t =>
        t === "Sales" || t === "Operations" || t === "Customer Success"
      );
      expect(otherTeams.length).toBe(0);
    });

  test("Shows privacy footer",
    { tag: ["@MGR-E2E-006"] },
    async ({ page }) => {
      await expect(
        page.getByText("Respuestas individuales nunca se comparten", { exact: false })
      ).toBeVisible();
    });
});
