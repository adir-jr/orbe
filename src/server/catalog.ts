import "server-only";

import { categories, featuredServiceSlugs, services } from "@/data/catalog";
import { demoProfessionals } from "@/data/demo-professionals";
import { cities, neighborhoods } from "@/data/locations";
import { normalizeText, rankBySearch } from "@/domain/search";
import type {
  Category,
  CategoryWithServices,
  City,
  Neighborhood,
  ProfessionalSummary,
  Service,
} from "@/domain/types";

/**
 * Camada de acesso a dados do catálogo.
 *
 * Fase 1: lê dados locais. Fase 2: as mesmas funções consultarão o Supabase.
 * As funções já são assíncronas para que as páginas não precisem mudar
 * quando a origem dos dados for trocada.
 */

const activeCategories = () =>
  categories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

const activeCategorySlugs = () => new Set(activeCategories().map((c) => c.slug));

const activeServices = () => {
  const allowed = activeCategorySlugs();
  return services.filter((s) => s.isActive && allowed.has(s.categorySlug));
};

export async function listCategories(): Promise<Category[]> {
  return activeCategories();
}

export async function listCategoriesWithServices(): Promise<CategoryWithServices[]> {
  const all = activeServices();
  return activeCategories().map((c) => ({
    ...c,
    services: all.filter((s) => s.categorySlug === c.slug),
  }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithServices | null> {
  const category = activeCategories().find((c) => c.slug === slug);
  if (!category) return null;
  return { ...category, services: activeServices().filter((s) => s.categorySlug === slug) };
}

export async function listServices(): Promise<Service[]> {
  return activeServices();
}

export async function getServiceBySlug(
  slug: string,
): Promise<{ service: Service; category: Category } | null> {
  const service = activeServices().find((s) => s.slug === slug);
  if (!service) return null;
  const category = activeCategories().find((c) => c.slug === service.categorySlug);
  return category ? { service, category } : null;
}

export async function listFeaturedServices(): Promise<Service[]> {
  const all = activeServices();
  return featuredServiceSlugs
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
}

export async function listCities(): Promise<City[]> {
  return cities;
}

export async function listNeighborhoods(citySlug = "joinville"): Promise<Neighborhood[]> {
  return neighborhoods.filter((n) => n.citySlug === citySlug);
}

export async function getNeighborhoodNames(slugs: readonly string[]): Promise<string[]> {
  const map = new Map(neighborhoods.map((n) => [n.slug, n.name]));
  return slugs.map((s) => map.get(s)).filter((n): n is string => Boolean(n));
}

// ---------------------------------------------------------------------------
// Profissionais (DEMONSTRATIVOS na Fase 1)
// ---------------------------------------------------------------------------

/** Somente perfis aprovados aparecem em páginas públicas. */
const publicProfessionals = () => demoProfessionals.filter((p) => p.status === "approved");

export async function listProfessionals(filter?: {
  serviceSlug?: string;
}): Promise<ProfessionalSummary[]> {
  const list = publicProfessionals();
  if (!filter?.serviceSlug) return list;
  return list.filter((p) => p.serviceSlugs.includes(filter.serviceSlug!));
}

export async function getProfessionalBySlug(slug: string): Promise<ProfessionalSummary | null> {
  return publicProfessionals().find((p) => p.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Busca
// ---------------------------------------------------------------------------

export interface SearchResults {
  query: string;
  services: Service[];
  categories: Category[];
  professionals: ProfessionalSummary[];
}

export const SEARCH_QUERY_MAX = 80;

export async function searchCatalog(rawQuery: string): Promise<SearchResults> {
  const query = rawQuery.slice(0, SEARCH_QUERY_MAX).trim();
  if (!normalizeText(query)) {
    return { query, services: [], categories: [], professionals: [] };
  }

  const cats = activeCategories();
  const catName = new Map(cats.map((c) => [c.slug, c.name]));
  const svcList = activeServices();

  const foundServices = rankBySearch(svcList, query, (s) => ({
    name: s.name,
    keywords: s.keywords,
    extra: [s.summary, catName.get(s.categorySlug) ?? ""],
  }));

  const foundCategories = rankBySearch(cats, query, (c) => ({
    name: c.name,
    extra: [c.description],
  }));

  const serviceSlugs = new Set(foundServices.map((s) => s.slug));
  const foundProfessionals = publicProfessionals().filter(
    (p) =>
      p.serviceSlugs.some((s) => serviceSlugs.has(s)) ||
      rankBySearch([p], query, (x) => ({ name: x.displayName, extra: [x.headline] })).length > 0,
  );

  return {
    query,
    services: foundServices,
    categories: foundCategories,
    professionals: foundProfessionals,
  };
}
