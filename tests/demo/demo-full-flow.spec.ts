import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

test.describe("Demo Completa — Flujo End-to-End", { tag: ["@critical", "@e2e", "@demo"] }, () => {

  test("Flujo demo: Landing → Admin → Employee → Manager → HR",
    { tag: ["@DEMO-E2E-001"] },
    async ({ page }) => {
      
      const teamSuffix = Date.now().toString().slice(-4);
      const newTeamName = `Innovación ${teamSuffix}`;
      let issues: string[] = [];

      // ═══════════════════════════════════════════════════════════════
      // 1. Landing Page
      // ═══════════════════════════════════════════════════════════════
      await test.step("1. Landing Page", async () => {
        await page.goto("/");
        await expect(page.getByRole("link", { name: "PULSEWELL" })).toBeVisible();
        await expect(page.getByText("Organizational Wellbeing Intelligence").first()).toBeVisible();
        
        // Check roadmap section
        const roadmap = page.locator("#roadmap");
        if (await roadmap.isVisible().catch(() => false)) {
          console.log("  ✅ Landing OK — branding + roadmap");
        } else {
          issues.push("⚠️ Roadmap section not visible on landing");
          console.log("  ⚠️ Roadmap not visible");
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // 2. Admin — Crear equipo
      // ═══════════════════════════════════════════════════════════════
      await test.step("2. Admin — Crear equipo", async () => {
        await loginAs(page, "admin");
        await page.goto("/admin/teams");
        await page.waitForLoadState("networkidle");
        
        // Verify sidebar visible
        await expect(page.locator("aside")).toBeVisible();
        
        // Create team
        await page.getByText("+ Nuevo equipo").click();
        await page.waitForTimeout(300);
        await page.getByPlaceholder("Nombre del equipo").fill(newTeamName);
        await page.getByRole("button", { name: "Crear" }).click();
        await page.waitForTimeout(1000);
        
        if (await page.getByText(newTeamName).isVisible().catch(() => false)) {
          console.log(`  ✅ Equipo "${newTeamName}" creado`);
        } else {
          issues.push(`❌ Equipo "${newTeamName}" no aparece en la tabla`);
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // 3. Employee — Responder encuesta
      // ═══════════════════════════════════════════════════════════════
      await test.step("3. Employee — Responder encuesta", async () => {
        await loginAs(page, "employee");
        await expect(page).toHaveURL(/\/survey/);
        
        // Check if form or confirmation
        const heading = page.getByRole("heading", { name: "Weekly Pulse" });
        const confirmHeading = page.getByText("¡Gracias por responder!");
        
        if (await heading.isVisible({ timeout: 3000 }).catch(() => false)) {
          await page.getByLabel("Energía: 4").click();
          await page.getByLabel("Pertenencia: 3").click();
          await page.getByLabel("Claridad: 4").click();
          await page.getByLabel("Estrés: 2").click();
          await page.getByLabel("Carga de trabajo: 3").click();
          await page.getByRole("button", { name: "Enviar respuestas" }).click();
          await expect(page.getByText("¡Gracias por responder!")).toBeVisible({ timeout: 15000 });
          console.log("  ✅ Encuesta respondida exitosamente");
        } else if (await confirmHeading.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log("  ⚠️ Empleado ya respondió esta semana");
        } else {
          issues.push("❌ Employee survey page not working");
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // 4. Manager — Ver dashboard del equipo
      // ═══════════════════════════════════════════════════════════════
      await test.step("4. Manager — Dashboard", async () => {
        await loginAs(page, "manager");
        await expect(page).toHaveURL(/\/manager/);
        
        const mgrHeading = page.getByRole("heading", { name: "Panel de Manager" });
        if (await mgrHeading.isVisible({ timeout: 15000 }).catch(() => false)) {
          console.log("  ✅ Manager dashboard cargado");
        } else {
          issues.push("❌ Manager dashboard no carga");
        }
      });

      // ═══════════════════════════════════════════════════════════════
      // 5. HR — Dashboard global
      // ═══════════════════════════════════════════════════════════════
      await test.step("5. HR — Dashboard global", async () => {
        await loginAs(page, "hr");
        await expect(page).toHaveURL(/\/hr/);
        
        const hrHeading = page.getByRole("heading", { name: "Panel de HR" });
        if (await hrHeading.isVisible({ timeout: 15000 }).catch(() => false)) {
          console.log("  ✅ HR dashboard cargado");
        } else {
          issues.push("❌ HR dashboard no carga");
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
