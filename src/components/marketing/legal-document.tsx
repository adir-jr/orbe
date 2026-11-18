import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

export function LegalDocument({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Início", href: "/" }, { label: title }]}
        title={title}
        description={intro}
      />
      <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="Seções" className="hidden lg:block">
          <ol className="sticky top-24 space-y-2 text-sm">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#secao-${i + 1}`} className="text-ink-muted hover:text-brand-700">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="max-w-2xl">
          <Alert tone="warning" title="Minuta para revisão jurídica" role="alert">
            Este texto é uma versão preliminar elaborada durante o desenvolvimento do produto. Ele não tem validade
            jurídica e deve ser revisado por profissional habilitado antes do lançamento.
          </Alert>
          <div className="mt-10 space-y-10">
            {sections.map((s, i) => (
              <section key={s.title} id={`secao-${i + 1}`} className="scroll-mt-24">
                <h2 className="text-xl font-extrabold">
                  {i + 1}. {s.title}
                </h2>
                <div className="mt-3 space-y-3 text-[0.9375rem] leading-relaxed text-ink-muted [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </article>
      </Container>
    </>
  );
}
