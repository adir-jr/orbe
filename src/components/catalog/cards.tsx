import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { CategoryWithServices, Service } from "@/domain/types";
import { IconTile } from "./service-icon";

export function CategoryCard({ category, maxServices = 4 }: { category: CategoryWithServices; maxServices?: number }) {
  const shown = category.services.slice(0, maxServices);
  const remaining = category.services.length - shown.length;
  return (
    <article className="group relative flex flex-col rounded-lg border border-line bg-surface p-5 shadow-card transition hover:border-line-strong hover:shadow-raised sm:p-6">
      <div className="flex items-start justify-between">
        <IconTile icon={category.icon} size="lg" />
        <ArrowRight aria-hidden className="size-5 text-ink-subtle transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
      </div>
      <h3 className="mt-5 text-lg font-bold">
        <Link href={`/categorias/${category.slug}`} className="after:absolute after:inset-0 after:rounded-lg">
          {category.name}
        </Link>
      </h3>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">{category.description}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
        {shown.map((s) => (
          <li key={s.slug} className="rounded-full bg-subtle px-2.5 py-1 text-[0.8125rem] font-medium text-ink-muted">
            {s.name}
          </li>
        ))}
        {remaining > 0 && (
          <li className="px-1 py-1 text-[0.8125rem] font-medium text-ink-subtle">+{remaining}</li>
        )}
      </ul>
    </article>
  );
}

export function ServiceLinkCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/servicos/${service.slug}`}
      className="group flex items-center gap-4 rounded-lg border border-line bg-surface p-4 shadow-card transition hover:border-brand-200 hover:bg-brand-50/40"
    >
      <IconTile icon={service.icon} />
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-ink">{service.name}</span>
        <span className="mt-0.5 line-clamp-2 block text-sm leading-snug text-ink-muted">{service.summary}</span>
      </span>
      <ChevronRight aria-hidden className="size-4 shrink-0 text-ink-subtle transition group-hover:translate-x-0.5 group-hover:text-brand-700" />
    </Link>
  );
}

export function ServiceChip({ service }: { service: Service }) {
  return (
    <Link
      href={`/servicos/${service.slug}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] font-semibold text-ink-muted transition hover:border-brand-200 hover:text-brand-700"
    >
      {service.name}
    </Link>
  );
}
