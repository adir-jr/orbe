import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ServiceLinkCard } from "@/components/catalog/cards";
import { IconTile } from "@/components/catalog/service-icon";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { getCategoryBySlug, listCategories } from "@/server/catalog";

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categorias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} em Joinville`,
    description: `${category.description} Solicite ${category.services
      .slice(0, 3)
      .map((s) => s.name.toLowerCase())
      .join(", ")} e outros serviços em Joinville, SC.`,
    alternates: { canonical: `/categorias/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/categorias/[slug]">) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Categorias", href: "/categorias" },
          { label: category.name },
        ]}
        title={
          <span className="flex items-center gap-4">
            <IconTile icon={category.icon} size="lg" className="hidden sm:grid" />
            {category.name}
          </span>
        }
        description={category.description}
        aside={
          <ButtonLink href="/solicitar" size="lg" className="self-start lg:self-auto">
            Solicitar serviço <ArrowRight />
          </ButtonLink>
        }
      />
      <Container className="py-12 sm:py-16">
        <h2 className="text-sm font-bold tracking-wide text-ink-subtle uppercase">
          {category.services.length} serviços nesta categoria
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((s) => (
            <ServiceLinkCard key={s.slug} service={s} />
          ))}
        </div>
      </Container>
    </>
  );
}
