import { CircleCheck, Lock, MapPin, Zap } from "lucide-react";
import { OrbitBackdrop } from "./orbit-backdrop";

/**
 * Ilustração do fluxo principal (não é um dado real).
 * Mostra, em três momentos, o que o cliente verá: pedido publicado,
 * interesse de profissionais e controle sobre o próprio contato.
 */
export function HeroIllustration() {
  return (
    <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
      <OrbitBackdrop className="-inset-16 opacity-80 sm:-inset-20" />

      <div className="relative space-y-3">
        <div className="animate-fade-up rounded-lg border border-line bg-surface p-4 shadow-raised sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-subtle">Sua solicitação</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-100 ring-inset">
              <span className="size-1.5 rounded-full bg-brand-500" /> Publicada
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
              <Zap aria-hidden className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-bold">Instalação de tomadas</p>
              <p className="flex items-center gap-1 text-[0.8125rem] text-ink-muted">
                <MapPin aria-hidden className="size-3" /> América · próximos dias
              </p>
            </div>
          </div>
        </div>

        <div className="ml-6 animate-fade-up rounded-lg border border-line bg-surface p-4 shadow-raised [animation-delay:120ms] sm:ml-10 sm:p-5">
          <p className="text-xs font-semibold text-ink-subtle">Profissionais interessados</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["EA", "MS", "RC"].map((i, idx) => (
                <span
                  key={i}
                  className="grid size-8 place-items-center rounded-full text-[0.6875rem] font-bold text-ink-inverse ring-2 ring-surface"
                  style={{ background: ["var(--color-brand-800)", "var(--color-brand-600)", "var(--color-brand-300)"][idx] }}
                >
                  {i}
                </span>
              ))}
            </div>
            <p className="text-sm font-semibold">3 querem atender você</p>
          </div>
        </div>

        <div className="mr-4 animate-fade-up rounded-lg border border-brand-100 bg-brand-50 p-4 [animation-delay:240ms] sm:mr-8">
          <div className="flex items-start gap-3">
            <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-700" />
            <p className="text-sm leading-snug text-brand-900">
              <strong>Você decide</strong> quem recebe o seu telefone.
              <span className="mt-1.5 flex items-center gap-1 text-[0.8125rem] text-brand-700">
                <CircleCheck aria-hidden className="size-3.5" /> Contato liberado para 1 profissional
              </span>
            </p>
          </div>
        </div>
      </div>
      <figcaption className="relative mt-4 text-center text-xs text-ink-subtle">
        Ilustração do funcionamento previsto
      </figcaption>
    </figure>
  );
}
