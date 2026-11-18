import type { ProfessionalSummary } from "@/domain/types";

/**
 * PERFIS FICTÍCIOS — usados apenas para demonstrar o layout na Fase 1.
 *
 * - Não representam pessoas ou empresas reais.
 * - Não possuem avaliações, selos ou verificações (nada disso existe ainda).
 * - Toda tela que os exibe mostra o aviso "Perfil demonstrativo".
 *
 * Remover este arquivo quando os perfis reais vierem do banco (Fase 2).
 */
export const demoProfessionals: ProfessionalSummary[] = [
  {
    id: "demo-1",
    slug: "exemplo-eletrica-residencial",
    displayName: "Exemplo Elétrica Residencial",
    headline: "Instalações e manutenção elétrica residencial",
    about:
      "Perfil fictício criado para demonstrar como um profissional poderá apresentar seu trabalho: experiência, especialidades e regiões de atendimento, com linguagem clara e objetiva.",
    citySlug: "joinville",
    serviceSlugs: ["eletricista", "reparos-gerais"],
    neighborhoodSlugs: ["america", "centro", "atiradores", "gloria", "saguacu"],
    servesWholeCity: false,
    yearsOfExperience: 8,
    availability: "Segunda a sábado, manhã e tarde",
    status: "approved",
    isDemo: true,
  },
  {
    id: "demo-2",
    slug: "exemplo-limpeza-e-cuidado",
    displayName: "Exemplo Limpeza & Cuidado",
    headline: "Diárias e limpeza residencial completa",
    about:
      "Perfil fictício. Mostra como diaristas e equipes de limpeza poderão informar frequência de atendimento, tipos de imóvel e bairros atendidos.",
    citySlug: "joinville",
    serviceSlugs: ["diarista", "limpeza-residencial", "limpeza-pos-obra"],
    neighborhoodSlugs: [],
    servesWholeCity: true,
    yearsOfExperience: 5,
    availability: "Segunda a sexta",
    status: "approved",
    isDemo: true,
  },
  {
    id: "demo-3",
    slug: "exemplo-hidraulica-norte",
    displayName: "Exemplo Hidráulica Norte",
    headline: "Vazamentos, desentupimentos e instalações hidráulicas",
    about:
      "Perfil fictício. Demonstra a apresentação de um profissional que atende uma região específica da cidade.",
    citySlug: "joinville",
    serviceSlugs: ["encanador"],
    neighborhoodSlugs: ["aventureiro", "costa-e-silva", "iririu", "jardim-iririu", "comasa", "pirabeiraba"],
    servesWholeCity: false,
    availability: "Todos os dias, com horário a combinar",
    status: "approved",
    isDemo: true,
  },
  {
    id: "demo-4",
    slug: "exemplo-clima-instalacoes",
    displayName: "Exemplo Clima Instalações",
    headline: "Instalação e higienização de ar-condicionado",
    about:
      "Perfil fictício. Ilustra um prestador de serviços técnicos com atendimento em toda a cidade.",
    citySlug: "joinville",
    serviceSlugs: ["ar-condicionado", "eletrodomesticos"],
    neighborhoodSlugs: [],
    servesWholeCity: true,
    yearsOfExperience: 12,
    availability: "Segunda a sábado",
    status: "approved",
    isDemo: true,
  },
  {
    id: "demo-5",
    slug: "exemplo-montagens-sul",
    displayName: "Exemplo Montagens Sul",
    headline: "Montagem de móveis e pequenos reparos",
    about:
      "Perfil fictício. Exemplo de um profissional autônomo com foco em montagem de móveis na zona sul.",
    citySlug: "joinville",
    serviceSlugs: ["montador-de-moveis", "reparos-gerais"],
    neighborhoodSlugs: ["itaum", "floresta", "petropolis", "fatima", "guanabara", "boehmerwald"],
    servesWholeCity: false,
    yearsOfExperience: 3,
    availability: "Fins de semana e noites",
    status: "approved",
    isDemo: true,
  },
  {
    id: "demo-6",
    slug: "exemplo-cores-pinturas",
    displayName: "Exemplo Cores Pinturas",
    headline: "Pintura residencial e comercial",
    about:
      "Perfil fictício. Demonstra como o portfólio de trabalhos poderá ser exibido quando o envio de imagens estiver disponível.",
    citySlug: "joinville",
    serviceSlugs: ["pintor"],
    neighborhoodSlugs: [],
    servesWholeCity: true,
    availability: "Segunda a sexta",
    status: "approved",
    isDemo: true,
  },
];
