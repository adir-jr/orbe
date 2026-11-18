import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, ImageIcon, MapPin, Briefcase } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/page-header";
import { ProfessionalAvatar } from "@/components/professional/professional-card";
import { Alert } from "@/components/ui/alert";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import {
  getNeighborhoodNames,
  getProfessionalBySlug,
  listProfessionals,
  listServices,
} from "@/server/catalog";
import { formatList } from "@/lib/utils";

export async function generateStaticParams() {
  const list = await listProfessionals();
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/profissionais/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProfessionalBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.displayName} (perfil demonstrativo)`,
    description: p.headline,
    // Perfis fictícios nunca devem ser indexados.
    robots: p.isDemo ? { index: false, follow: false } : undefined,
  };
}

export default async function ProfessionalPage({ params }: PageProps<"/profissionais/[slug]">) {
  const { slug } = await params;
  const professional = await getProfessionalBySlug(slug);
  if (!professional) notFound();

  const [services, neighborhoodNames] = await Promise.all([
    listServices(),
    getNeighborhoodNames(professional.neighborhoodSlugs),
  ]);
  const offered = services.filter((s) => professional.serviceSlugs.includes(s.slug));
  const primaryService = offered[0];

  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container className="py-10 sm:py-12">
          <Breadcrumbs
            items={[
              { label: "Início", href: "/" },
              ...(primaryService ? [{ label: primaryService.name, href: `/servicos/${primaryService.slug}` }] : []),
              { label: professional.displayName },
            ]}
          />
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <ProfessionalAvatar name={professional.displayName} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {professional.isDemo && <DemoBadge label="Perfil demonstrativo" />}
                {/* Status real de moderação. "Verificado" só existirá com um procedimento de verificação. */}
                <Badge tone="neutral">Cadastro aprovado (exemplo)</Badge>
              </div>
              <h1 className="mt-2 text-[1.875rem] leading-tight font-extrabold sm:text-4xl">
                {professional.displayName}
              </h1>
              <p className="mt-1.5 text-lg text-ink-muted">{professional.headline}</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          {professional.isDemo && (
            <Alert tone="warning" title="Este perfil não representa uma pessoa ou empresa real">
              Ele existe apenas para demonstrar o layout do perfil profissional. Não há avaliações, selos ou
              verificações porque esses recursos ainda não foram implementados.
            </Alert>
          )}

          <section aria-labelledby="sobre">
            <h2 id="sobre" className="text-lg font-extrabold">
              Apresentação
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">{professional.about}</p>
          </section>

          <section aria-labelledby="servicos">
            <h2 id="servicos" className="text-lg font-extrabold">
              Serviços oferecidos
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {offered.map((s) => (
                <li key={s.slug}>
                  <Badge tone="brand" className="px-3 py-1 text-[0.8125rem]">
                    {s.name}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="portfolio">
            <h2 id="portfolio" className="text-lg font-extrabold">
              Portfólio
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="grid aspect-[4/3] place-items-center rounded-md border border-dashed border-line-strong bg-subtle text-ink-subtle"
                >
                  <ImageIcon aria-hidden className="size-5" />
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-subtle">
              O envio de fotos de trabalhos realizados estará disponível na Fase 2.
            </p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardBody className="space-y-4 text-[0.9375rem]">
              <p className="flex gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
                <span>
                  <strong className="block">Regiões atendidas</strong>
                  <span className="text-ink-muted">
                    {professional.servesWholeCity ? "Toda Joinville" : `${formatList(neighborhoodNames)} (Joinville)`}
                  </span>
                </span>
              </p>
              <p className="flex gap-3">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
                <span>
                  <strong className="block">Disponibilidade</strong>
                  <span className="text-ink-muted">{professional.availability}</span>
                </span>
              </p>
              {professional.yearsOfExperience !== undefined && (
                <p className="flex gap-3">
                  <Briefcase aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
                  <span>
                    <strong className="block">Experiência informada</strong>
                    <span className="text-ink-muted">{professional.yearsOfExperience} anos</span>
                  </span>
                </p>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-[0.9375rem] text-ink-muted">
                Para falar com profissionais, publique uma solicitação. Os contatos são liberados apenas com a sua
                autorização.
              </p>
              <ButtonLink
                href={primaryService ? `/solicitar?servico=${primaryService.slug}` : "/solicitar"}
                className="mt-4 w-full"
              >
                Solicitar serviço
              </ButtonLink>
            </CardBody>
          </Card>
        </aside>
      </Container>
    </>
  );
}
