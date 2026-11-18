import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-subtle text-ink-muted">
        <Icon aria-hidden className="size-5" />
      </span>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <div className="mt-1.5 max-w-md text-[0.9375rem] text-ink-muted">{description}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Spinner({ className, label = "Carregando" }: { className?: string; label?: string }) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-sm text-ink-muted", className)}>
      <span
        aria-hidden
        className="size-4 animate-spin rounded-full border-2 border-line-strong border-t-brand-600"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-subtle", className)} />;
}
