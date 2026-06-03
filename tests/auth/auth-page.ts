import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Contraseña");
    this.submitButton = page.getByRole("button", { name: "Iniciar sesión" });
  }

  async goto(): Promise<void> {
    await super.goto("/auth/login");
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyErrorVisible(): Promise<void> {
    await expect(this.page.getByText("Credenciales inválidas")).toBeVisible();
  }

  async verifyPrivacyBanner(): Promise<void> {
    await expect(
      this.page.getByText("Ambiente demo")
    ).toBeVisible();
  }
}
