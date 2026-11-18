/**
 * Configuração central do site.
 * "ORBE Serviços" é um nome provisório: altere aqui para refletir em todo o projeto.
 */
export const siteConfig = {
  name: "ORBE Serviços",
  shortName: "ORBE",
  description:
    "Encontre profissionais para o que você precisa em Joinville, de forma simples e prática.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  city: "Joinville",
  state: "SC",
  /** Fase atual do produto. Enquanto for "prototype", nada é enviado ou salvo. */
  phase: "prototype" as const,
};

export const mainNav = [
  { href: "/categorias", label: "Serviços" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/para-profissionais", label: "Para profissionais" },
] as const;
