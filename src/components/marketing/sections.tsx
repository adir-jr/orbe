import { ArrowRight, EyeOff, Handshake, ListChecks, MessageSquareText, UserRoundCheck, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section, SectionHeading } from "@/components/layout/container";
import { MAX_CONTACT_GRANTS_PER_REQUEST } from "@/domain/contact-policy";
import { OrbitBackdrop } from "./orbit-backdrop";

const clientSteps = [
  {
    icon: ListChecks,
    title: "Descreva o que precisa",
    text: "Escolha o serviço e responda a poucas perguntas: o que é, em qual bairro e para quando.",
  },
  {
    icon: Users,
    title: "Receba o interesse de profissionais",
    text: "Profissionais da sua região que atendem esse serviço podem demonstrar interesse no pedido.",
  },
  {
    icon: UserRoundCheck,
    title: "Escolha com quem conversar",
    text: "Veja os perfis e libere seu contato apenas para quem você preferir. A negociação é direta.",
  },
];

export function HowItWorks({ showCta = true }: { showCta?: boolean }) {
  return (
    <Section id="como-funciona">
      <Container>
        <SectionHeading
          eyebrow="Como funciona"
          title="Três passos, sem complicação"
          description="Você não precisa ligar para vários lugares nem procurar em grupos de mensagens."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {clientSteps.map((step, i) => (
            <li key={step.title} className="relative rounded-lg border border-line bg-surface p-6 shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-md bg-brand-700 text-ink-inverse">
                  <step.icon aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <span className="text-4xl font-extrabold text-line tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
        {showCta && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/solicitar" size="lg">
              Solicitar um serviço <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/como-funciona" variant="outline" size="lg">
              Entenda os detalhes
            </ButtonLink>
          </div>
        )}
      </Container>
    </Section>
  );
}

export function PrivacyPromise() {
  const points = [
    {
      icon: EyeOff,
      title: "Seu contato não fica exposto",
      text: "Telefone, e-mail e endereço completo nunca aparecem em listagens ou páginas públicas.",
    },
    {
      icon: UserRoundCheck,
      title: "Você escolhe quem recebe",
      text: `O contato é liberado individualmente, para no máximo ${MAX_CONTACT_GRANTS_PER_REQUEST} profissionais por pedido.`,
    },
    {
      icon: Handshake,
      title: "Negociação direta e transparente",
      text: "Valores e condições são combinados entre você e o profissional. A plataforma faz a conexão.",
    },
  ];
  return (
    <Section className="border-y border-line bg-surface">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <SectionHeading
          eyebrow="Transparência"
          title="Privacidade como regra, não como opção"
          description="Construímos a plataforma para que você tenha controle sobre os seus dados desde o primeiro pedido."
        />
        <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
          {points.map((p) => (
            <li key={p.title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                <p.icon aria-hidden className="size-4.5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-bold">{p.title}</h3>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function ProfessionalCta() {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-xl bg-brand-900 px-6 py-12 text-ink-inverse sm:px-12 sm:py-16">
          <OrbitBackdrop tone="dark" className="-top-40 -right-40 size-[34rem] opacity-90 sm:-right-24" />
          <div className="relative max-w-xl">
            <p className="text-[0.8125rem] font-bold tracking-[0.08em] text-brand-200 uppercase">Para profissionais</p>
            <h2 className="mt-3 text-[1.75rem] leading-tight font-extrabold sm:text-[2.25rem]">
              Mais oportunidades para o seu trabalho, em um só lugar.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-100 sm:text-lg">
              Crie um perfil profissional, informe os serviços e bairros que você atende e acompanhe pedidos
              compatíveis com o seu trabalho em Joinville.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/para-profissionais" variant="inverse" size="lg">
                Conhecer a proposta <ArrowRight />
              </ButtonLink>
            </div>
            <p className="mt-5 flex items-center gap-2 text-[0.8125rem] text-brand-200">
              <MessageSquareText aria-hidden className="size-4" />
              Cadastro inicial gratuito. Condições comerciais apresentadas antes de qualquer cobrança.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
