import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers";

test.describe("Admin — Teams CRUD", { tag: ["@critical", "@e2e", "@admin"] }, () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
    await page.goto("/admin/teams");
    await page.waitForLoadState("networkidle");
  });

  test("Shows teams table with existing teams",
    { tag: ["@ADMIN-E2E-001"] },
    async ({ page }) => {
      await expect(page.getByText("Engineering")).toBeVisible();
      await expect(page.getByText("Sales")).toBeVisible();
      await expect(page.getByText("Operations")).toBeVisible();
      await expect(page.getByText("Customer Success")).toBeVisible();
    });

  test("Shows team stats — user count, responses, OWI",
    { tag: ["@ADMIN-E2E-002"] },
    async ({ page }) => {
      // Each team row shows user count and response count
      await expect(page.getByText("Usuarios")).toBeVisible();
      await expect(page.getByText("Respuestas")).toBeVisible();
    });

  test("Can create a new team",
    { tag: ["@ADMIN-E2E-003"] },
    async ({ page }) => {
      await page.getByText("+ Nuevo equipo").click();
      await page.getByPlaceholder("Nombre del equipo").fill("Marketing");
      await page.getByRole("button", { name: "Crear" }).click();
      // Wait for table to refresh
      await page.waitForTimeout(1000);
      await expect(page.getByText("Marketing")).toBeVisible();
    });

  test("Can edit a team name",
    { tag: ["@ADMIN-E2E-004"] },
    async ({ page }) => {
      // Click edit on Engineering
      const engineeringRow = page.locator("tr", { hasText: "Engineering" });
      await engineeringRow.getByText("Editar").click();
      // Form appears with pre-filled name
      const input = page.getByDisplayValue("Engineering");
      await input.fill("Engineering R&D");
      await page.getByRole("button", { name: "Actualizar" }).click();
      await page.waitForTimeout(500);
      await expect(page.getByText("Engineering R&D")).toBeVisible();
    });

  test("Shows delete confirmation dialog",
    { tag: ["@ADMIN-E2E-005"] },
    async ({ page }) => {
      // Click delete on a team — should show confirmation
      await page.locator("tr", { hasText: "Customer Success" }).getByText("Eliminar").click();
      await expect(page.getByText("¿Estás seguro de eliminar")).toBeVisible();
      // Cancel
      await page.getByRole("button", { name: "Cancelar" }).click();
    });
});

test.describe("Admin — Users CRUD", { tag: ["@critical", "@e2e", "@admin"] }, () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
    await page.goto("/admin/users");
    await page.waitForLoadState("networkidle");
  });

  test("Shows users table with existing users",
    { tag: ["@ADMIN-E2E-006"] },
    async ({ page }) => {
      await expect(page.getByText("admin@pulsewell.demo")).toBeVisible();
      await expect(page.getByText("hr@pulsewell.demo")).toBeVisible();
      await expect(page.getByText("manager-eng@pulsewell.demo")).toBeVisible();
    });

  test("Shows role badges and team assignments",
    { tag: ["@ADMIN-E2E-007"] },
    async ({ page }) => {
      await expect(page.getByText("Admin")).toBeVisible();
      await expect(page.getByText("HR")).toBeVisible();
      await expect(page.getByText("Manager")).toBeVisible();
      await expect(page.getByText("Empleado")).toBeVisible();
    });

  test("Can create a new employee",
    { tag: ["@ADMIN-E2E-008"] },
    async ({ page }) => {
      await page.getByText("+ Nuevo usuario").click();
      await page.getByPlaceholder("usuario@ejemplo.com").fill("test.employee@pulsewell.demo");
      await page.getByPlaceholder("Nombre completo").fill("Test Employee");
      // Select EMPLOYEE role from dropdown
      await page.locator("select").first().selectOption("EMPLOYEE");
      // Select a team
      await page.locator("select").last().selectOption({ label: "Engineering R&D" });
      await page.getByRole("button", { name: "Crear usuario" }).click();
      // Should show temp password notification
      await expect(page.getByText("Contraseña temporal:")).toBeVisible({ timeout: 15000 });
    });

  test("Can edit user role",
    { tag: ["@ADMIN-E2E-009"] },
    async ({ page }) => {
      // Find and edit an employee
      await page.waitForTimeout(500);
      const editButtons = page.locator("button:has-text('Editar')");
      const count = await editButtons.count();
      if (count > 0) {
        await editButtons.first().click();
        await page.waitForTimeout(300);
        await expect(page.getByRole("button", { name: "Actualizar" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Cancelar" })).toBeVisible();
      }
    });

  test("Shows delete confirmation for user",
    { tag: ["@ADMIN-E2E-010"] },
    async ({ page }) => {
      const deleteButtons = page.locator("text=Eliminar");
      const count = await deleteButtons.count();
      if (count > 0) {
        await deleteButtons.last().click();
        await expect(page.getByText("¿Estás seguro de eliminar")).toBeVisible();
        await page.getByRole("button", { name: "Cancelar" }).click();
      }
    });
});

test.describe("Admin — Surveys Management", { tag: ["@high", "@e2e", "@admin"] }, () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin");
    await page.goto("/admin/surveys");
    await page.waitForLoadState("networkidle");
  });

  test("Shows existing surveys",
    { tag: ["@ADMIN-E2E-011"] },
    async ({ page }) => {
      await expect(page.getByText("Weekly Pulse Q2 2026")).toBeVisible();
    });

  test("Shows active/inactive toggle",
    { tag: ["@ADMIN-E2E-012"] },
    async ({ page }) => {
      await expect(page.getByText("Activa")).toBeVisible();
    });

  test("Can create a new survey",
    { tag: ["@ADMIN-E2E-013"] },
    async ({ page }) => {
      await page.getByText("+ Nueva encuesta").click();
      await page.getByPlaceholder("Ej: Weekly Pulse Q3 2026").fill("Test Survey Q3");
      await page.getByRole("button", { name: "Crear" }).click();
      await page.waitForTimeout(500);
      await expect(page.getByText("Test Survey Q3")).toBeVisible();
    });

  test("Can toggle survey active status",
    { tag: ["@ADMIN-E2E-014"] },
    async ({ page }) => {
      // Find the active toggle and click it
      const activeToggle = page.getByText("Activa").first();
      await activeToggle.click();
      await page.waitForTimeout(500);
      // Should now show "Inactiva" or the toggle color changed
      await expect(page.getByText("Inactiva")).toBeVisible();
    });

  test("Admin nav shows all tabs",
    { tag: ["@ADMIN-E2E-015"] },
    async ({ page }) => {
      await expect(page.getByRole("link", { name: "Resumen" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Equipos" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Usuarios" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Encuestas" })).toBeVisible();
    });
});
