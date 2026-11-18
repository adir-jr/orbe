import { ArrowRight, MapPin } from "lucide-react";
import { CategoryCard, ServiceLinkCard } from "@/components/catalog/cards";
import { Container, Section, SectionHeading } from "@/components/layout/container";
import { HeroIllustration } from "@/components/marketing/hero-illustration";
import { HowItWorks, PrivacyPromise, ProfessionalCta } from "@/components/marketing/sections";
import { SearchBox } from "@/components/search/search-box";
import { ButtonLink } from "@/components/ui/button";
import { listCategoriesWithServices, listFeaturedServices } from "@/server/catalog";
import { getSearchOptions } from "@/server/search-options";
import Link from "next/link";

export default async function HomePage() {
  const [categories, featured, searchOptions] = await Promise.all([
    listCategoriesWithServices(),
    listFeaturedServices(),
    getSearchOptions(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container className="grid gap-14 pt-12 pb-16 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[0.8125rem] font-semibold text-ink-muted">
              <MapPin aria-hidden className="size-3.5 text-brand-600" />
              Joinville · SC
            </p>
            <h1 className="mt-5 text-[2.25rem] leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.5rem]">
              Encontre profissionais para o que você precisa.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Descreva o serviço uma única vez, receba o interesse de profissionais da sua região e escolha, com
              calma, com quem quer conversar.
            </p>

            <SearchBox options={searchOptions} className="mt-8 max-w-xl" />

            <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2 text-sm">
              <span className="mr-1 text-ink-subtle">Mais procurados:</span>
              {featured.slice(0, 4).map((s) => (
                <Link
                  key={s.slug}
                  href={`/servicos/${s.slug}`}
                  className="rounded-full px-2.5 py-1 font-semibold text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-brand-700 hover:decoration-brand-300"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          <HeroIllustration />
        </Container>
      </section>

      {/* Categorias */}
      <Section className="pt-4 sm:pt-6">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Categorias"
              title="Do reparo rápido ao serviço especializado"
              description="Começamos por serviços do dia a dia em Joinville. Novas categorias entram conforme a demanda."
            />
            <ButtonLink href="/categorias" variant="ghost" className="self-start sm:self-auto">
              Ver todas <ArrowRight />
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </Container>
      </Section>

      <HowItWorks />

      {/* Serviços populares */}
      <Section className="pt-0 sm:pt-0">
        <Container>
          <SectionHeading eyebrow="Serviços frequentes" title="Comece por aqui" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ServiceLinkCard key={s.slug} service={s} />
            ))}
          </div>
        </Container>
      </Section>

      <PrivacyPromise />
      <ProfessionalCta />
    </>
  );
}
