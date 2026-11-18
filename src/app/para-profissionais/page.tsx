import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CalendarCheck, ClipboardList, Eye, MapPinned, UserRoundPen } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/layout/container";
import { OrbitBackdrop } from "@/components/marketing/orbit-backdrop";
import { OpportunityCard } from "@/components/request/opportunity-card";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Para profissionais",
  description:
    "Crie seu perfil profissional e acompanhe oportunidades de serviço compatíveis com o seu trabalho em Joinville.",
  alternates: { canonical: "/para-profissionais" },
};

const steps = [
  {
    icon: UserRoundPen,
    title: "Crie seu perfil",
    text: "Informe nome profissional, serviços, bairros atendidos, disponibilidade e uma apresentação.",
  },
  {
    icon: BadgeCheck,
    title: "Passe pela revisão",
    text: "Nossa equipe revisa os cadastros antes de liberá-los, para manter a qualidade da plataforma.",
  },
  {
    icon: ClipboardList,
    title: "Veja oportunidades compatíveis",
    text: "Receba pedidos de clientes que precisam dos seus serviços, nos bairros que você atende.",
  },
  {
    icon: CalendarCheck,
    title: "Demonstre interesse e combine",
    text: "Quando o cliente liberar o contato, você conversa diretamente e combina valores e prazos.",
  },
];

const benefits = [
  {
    icon: MapPinned,
    title: "Oportunidades da sua região",
    text: "Você define categorias e bairros. Só aparecem pedidos compatíveis com o que você faz e onde atende.",
  },
  {
    icon: Eye,
    title: "Perfil profissional organizado",
    text: "Uma página clara para apresentar seu trabalho, especialidades e portfólio.",
  },
  {
    icon: ClipboardList,
    title: "Tudo em um só lugar",
    text: "Acompanhe as oportunidades de interesse e os contatos liberados em um painel simples.",
  },
];

export default function ForProfessionalsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-900 text-ink-inverse">
        <OrbitBackdrop tone="dark" className="top-1/2 -right-64 size-[44rem] -translate-y-1/2 sm:-right-40" />
        <Container className="relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-[0.8125rem] font-bold tracking-[0.08em] text-brand-200 uppercase">
              Para profissionais de Joinville
            </p>
            <h1 className="mt-4 text-[2.25rem] leading-[1.08] font-extrabold sm:text-5xl">
              Mais oportunidades para o seu trabalho, em um só lugar.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
              O ORBE Serviços reúne pedidos de pessoas que precisam de serviços na cidade e apresenta cada um aos
              profissionais que atendem aquele serviço e aquela região.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/cadastro?perfil=profissional" variant="inverse" size="lg">
                Quero criar meu perfil <ArrowRight />
              </ButtonLink>
              <ButtonLink
                href="#condicoes"
                variant="ghost"
                size="lg"
                className="text-brand-100 hover:bg-white/10 hover:text-ink-inverse"
              >
                Ver condições
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            <OpportunityCard
              demo
              className="shadow-raised"
              opportunity={{
                title: "Instalação de tomadas",
                categoryName: "Casa e manutenção · Eletricista",
                neighborhood: "América",
                city: "Joinville",
                urgencyLabel: "Nos próximos dias",
                summary:
                  "Cliente procura eletricista para instalação de novos pontos elétricos em residência.",
              }}
            />
            <p className="mt-3 text-center text-xs text-brand-200">
              Exemplo de como uma oportunidade será exibida
            </p>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Como funciona" title="Do cadastro ao primeiro contato" />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-lg border border-line bg-surface p-6 shadow-card">
                <span className="text-sm font-bold text-brand-600 tabular-nums">Passo {i + 1}</span>
                <s.icon aria-hidden className="mt-4 size-6 text-ink" strokeWidth={1.75} />
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section className="border-y border-line bg-surface">
        <Container className="grid gap-10 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title}>
              <span className="grid size-11 place-items-center rounded-md bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                <b.icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">{b.text}</p>
            </div>
          ))}
        </Container>
      </Section>

      <Section id="condicoes" className="scroll-mt-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading
            eyebrow="Condições comerciais"
            title="Transparência desde o início"
            description="Preferimos ser claros sobre o que já está definido e o que ainda está em validação."
          />
          <div className="space-y-4">
            <div className="rounded-lg border border-line bg-surface p-6 shadow-card">
              <p className="text-sm font-semibold text-ink-muted">Cadastro e perfil</p>
              <p className="mt-1 text-3xl font-extrabold">Gratuito</p>
              <p className="mt-2 text-[0.9375rem] text-ink-muted">
                Criar e manter seu perfil profissional não terá custo.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface p-6 shadow-card">
              <p className="text-sm font-semibold text-ink-muted">Acesso às oportunidades</p>
              <p className="mt-1 text-3xl font-extrabold">
                R$ 49,90<span className="text-base font-semibold text-ink-subtle">/mês · valor previsto</span>
              </p>
              <p className="mt-2 text-[0.9375rem] text-ink-muted">
                Estudamos uma assinatura mensal de valor fixo, sem comissão sobre os serviços. Valor, limites e
                regras ainda estão em validação e serão apresentados com antecedência, antes de qualquer cobrança.
                Durante o piloto, o acesso será liberado sem custo para profissionais selecionados.
              </p>
            </div>
            <Alert tone="info" title="O que não prometemos">
              Não garantimos quantidade de pedidos, clientes ou renda. O volume de oportunidades depende da demanda
              real em cada categoria e região.
            </Alert>
          </div>
        </Container>
      </Section>
    </>
  );
}
