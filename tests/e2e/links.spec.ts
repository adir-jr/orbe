import { expect, test } from "@playwright/test";

/** Percorre o site a partir da página inicial e verifica todos os links internos. */
test("não há links internos quebrados", async ({ page, request, browserName }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "executado uma vez");
  test.setTimeout(120_000);
  void browserName;

  const visited = new Set<string>();
  const queue = ["/"];
  const broken: string[] = [];

  while (queue.length > 0) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    const res = await request.get(path);
    if (res.status() !== 200) {
      broken.push(`${path} → ${res.status()}`);
      continue;
    }
    await page.goto(path);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      if (!href.startsWith("/")) continue; // âncoras e externos
      const clean = href.split("#")[0];
      if (clean && !visited.has(clean)) queue.push(clean);
    }
  }

  expect(visited.size).toBeGreaterThan(30);
  expect(broken).toEqual([]);
});
