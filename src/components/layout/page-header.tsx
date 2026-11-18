import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Você está em">
      <ol className="flex flex-wrap items-center gap-1 text-[0.8125rem] text-ink-subtle">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden className="size-3.5" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-700">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-ink-muted">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  aside,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-line bg-surface", className)}>
      <Container className="py-10 sm:py-14">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className={cn("flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", breadcrumbs && "mt-5")}>
          <div className="max-w-2xl">
            <h1 className="text-[2rem] leading-tight font-extrabold sm:text-[2.5rem]">{title}</h1>
            {description && <div className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">{description}</div>}
          </div>
          {aside}
        </div>
        {children}
      </Container>
    </div>
  );
}
