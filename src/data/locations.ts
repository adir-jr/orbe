import type { City, Neighborhood } from "@/domain/types";
import { slugify } from "@/domain/search";

/**
 * Cidades e bairros atendidos (tabela `service_areas` na Fase 2).
 *
 * Lista inicial de bairros de Joinville para o piloto. Antes do lançamento,
 * revisar com a divisão oficial de bairros da Prefeitura de Joinville.
 */

export const cities: City[] = [{ slug: "joinville", name: "Joinville", state: "SC" }];

export const DEFAULT_CITY = cities[0];

const joinvilleNeighborhoodNames = [
  "Adhemar Garcia",
  "América",
  "Anita Garibaldi",
  "Atiradores",
  "Aventureiro",
  "Boa Vista",
  "Boehmerwald",
  "Bom Retiro",
  "Bucarein",
  "Centro",
  "Comasa",
  "Costa e Silva",
  "Dona Francisca",
  "Espinheiros",
  "Fátima",
  "Floresta",
  "Glória",
  "Guanabara",
  "Iririú",
  "Itaum",
  "Itinga",
  "Jardim Iririú",
  "Jardim Paraíso",
  "Jardim Sofia",
  "Jarivatuba",
  "João Costa",
  "Morro do Meio",
  "Nova Brasília",
  "Paranaguamirim",
  "Parque Guarani",
  "Petrópolis",
  "Pirabeiraba",
  "Profipo",
  "Saguaçu",
  "Santa Catarina",
  "Santo Antônio",
  "São Marcos",
  "Ulysses Guimarães",
  "Vila Cubatão",
  "Vila Nova",
  "Zona Industrial Norte",
  "Zona Industrial Tupy",
];

export const neighborhoods: Neighborhood[] = joinvilleNeighborhoodNames.map((name) => ({
  name,
  slug: slugify(name),
  citySlug: "joinville",
}));
