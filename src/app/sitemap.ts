import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { listCategories, listServices } from "@/server/catalog";

/**
 * Sitemap das páginas públicas indexáveis (SEO local).
 * Não inclui painéis, busca, formulários, login ou perfis demonstrativos.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, services] = await Promise.all([listCategories(), listServices()]);
  const base = siteConfig.url.replace(/\/$/, "");

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/categorias`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/como-funciona`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/para-profissionais`, changeFrequency: "monthly", priority: 0.7 },
    ...categories.map((c) => ({
      url: `${base}/categorias/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...services.map((s) => ({
      url: `${base}/servicos/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${base}/termos`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
