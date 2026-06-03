import { Page, expect } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path = "/"): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
  }

  async waitForUrl(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  async waitForHeading(text: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: text, exact: false })
    ).toBeVisible();
  }
}
