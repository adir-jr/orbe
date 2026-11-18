import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { listCategories } from "@/server/catalog";
import { siteConfig } from "@/lib/site";
import { Container } from "./container";

export async function SiteFooter() {
  const categories = await listCategories();

  const groups = [
    {
      title: "Serviços",
      links: [
        ...categories.map((c) => ({ href: `/categorias/${c.slug}`, label: c.name })),
        { href: "/categorias", label: "Todas as categorias" },
      ],
    },
    {
      title: "Plataforma",
      links: [
        { href: "/como-funciona", label: "Como funciona" },
        { href: "/solicitar", label: "Solicitar serviço" },
        { href: "/buscar", label: "Buscar" },
      ],
    },
    {
      title: "Profissionais",
      links: [
        { href: "/para-profissionais", label: "Seja um profissional" },
        { href: "/cadastro?perfil=profissional", label: "Criar perfil" },
      ],
    },
    {
      title: "Institucional",
      links: [
        { href: "/termos", label: "Termos de uso" },
        { href: "/privacidade", label: "Política de privacidade" },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.3fr_3fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Um marketplace regional que conecta quem precisa de um serviço a profissionais de{" "}
            {siteConfig.city}.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-[0.8125rem] font-bold tracking-wide text-ink">{group.title}</h2>
              <ul className="mt-3 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-muted hover:text-brand-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-[0.8125rem] text-ink-subtle sm:flex-row sm:justify-between">
          <p>{siteConfig.name} · nome provisório · projeto da ORBE Group</p>
          <p>
            {siteConfig.city}, {siteConfig.state} · Protótipo — Fase 1
          </p>
        </Container>
      </div>
    </footer>
  );
}
