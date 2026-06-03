export const DEMO_ACCOUNTS = {
  admin: {
    email: "admin@pulsewell.demo",
    password: "Demo1234!",
    role: "ADMIN",
    dashboard: "/admin",
  },
  hr: {
    email: "hr@pulsewell.demo",
    password: "Demo1234!",
    role: "HR_ANALYST",
    dashboard: "/hr",
  },
  manager: {
    email: "manager-eng@pulsewell.demo",
    password: "Demo1234!",
    role: "MANAGER",
    dashboard: "/manager",
  },
  employee: {
    email: "employee1-eng@pulsewell.demo",
    password: "Demo1234!",
    role: "EMPLOYEE",
    dashboard: "/survey",
  },
} as const;

export async function loginAs(
  page: import("@playwright/test").Page,
  account: keyof typeof DEMO_ACCOUNTS,
): Promise<void> {
  const creds = DEMO_ACCOUNTS[account];
  await page.goto("/auth/login");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email").fill(creds.email);
  await page.getByLabel("Contraseña").fill(creds.password);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL(`**${creds.dashboard}**`);
}
