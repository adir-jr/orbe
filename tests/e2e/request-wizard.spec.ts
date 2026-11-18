import { expect, test } from "@playwright/test";

test("formulário guiado avança, valida, retorna e não envia dados", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (r) => r.method() === "POST" && posts.push(r.url()));

  await page.goto("/solicitar");
  await expect(page.getByRole("heading", { name: "O que você precisa?" })).toBeVisible();

  // Validação da etapa 1
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Escolha o serviço de que você precisa.")).toBeVisible();

  await page.getByRole("tab", { name: "Casa e manutenção" }).click();
  await page.getByText("Eletricista", { exact: true }).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  // Etapa 2: perguntas contextuais do eletricista
  await expect(page.getByRole("heading", { name: "Conte um pouco mais" })).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Selecione uma opção.")).toBeVisible();
  await page.getByText("Instalação de algo novo").click();
  await page.getByLabel("Descreva o que você precisa").fill("Preciso instalar três tomadas novas na sala.");
  await page.getByRole("button", { name: "Continuar" }).click();

  // Voltar preserva os dados
  await expect(page.getByRole("heading", { name: "Onde e quando" })).toBeVisible();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(page.getByLabel("Descreva o que você precisa")).toHaveValue(/três tomadas/);
  await page.getByRole("button", { name: "Continuar" }).click();

  // Etapa 3
  await page.getByLabel("Bairro").selectOption({ label: "América" });
  await page.getByText("Nos próximos dias").click();
  await page.getByText("Manhã", { exact: true }).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  // Etapa 4: revisão e consentimento obrigatório
  await expect(page.getByRole("heading", { name: "Confira e autorize" })).toBeVisible();
  await expect(page.getByText("América, Joinville")).toBeVisible();
  await page.getByRole("button", { name: "Publicar solicitação" }).click();
  await expect(page.getByText("É preciso autorizar o compartilhamento para publicar.")).toBeVisible();
  await page.getByLabel(/Autorizo o compartilhamento/).check();
  await page.getByRole("button", { name: "Publicar solicitação" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("não foi publicada");

  // Fase 1: nada pode ter sido enviado ao servidor.
  expect(posts).toEqual([]);
});
