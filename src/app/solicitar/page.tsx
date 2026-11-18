import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/layout/page-header";
import { RequestWizard } from "@/components/request/request-wizard";
import { Skeleton } from "@/components/ui/feedback";
import { listCategoriesWithServices, listNeighborhoods } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Solicitar serviço",
  description: "Descreva o serviço de que você precisa em Joinville em poucos passos.",
  robots: { index: false, follow: true },
};

export default function RequestPage(props: PageProps<"/solicitar">) {
  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Início", href: "/" }, { label: "Solicitar serviço" }]} />
      <div className="mt-5 mb-8 max-w-2xl">
        <h1 className="text-[2rem] leading-tight font-extrabold sm:text-[2.5rem]">Solicitar um serviço</h1>
        <p className="mt-2 text-base text-ink-muted sm:text-lg">
          Leva cerca de dois minutos. É gratuito para quem contrata.
        </p>
      </div>
      <Suspense fallback={<WizardFallback />}>
        <WizardLoader searchParams={props.searchParams} />
      </Suspense>
    </Container>
  );
}

async function WizardLoader({ searchParams }: { searchParams: PageProps<"/solicitar">["searchParams"] }) {
  const [params, categories, neighborhoods] = await Promise.all([
    searchParams,
    listCategoriesWithServices(),
    listNeighborhoods("joinville"),
  ]);
  const raw = params.servico;
  const initialServiceSlug = Array.isArray(raw) ? raw[0] : raw;

  return (
    <RequestWizard
      // Reinicia o formulário quando o serviço da URL muda.
      key={initialServiceSlug ?? "none"}
      categories={categories}
      neighborhoods={neighborhoods}
      initialServiceSlug={initialServiceSlug}
    />
  );
}

function WizardFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4 rounded-xl border border-line bg-surface p-8">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="mt-6 h-8 w-64" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
      <Skeleton className="hidden h-40 lg:block" />
    </div>
  );
}
