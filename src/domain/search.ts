/**
 * Busca textual simples, sem dependências externas.
 * Ignora acentos e caixa ("Elétrica" == "eletrica").
 * Na Fase 2, pode ser substituída por full-text search do PostgreSQL
 * (unaccent + tsvector) mantendo a mesma interface.
 */

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface Searchable {
  name: string;
  keywords?: readonly string[];
  extra?: readonly string[];
}

/**
 * Pontua a relevância de um item para a busca.
 * 0 = não corresponde. Quanto maior, mais relevante.
 */
export function scoreMatch(item: Searchable, rawQuery: string): number {
  const query = normalizeText(rawQuery);
  if (!query) return 0;

  const name = normalizeText(item.name);
  const keywords = (item.keywords ?? []).map(normalizeText);
  const extra = (item.extra ?? []).map(normalizeText);
  const terms = query.split(" ").filter((t) => t.length >= 2);
  if (terms.length === 0) return 0;

  let score = 0;
  if (name === query) score += 100;
  else if (name.startsWith(query)) score += 60;
  else if (name.includes(query)) score += 40;

  for (const term of terms) {
    if (name.split(" ").some((w) => w.startsWith(term))) score += 15;
    if (keywords.some((k) => k === term)) score += 12;
    else if (keywords.some((k) => k.startsWith(term) || k.includes(` ${term}`))) score += 8;
    if (extra.some((e) => e.includes(term))) score += 3;
  }

  // Exige que todos os termos apareçam em algum lugar, para evitar ruído.
  const haystack = [name, ...keywords, ...extra].join(" ");
  const allTermsPresent = terms.every((t) => haystack.includes(t));
  return allTermsPresent ? score : 0;
}

export function rankBySearch<T>(
  items: readonly T[],
  query: string,
  toSearchable: (item: T) => Searchable,
): T[] {
  return items
    .map((item) => ({ item, score: scoreMatch(toSearchable(item), query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}

export function slugify(value: string): string {
  return normalizeText(value).replace(/\s+/g, "-").replace(/-+/g, "-");
}
