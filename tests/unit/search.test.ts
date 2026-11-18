import { describe, expect, it } from "vitest";
import { services } from "@/data/catalog";
import { normalizeText, rankBySearch, scoreMatch, slugify } from "@/domain/search";

const searchServices = (q: string) =>
  rankBySearch(services, q, (s) => ({ name: s.name, keywords: s.keywords, extra: [s.summary] })).map((s) => s.slug);

describe("normalização de texto", () => {
  it("remove acentos, caixa e pontuação", () => {
    expect(normalizeText("  Elétrica, HIDRÁULICA!  ")).toBe("eletrica hidraulica");
  });

  it("gera slugs legíveis", () => {
    expect(slugify("Montador de móveis")).toBe("montador-de-moveis");
    expect(slugify("São Marcos")).toBe("sao-marcos");
  });
});

describe("busca de serviços", () => {
  it("encontra pelo nome, com ou sem acento", () => {
    expect(searchServices("eletricista")[0]).toBe("eletricista");
    expect(searchServices("Vidraceiro")[0]).toBe("vidraceiro");
    expect(searchServices("eletrodomesticos")[0]).toBe("eletrodomesticos");
  });

  it("encontra por palavras relacionadas ao problema", () => {
    expect(searchServices("vazamento")).toContain("encanador");
    expect(searchServices("tomada")).toContain("eletricista");
    expect(searchServices("faxina")).toContain("diarista");
  });

  it("retorna vazio para termos sem relação ou muito curtos", () => {
    expect(searchServices("xyzabc")).toEqual([]);
    expect(searchServices("a")).toEqual([]);
    expect(scoreMatch({ name: "Pintor" }, "   ")).toBe(0);
  });

  it("exige todos os termos da busca", () => {
    expect(searchServices("limpeza pos obra")[0]).toBe("limpeza-pos-obra");
    expect(searchServices("pintor carro")).toEqual([]);
  });
});
