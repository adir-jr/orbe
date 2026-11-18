import { CalendarDays, MapPin, Tag } from "lucide-react";
import { DemoBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OpportunityPreview {
  title: string;
  categoryName: string;
  neighborhood: string;
  city: string;
  urgencyLabel: string;
  summary: string;
}

/**
 * Card de oportunidade, como será visto pelo profissional.
 * Contém SOMENTE dados que não identificam o cliente: nada de nome,
 * telefone, e-mail ou endereço completo (ver docs/product.md).
 */
export function OpportunityCard({
  opportunity,
  demo = false,
  className,
}: {
  opportunity: OpportunityPreview;
  demo?: boolean;
  className?: string;
}) {
  return (
    <article className={cn("rounded-lg border border-line bg-surface p-5 text-ink shadow-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[1.0625rem] font-bold">{opportunity.title}</h3>
        {demo && <DemoBadge label="Exemplo" />}
      </div>
      <dl className="mt-3 grid gap-1.5 text-sm text-ink-muted">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Categoria</dt>
          <Tag aria-hidden className="size-3.5 text-ink-subtle" />
          <dd>{opportunity.categoryName}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Região</dt>
          <MapPin aria-hidden className="size-3.5 text-ink-subtle" />
          <dd>
            {opportunity.neighborhood}, {opportunity.city}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Prazo</dt>
          <CalendarDays aria-hidden className="size-3.5 text-ink-subtle" />
          <dd>{opportunity.urgencyLabel}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">{opportunity.summary}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-ink-subtle">Contato liberado somente com autorização do cliente</p>
        <Button size="sm" disabled={demo} aria-disabled={demo} title={demo ? "Exemplo ilustrativo" : undefined}>
          Tenho interesse
        </Button>
      </div>
    </article>
  );
}
