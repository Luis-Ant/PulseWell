import { test, expect } from "@playwright/test";
import { DEMO_ACCOUNTS, loginAs } from "../helpers";

test.describe("Employee Survey", { tag: ["@critical", "@e2e", "@survey"] }, () => {
  test("Employee sees confirmation after login (seed data exists)",
    { tag: ["@SURVEY-E2E-001"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      // Seed data includes survey responses, so employee sees confirmation
      await expect(
        page.getByRole("heading", { name: "¡Gracias por responder!" })
      ).toBeVisible();
      await expect(page.getByText("Ambiente demo")).toBeVisible();
    });

  test("Confirmation shows period and privacy message",
    { tag: ["@SURVEY-E2E-002"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      await expect(
        page.getByText("Tu respuesta fue registrada")
      ).toBeVisible();
      await expect(
        page.getByText("Tus respuestas son anónimas")
      ).toBeVisible();
    });

  test("No analytics visible to employee",
    { tag: ["@SURVEY-E2E-003"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      await expect(page.getByText("OWI")).not.toBeVisible();
      await expect(page.getByText("Burnout")).not.toBeVisible();
    });
});
