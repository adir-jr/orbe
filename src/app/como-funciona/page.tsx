import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { HowItWorks, PrivacyPromise } from "@/components/marketing/sections";
import { ButtonLink } from "@/components/ui/button";
import { MAX_CONTACT_GRANTS_PER_REQUEST, MAX_INTERESTS_PER_REQUEST } from "@/domain/contact-policy";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Entenda como o ORBE Serviços conecta clientes e profissionais em Joinville.",
  alternates: { canonical: "/como-funciona" },
};

const faq = [
  {
    q: "Quanto custa para quem contrata?",
    a: "Nada. Publicar solicitações e conversar com profissionais é gratuito para clientes.",
  },
  {
    q: "O ORBE garante o serviço ou o pagamento?",
    a: "Não. O ORBE Serviços facilita o contato entre você e profissionais. Valores, condições, execução e pagamento são combinados diretamente entre as partes. Recomendamos sempre conversar com calma, pedir referências e formalizar o que foi combinado.",
  },
  {
    q: "Quem pode ver a minha solicitação?",
    a: `Somente profissionais aprovados que atendem o serviço e o bairro informados. Eles veem a descrição, o bairro e o prazo — nunca o seu nome completo, telefone ou endereço. Até ${MAX_INTERESTS_PER_REQUEST} profissionais podem demonstrar interesse em cada pedido.`,
  },
  {
    q: "Como meu contato é compartilhado?",
    a: `Você escolhe, entre os interessados, para quem liberar o telefone: no máximo ${MAX_CONTACT_GRANTS_PER_REQUEST} profissionais por solicitação. Cada liberação fica registrada e pode ser revogada.`,
  },
  {
    q: "Os profissionais são verificados?",
    a: "Na fase piloto, cada cadastro de profissional é revisado pela equipe antes de ser aprovado. Isso não equivale a uma verificação de antecedentes ou de qualificação técnica, e nunca exibiremos selos de “verificado” sem um processo correspondente.",
  },
  {
    q: "Em quais cidades vocês atendem?",
    a: "Começamos por Joinville (SC). Outras cidades serão avaliadas depois que a operação local estiver consolidada.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Como funciona" }]}
        title="Como o ORBE Serviços funciona"
        description="Uma ponte simples entre quem precisa de um serviço e quem sabe fazer, com regras claras para as duas partes."
      />
      <HowItWorks showCta={false} />
      <PrivacyPromise />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="Perguntas frequentes" title="O que você precisa saber" />
          <div className="divide-y divide-line rounded-lg border border-line bg-surface">
            {faq.map((item) => (
              <details key={item.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {item.q}
                  <span
                    aria-hidden
                    className="grid size-7 shrink-0 place-items-center rounded-full bg-subtle text-ink-muted transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <Container className="flex flex-col items-start gap-4 rounded-xl border border-line bg-surface p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-extrabold">Pronto para começar?</h2>
            <p className="mt-1 text-ink-muted">Descreva o que você precisa em poucos passos.</p>
          </div>
          <ButtonLink href="/solicitar" size="lg">
            Solicitar serviço <ArrowRight />
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
