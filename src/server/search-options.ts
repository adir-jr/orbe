import "server-only";

import type { SearchOption } from "@/components/search/search-box";
import { listCategoriesWithServices } from "./catalog";

/** Monta as sugestões do campo de busca a partir do catálogo ativo. */
export async function getSearchOptions(): Promise<SearchOption[]> {
  const categories = await listCategoriesWithServices();
  return categories.flatMap((c) => [
    ...c.services.map((s) => ({
      label: s.name,
      hint: c.name,
      href: `/servicos/${s.slug}`,
      keywords: s.keywords,
    })),
    { label: c.name, hint: "Categoria", href: `/categorias/${c.slug}`, keywords: [] },
  ]);
}
