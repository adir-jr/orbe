import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { ServiceLinkCard } from "@/components/catalog/cards";
import { IconTile } from "@/components/catalog/service-icon";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ProfessionalCard } from "@/components/professional/professional-card";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import {
  getCategoryBySlug,
  getServiceBySlug,
  listProfessionals,
  listServices,
} from "@/server/catalog";

export async function generateStaticParams() {
  const services = await listServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/servicos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await getServiceBySlug(slug);
  if (!found) return {};
  return {
    title: `${found.service.name} em Joinville`,
    description: `${found.service.summary} Descreva o que precisa e receba o interesse de profissionais de Joinville, SC.`,
    alternates: { canonical: `/servicos/${found.service.slug}` },
  };
}

export default async function ServicePage({ params }: PageProps<"/servicos/[slug]">) {
  const { slug } = await params;
  const found = await getServiceBySlug(slug);
  if (!found) notFound();
  const { service, category } = found;

  const [professionals, categoryWithServices, allServices] = await Promise.all([
    listProfessionals({ serviceSlug: service.slug }),
    getCategoryBySlug(category.slug),
    listServices(),
  ]);
  const serviceName = new Map(allServices.map((s) => [s.slug, s.name]));
  const related = (categoryWithServices?.services ?? []).filter((s) => s.slug !== service.slug).slice(0, 3);
  const examples = service.questions.find((q) => q.id === "scope")?.options ?? [];

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: category.name, href: `/categorias/${category.slug}` },
          { label: service.name },
        ]}
        title={
          <span className="flex items-center gap-4">
            <IconTile icon={service.icon} size="lg" />
            <span>
              {service.name} <span className="text-ink-subtle">em Joinville</span>
            </span>
          </span>
        }
        description={service.summary}
        aside={
          <ButtonLink
            href={`/solicitar?servico=${service.slug}`}
            size="lg"
            className="self-start lg:self-auto"
          >
            Solicitar {service.name.toLowerCase()} <ArrowRight />
          </ButtonLink>
        }
      />

      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          <section aria-labelledby="profissionais">
            <h2 id="profissionais" className="text-xl font-extrabold">
              Profissionais que atendem {service.name.toLowerCase()}
            </h2>
            <Alert tone="warning" title="Perfis demonstrativos" className="mt-4">
              Os perfis abaixo são fictícios e servem apenas para mostrar como a página funcionará. Perfis reais
              serão exibidos após o cadastro e a aprovação dos profissionais.
            </Alert>
            {professionals.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {professionals.map((p) => (
                  <ProfessionalCard
                    key={p.slug}
                    professional={p}
                    serviceNames={p.serviceSlugs.map((s) => serviceName.get(s) ?? s)}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-lg border border-dashed border-line-strong bg-surface p-6 text-[0.9375rem] text-ink-muted">
                Ainda não há perfis de exemplo para este serviço. Você pode publicar uma solicitação e os
                profissionais compatíveis serão avisados quando a plataforma estiver em operação.
              </p>
            )}
          </section>

          {related.length > 0 && (
            <section aria-labelledby="relacionados">
              <h2 id="relacionados" className="text-xl font-extrabold">
                Outros serviços em {category.name.toLowerCase()}
              </h2>
              <div className="mt-5 grid gap-3">
                {related.map((s) => (
                  <ServiceLinkCard key={s.slug} service={s} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardBody>
              <h2 className="text-lg font-bold">Como pedir um {service.name.toLowerCase()}</h2>
              <ol className="mt-4 space-y-3 text-[0.9375rem] text-ink-muted">
                {[
                  "Descreva o que você precisa em poucos passos.",
                  "Profissionais compatíveis demonstram interesse.",
                  "Você escolhe para quem liberar o seu contato.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
              <ButtonLink href={`/solicitar?servico=${service.slug}`} className="mt-6 w-full">
                Começar solicitação
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-ink-subtle">Gratuito para quem contrata.</p>
            </CardBody>
          </Card>

          {examples.length > 0 && (
            <Card>
              <CardBody>
                <h2 className="font-bold">Você pode solicitar, por exemplo</h2>
                <ul className="mt-3 space-y-2 text-[0.9375rem] text-ink-muted">
                  {examples.map((o) => (
                    <li key={o.value} className="flex items-center gap-2">
                      <Check aria-hidden className="size-4 text-brand-600" />
                      {o.label}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </aside>
      </Container>
    </>
  );
}
