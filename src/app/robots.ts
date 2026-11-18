import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Enquanto for protótipo, nada deve ser indexado.
  if (siteConfig.phase === "prototype") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Áreas privadas e páginas sem valor de busca.
      disallow: ["/painel", "/cliente", "/profissional", "/admin", "/api", "/buscar", "/solicitar", "/entrar", "/cadastro"],
    },
    sitemap: `${siteConfig.url.replace(/\/$/, "")}/sitemap.xml`,
  };
}
