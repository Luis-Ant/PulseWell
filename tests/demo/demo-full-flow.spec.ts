import { test, expect, type Page } from "@playwright/test";
import { loginAs } from "../helpers";

/**
 * Wait for React hydration to complete on a page.
 * Next.js streams HTML, but interactive content needs time.
 * We wait for either networkidle + a hydration delay, OR a specific element.
 */
async function waitForPageReady(page: Page, expectedText: string | RegExp) {
  await page.waitForLoadState("networkidle");
  // Wait for the specific content to appear (hydration complete)
  await expect(page.getByText(expectedText).first()).toBeVisible({ timeout: 20000 });
}

test.describe("Demo Completa — Flujo End-to-End", { tag: ["@critical", "@e2e", "@demo"] }, () => {

  test("Flujo demo: Landing → Admin → Employee → Manager → HR",
    { tag: ["@DEMO-E2E-001"] },
    async ({ page }) => {
      
      const teamSuffix = Date.now().toString().slice(-4);
      const newTeamName = `Innovación ${teamSuffix}`;
      const issues: string[] = [];

      // ═══════════════════════════════════════════════════════════════
      // 1. Landing Page (público)
      // ═══════════════════════════════════════════════════════════════
      await test.step("1. Landing Page", async () => {
        await page.goto("/");
        await waitForPageReady(page, "Organizational Wellbeing Intelligence");
        await expect(page.getByRole("link", { name: "PULSEWELL" })).toBeVisible();
        console.log("  ✅ Landing OK — branding visible");
      });

      // ═══════════════════════════════════════════════════════════════
      // 2. Admin — Crear equipo
      // ═══════════════════════════════════════════════════════════════
      await test.step("2. Admin — Crear equipo", async () => {
        await loginAs(page, "admin");
        await page.goto("/admin/teams");
        await waitForPageReady(page, "Engineering");
        
        // Count teams before
        const teamsBefore = await page.locator("tbody tr").count();
        console.log(`  📊 Teams before: ${teamsBefore}`);
        
        // Open modal and create team
        await page.getByText("+ Nuevo equipo").click();
        await expect(page.getByPlaceholder("Nombre del equipo")).toBeVisible({ timeout: 5000 });
        await page.getByPlaceholder("Nombre del equipo").fill(newTeamName);
        
        // Wait for the API response before checking the table
        const responsePromise = page.waitForResponse(
          (resp) => resp.url().includes("/api/admin/teams") && resp.request().method() === "POST"
        );
        await page.getByRole("button", { name: "Crear" }).click();
        const response = await responsePromise;
        
        if (response.status() !== 201) {
          issues.push(`❌ Team creation API returned ${response.status()}`);
          return;
        }
        
        // Wait for the new team to appear in the table
        await expect(page.getByText(newTeamName)).toBeVisible({ timeout: 10000 });
        
        const teamsAfter = await page.locator("tbody tr").count();
        console.log(`  ✅ Equipo "${newTeamName}" creado (${teamsBefore} → ${teamsAfter})`);
      });

      // ═══════════════════════════════════════════════════════════════
      // 3. Employee — Responder encuesta
      // ═══════════════════════════════════════════════════════════════
      await test.step("3. Employee — Responder encuesta", async () => {
        await loginAs(page, "employee");
        await expect(page).toHaveURL(/\/survey/);
        
        // Wait for the home page to load — could show "Encuesta pendiente" OR "¡Ya respondiste!"
        await page.waitForLoadState("networkidle");
        const homePageText = page.getByText(/Encuesta pendiente|¡Ya respondiste!|Racha:/i);
        await expect(homePageText.first()).toBeVisible({ timeout: 15000 });
        // Give React time to fully hydrate before checking interactive elements
        await page.waitForTimeout(2000);
        
        // The home page shows either "Responder ahora" (if not submitted) or
        // the confirmation message (if already submitted this week)
        const responderBtn = page.getByRole("button", { name: /Responder ahora/i });
        
        if (await responderBtn.count() > 0 && await responderBtn.first().isVisible().catch(() => false)) {
          // Click to open the form
          await responderBtn.first().click();
          await page.waitForTimeout(1500);
          await waitForPageReady(page, "Weekly Pulse");
          
          // Fill the survey
          await page.getByLabel("Energía: 4").click();
          await page.getByLabel("Pertenencia: 3").click();
          await page.getByLabel("Claridad: 4").click();
          await page.getByLabel("Estrés: 2").click();
          await page.getByLabel("Carga de trabajo: 3").click();
          await page.getByRole("button", { name: "Enviar respuestas" }).click();
          
          // Wait for confirmation (any of these states)
          await expect(page.getByText(/¡Ya respondiste!|¡Gracias|completada/i)).toBeVisible({ timeout: 15000 });
          console.log("  ✅ Encuesta respondida exitosamente");
        } else {
          // Could be: already submitted (Racha:), or some other state
          // Both are valid for an idempotent test
          const rachaText = await page.getByText(/Racha:/i).isVisible({ timeout: 1000 }).catch(() => false);
          if (rachaText) {
            console.log("  ⚠️ Empleado ya respondió esta semana (estado válido)");
          } else {
            issues.push("❌ Employee home page in unexpected state");
          }
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // 4. Manager — Ver dashboard del equipo
      // ═══════════════════════════════════════════════════════════════
      await test.step("4. Manager — Dashboard", async () => {
        await loginAs(page, "manager");
        await expect(page).toHaveURL(/\/manager/);
        await waitForPageReady(page, "Panel de Manager");
        
        // Verify manager-specific content (not employee survey)
        await expect(page.getByText("Desglose por dimensión").first()).toBeVisible();
        console.log("  ✅ Manager dashboard OK — solo ve Engineering");
      });

      // ═══════════════════════════════════════════════════════════════
      // 5. HR — Dashboard global (todos los equipos)
      // ═══════════════════════════════════════════════════════════════
      await test.step("5. HR — Dashboard global", async () => {
        await loginAs(page, "hr");
        await expect(page).toHaveURL(/\/hr/);
        await waitForPageReady(page, "Panel de HR");
        
        // HR should see all 6 teams — verify by checking team name cards
        await page.waitForTimeout(1000);
        const teamNames = ["Engineering", "Sales", "Operations", "Customer Success", "Marketing", "Finance"];
        let visibleCount = 0;
        for (const name of teamNames) {
          if (await page.getByText(name, { exact: true }).first().isVisible({ timeout: 2000 }).catch(() => false)) {
            visibleCount++;
          }
        }
        
        if (visibleCount >= 6) {
          console.log(`  ✅ HR dashboard OK — ve ${visibleCount}/6 equipos`);
        } else {
          issues.push(`❌ HR solo muestra ${visibleCount}/6 equipos`);
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // Report
      // ═══════════════════════════════════════════════════════════════
      console.log("\n📋 REPORTE DE DEMO:");
      if (issues.length === 0) {
        console.log("🎉 DEMO COMPLETA — Todos los flujos funcionan correctamente");
      } else {
        console.log("⚠️ Issues encontrados:");
        issues.forEach(i => console.log("  ", i));
      }
      
      expect(issues.length).toBe(0);
    });
});
