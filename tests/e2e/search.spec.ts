import { expect, test } from "@playwright/test";

test.describe("busca demonstrativa", () => {
  test("busca por problema encontra o serviço", async ({ page }) => {
    await page.goto("/");
    const box = page.getByRole("combobox", { name: /qual serviço/i });
    await box.fill("vazamento");
    await box.press("Enter");
    await expect(page).toHaveURL(/\/buscar\?q=vazamento/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("vazamento");
    await expect(page.getByRole("link", { name: /Encanador/ }).first()).toBeVisible();
    await expect(page.getByText("Perfis fictícios")).toBeVisible();
  });

  test("sugestões permitem ir direto ao serviço", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: /qual serviço/i }).fill("diar");
    const option = page.getByRole("option", { name: /Diarista/ });
    await expect(option).toBeVisible();
    await option.click();
    await expect(page).toHaveURL(/\/servicos\/diarista$/);
  });

  test("busca sem resultados mostra estado vazio", async ({ page }) => {
    await page.goto("/buscar?q=xyzabc");
    await expect(page.getByRole("heading", { name: "Nenhum serviço encontrado" })).toBeVisible();
  });
});
