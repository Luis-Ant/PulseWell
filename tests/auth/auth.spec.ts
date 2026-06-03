import { test, expect } from "@playwright/test";
import { LoginPage } from "./auth-page";
import { DEMO_ACCOUNTS, loginAs } from "../helpers";

test.describe("Auth — Login", { tag: ["@critical", "@e2e", "@auth"] }, () => {
  test("HR Analyst can login and reach dashboard",
    { tag: ["@AUTH-E2E-001"] },
    async ({ page }) => {
      await loginAs(page, "hr");
      await expect(page).toHaveURL(/\/hr$/);
      await expect(page.getByRole("heading", { name: "Panel de HR" })).toBeVisible();
    });

  test("Manager can login and reach team dashboard",
    { tag: ["@AUTH-E2E-002"] },
    async ({ page }) => {
      await loginAs(page, "manager");
      await expect(page).toHaveURL(/\/manager$/);
      await expect(page.getByRole("heading", { name: "Panel de Manager" })).toBeVisible();
    });

  test("Employee can login and reach survey form",
    { tag: ["@AUTH-E2E-003"] },
    async ({ page }) => {
      await loginAs(page, "employee");
      await expect(page).toHaveURL(/\/survey$/);
      await expect(
        page.getByRole("heading", { name: "Weekly Pulse" })
      ).toBeVisible();
    });

  test("Admin can login and reach admin panel",
    { tag: ["@AUTH-E2E-004"] },
    async ({ page }) => {
      await loginAs(page, "admin");
      await expect(page).toHaveURL(/\/admin$/);
    });

  test("Invalid credentials show error",
    { tag: ["@AUTH-E2E-005"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login("wrong@email.com", "wrongpass");
      await loginPage.verifyErrorVisible();
    });

  test("Login page shows privacy banner",
    { tag: ["@AUTH-E2E-006"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.verifyPrivacyBanner();
    });

  test("Protected routes redirect to login when unauthenticated",
    { tag: ["@AUTH-E2E-007"] },
    async ({ page }) => {
      await page.goto("/hr");
      await page.waitForURL(/\/auth\/login/);
    });

  test("Logout returns to login page",
    { tag: ["@AUTH-E2E-008"] },
    async ({ page }) => {
      await loginAs(page, "hr");
      await page.getByRole("button", { name: "Cerrar sesión" }).click();
      await page.waitForURL(/\/auth\/login/);
    });
});
