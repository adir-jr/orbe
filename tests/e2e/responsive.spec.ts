import { expect, test } from "@playwright/test";

const pages = ["/", "/categorias", "/servicos/eletricista", "/buscar?q=limpeza", "/solicitar", "/para-profissionais", "/como-funciona", "/profissionais/exemplo-eletrica-residencial", "/cadastro", "/privacidade"];

test.describe("layout em 360 px", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  for (const path of pages) {
    test(`sem rolagem horizontal em ${path}`, async ({ page }) => {
      await page.goto(path);
      // Compara com a largura real do aparelho: em celulares, um conteúdo largo
      // faz o navegador "afastar o zoom" e innerWidth cresce junto.
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width).toBeLessThanOrEqual(360);
    });
  }

  test("menu mobile abre, navega e fecha", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Como funciona" }).click();
    await expect(page).toHaveURL(/\/como-funciona$/);
    await expect(menu).toBeHidden();
  });
});
