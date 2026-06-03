import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

test.describe("Employee Survey", { tag: ["@critical", "@e2e", "@survey"] }, () => {
  test("Employee sees survey form with heading",
    { tag: ["@SURVEY-E2E-001"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      // surveyName is "Weekly Pulse Q2 2026"
      await expect(
        page.getByRole("heading", { name: "Weekly Pulse" })
      ).toBeVisible();
      await expect(page.getByText("Período:")).toBeVisible();
    });

  test("Shows all 5 questions with labels",
    { tag: ["@SURVEY-E2E-002"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      // Labels use full question text — use partial match with text content
      await expect(page.getByText("¿Cómo calificarías tu nivel de energía")).toBeVisible();
      await expect(page.getByText("¿Qué tan conectado te sentís con tu equipo")).toBeVisible();
      await expect(page.getByText("¿Qué tan claros están los objetivos")).toBeVisible();
      await expect(page.getByText("¿Qué nivel de estrés sentiste")).toBeVisible();
      await expect(page.getByText("¿Qué tan manejable fue tu carga")).toBeVisible();
    });

  test("Shows privacy message on form",
    { tag: ["@SURVEY-E2E-003"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      await expect(page.getByText("Ambiente demo")).toBeVisible();
    });

  test("Shows submit button",
    { tag: ["@SURVEY-E2E-004"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      await expect(
        page.getByRole("button", { name: "Enviar respuestas" })
      ).toBeVisible();
    });

  test("Shows validation error when submitting empty",
    { tag: ["@SURVEY-E2E-005"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      await page.getByRole("button", { name: "Enviar respuestas" }).click();
      // Client-side validation shows per-field errors — wait for first one
      await expect(
        page.locator("text=Seleccioná un valor para esta pregunta").first()
      ).toBeVisible({ timeout: 5000 });
    });

  test("Can submit survey and see confirmation",
    { tag: ["@SURVEY-E2E-006"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      // Click score 3 for each question using aria-labels
      const ariaLabels = [
        "Energía: 3",
        "Pertenencia: 3",
        "Claridad: 3",
        "Estrés: 3",
        "Carga de trabajo: 3",
      ];
      for (const label of ariaLabels) {
        await page.getByLabel(label).click();
      }
      await page.getByRole("button", { name: "Enviar respuestas" }).click();
      // Should see confirmation
      await expect(
        page.getByText("¡Gracias por responder!")
      ).toBeVisible({ timeout: 15000 });
      await expect(
        page.getByText("Tu respuesta fue registrada")
      ).toBeVisible();
    });

  test("No analytics visible to employee",
    { tag: ["@SURVEY-E2E-007"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      await expect(page.getByText("OWI")).not.toBeVisible();
    });
});
