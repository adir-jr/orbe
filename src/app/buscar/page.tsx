import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { ServiceChip, ServiceLinkCard } from "@/components/catalog/cards";
import { IconTile } from "@/components/catalog/service-icon";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProfessionalCard } from "@/components/professional/professional-card";
import { SearchBox } from "@/components/search/search-box";
import { DemoBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { listFeaturedServices, listServices, searchCatalog } from "@/server/catalog";
import { getSearchOptions } from "@/server/search-options";

export const metadata: Metadata = {
  title: "Buscar serviços",
  description: "Busque serviços e profissionais em Joinville.",
  // Páginas de resultados não devem ser indexadas (conteúdo duplicado/infinito).
  robots: { index: false, follow: true },
};

export default function SearchPage(props: PageProps<"/buscar">) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function SearchContent({ searchParams }: { searchParams: PageProps<"/buscar">["searchParams"] }) {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (raw ?? "").trim();

  const [results, options, allServices, featured] = await Promise.all([
    searchCatalog(query),
    getSearchOptions(),
    listServices(),
    listFeaturedServices(),
  ]);
  const serviceName = new Map(allServices.map((s) => [s.slug, s.name]));
  const total = results.services.length + results.categories.length;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Buscar" }]}
        title={query ? <>Resultados para “{results.query}”</> : "Buscar serviços"}
        description={
          query
            ? total > 0
              ? `${results.services.length} serviço(s) e ${results.categories.length} categoria(s) encontrados.`
              : undefined
            : "Digite o serviço ou o problema que você precisa resolver."
        }
      >
        <SearchBox key={query} options={options} defaultValue={query} size="md" className="mt-8 max-w-2xl" />
      </PageHeader>

      <Container className="py-12 sm:py-16">
        {!query && (
          <section aria-labelledby="sugestoes">
            <h2 id="sugestoes" className="text-sm font-bold tracking-wide text-ink-subtle uppercase">
              Sugestões
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {featured.map((s) => (
                <ServiceChip key={s.slug} service={s} />
              ))}
            </div>
          </section>
        )}

        {query && total === 0 && (
          <EmptyState
            icon={SearchX}
            title="Nenhum serviço encontrado"
            description={
              <>
                Tente palavras mais simples, como “eletricista” ou “limpeza”. Se não encontrar o que procura, veja
                todas as <Link href="/categorias" className="font-semibold text-brand-700 underline underline-offset-4">categorias</Link>.
              </>
            }
            action={
              <ButtonLink href="/solicitar" variant="outline">
                Descrever o que preciso
              </ButtonLink>
            }
          />
        )}

        {results.services.length > 0 && (
          <section aria-labelledby="res-servicos">
            <h2 id="res-servicos" className="text-xl font-extrabold">
              Serviços
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.services.map((s) => (
                <ServiceLinkCard key={s.slug} service={s} />
              ))}
            </div>
          </section>
        )}

        {results.categories.length > 0 && (
          <section aria-labelledby="res-categorias" className="mt-12">
            <h2 id="res-categorias" className="text-xl font-extrabold">
              Categorias
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {results.categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categorias/${c.slug}`}
                    className="flex items-center gap-4 rounded-lg border border-line bg-surface p-4 shadow-card hover:border-brand-200"
                  >
                    <IconTile icon={c.icon} />
                    <span>
                      <span className="block font-bold">{c.name}</span>
                      <span className="block text-sm text-ink-muted">{c.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {results.professionals.length > 0 && (
          <section aria-labelledby="res-profissionais" className="mt-12">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="res-profissionais" className="text-xl font-extrabold">
                Profissionais
              </h2>
              <DemoBadge label="Perfis fictícios" />
            </div>
            <p className="mt-2 text-[0.9375rem] text-ink-muted">
              Exemplos para demonstrar a busca. Ainda não há profissionais reais cadastrados.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.professionals.map((p) => (
                <ProfessionalCard
                  key={p.slug}
                  professional={p}
                  serviceNames={p.serviceSlugs.map((s) => serviceName.get(s) ?? s)}
                />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}

function SearchFallback() {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container className="py-10 sm:py-14">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-10 w-72" />
          <Skeleton className="mt-8 h-12 max-w-2xl" />
        </Container>
      </div>
      <Container className="grid gap-3 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </Container>
    </>
  );
}
