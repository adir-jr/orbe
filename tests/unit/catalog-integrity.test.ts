import { describe, expect, it } from "vitest";
import { categories, featuredServiceSlugs, services } from "@/data/catalog";
import { demoProfessionals } from "@/data/demo-professionals";
import { neighborhoods } from "@/data/locations";

/** Garante a consistência dos dados locais (equivalente às FKs do banco). */
describe("integridade do catálogo", () => {
  it("slugs são únicos e em formato de URL", () => {
    const slugs = [...categories.map((c) => c.slug), ...services.map((s) => s.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("todo serviço pertence a uma categoria existente", () => {
    const catSlugs = new Set(categories.map((c) => c.slug));
    for (const s of services) expect(catSlugs).toContain(s.categorySlug);
  });

  it("serviços em destaque existem e estão ativos", () => {
    for (const slug of featuredServiceSlugs) {
      expect(services.find((s) => s.slug === slug)?.isActive).toBe(true);
    }
  });

  it("perfis demonstrativos referenciam serviços e bairros válidos e estão marcados", () => {
    const svc = new Set(services.map((s) => s.slug));
    const nb = new Set(neighborhoods.map((n) => n.slug));
    for (const p of demoProfessionals) {
      expect(p.isDemo).toBe(true);
      for (const s of p.serviceSlugs) expect(svc).toContain(s);
      for (const n of p.neighborhoodSlugs) expect(nb).toContain(n);
    }
  });
});
