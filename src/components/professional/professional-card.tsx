import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ProfessionalSummary } from "@/domain/types";
import { DemoBadge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";

export function ProfessionalAvatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-20 text-2xl" : "size-12 text-base";
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full bg-brand-800 font-bold tracking-tight text-ink-inverse ring-4 ring-surface ${box}`}
    >
      {initials(name)}
    </span>
  );
}

/**
 * Card de profissional. Não exibe avaliações nem selos de verificação:
 * esses recursos ainda não existem e não devem ser simulados.
 */
export function ProfessionalCard({
  professional,
  serviceNames,
}: {
  professional: ProfessionalSummary;
  serviceNames: string[];
}) {
  return (
    <article className="relative flex flex-col rounded-lg border border-line bg-surface p-5 shadow-card transition hover:border-line-strong hover:shadow-raised">
      <div className="flex items-start gap-4">
        <ProfessionalAvatar name={professional.displayName} />
        <div className="min-w-0 flex-1">
          {professional.isDemo && <DemoBadge label="Perfil demonstrativo" className="mb-1.5" />}
          <h3 className="truncate font-bold">
            <Link
              href={`/profissionais/${professional.slug}`}
              className="after:absolute after:inset-0 after:rounded-lg"
            >
              {professional.displayName}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-ink-muted">{professional.headline}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {serviceNames.map((name) => (
          <span key={name} className="rounded-full bg-subtle px-2.5 py-1 text-xs font-semibold text-ink-muted">
            {name}
          </span>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-1.5 border-t border-line pt-3.5 text-[0.8125rem] text-ink-subtle">
        <MapPin aria-hidden className="size-3.5" />
        {professional.servesWholeCity
          ? "Atende toda Joinville"
          : `Atende ${professional.neighborhoodSlugs.length} bairros de Joinville`}
      </p>
    </article>
  );
}
