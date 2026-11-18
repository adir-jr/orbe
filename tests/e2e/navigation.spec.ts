import { expect, test } from "@playwright/test";

test.describe("navegação pública", () => {
  test("página inicial apresenta proposta, busca e categorias", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Encontre profissionais");
    await expect(page.getByRole("combobox", { name: /qual serviço/i })).toBeVisible();
    await expect(page.getByText("Protótipo em desenvolvimento")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Casa e manutenção" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("categoria leva ao serviço e ao formulário com serviço pré-selecionado", async ({ page }) => {
    await page.goto("/categorias/casa-e-manutencao");
    await page.getByRole("link", { name: /^Eletricista/ }).first().click();
    await expect(page).toHaveURL(/\/servicos\/eletricista$/);
    await expect(page.getByText("Perfis demonstrativos")).toBeVisible();
    await page.getByRole("link", { name: "Começar solicitação" }).click();
    await expect(page).toHaveURL(/\/solicitar\?servico=eletricista/);
    await expect(page.getByRole("heading", { name: "Conte um pouco mais" })).toBeVisible();
  });

  // Com streaming (Cache Components), o status pode já ter sido enviado como 200
  // quando notFound() executa; o Next.js então injeta noindex. Ver docs/architecture.md.
  for (const path of ["/servicos/nao-existe", "/categorias/outros-servicos", "/profissionais/nao-existe"]) {
    test(`exibe "não encontrada" e noindex em ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      expect([200, 404]).toContain(res?.status());
      await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
      await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
    });
  }
});
