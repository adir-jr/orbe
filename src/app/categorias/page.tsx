import type { Metadata } from "next";
import { ServiceLinkCard } from "@/components/catalog/cards";
import { IconTile } from "@/components/catalog/service-icon";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { listCategoriesWithServices } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Categorias de serviços em Joinville",
  description: "Veja todas as categorias e serviços disponíveis no ORBE Serviços em Joinville, SC.",
  alternates: { canonical: "/categorias" },
};

export default async function CategoriesPage() {
  const categories = await listCategoriesWithServices();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Categorias" }]}
        title="Categorias de serviços"
        description="Escolha uma categoria para ver os serviços disponíveis em Joinville."
      />
      <Container className="py-12 sm:py-16">
        {/* Navegação rápida entre categorias */}
        <nav aria-label="Categorias" className="-mx-4 mb-12 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 sm:flex-wrap">
            {categories.map((c) => (
              <li key={c.slug}>
                <a
                  href={`#${c.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-ink-muted hover:border-brand-200 hover:text-brand-700"
                >
                  {c.name}
                  <span className="text-ink-subtle tabular-nums">{c.services.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          {categories.map((c) => (
            <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className="scroll-mt-24">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <IconTile icon={c.icon} size="lg" />
                  <div>
                    <h2 id={`${c.slug}-title`} className="text-xl font-extrabold sm:text-2xl">
                      {c.name}
                    </h2>
                    <p className="mt-0.5 text-[0.9375rem] text-ink-muted">{c.description}</p>
                  </div>
                </div>
                <ButtonLink href={`/categorias/${c.slug}`} variant="outline" size="sm" className="self-start sm:self-auto">
                  Ver categoria
                </ButtonLink>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {c.services.map((s) => (
                  <ServiceLinkCard key={s.slug} service={s} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
