import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-subtle text-ink-muted ring-line",
  brand: "bg-brand-50 text-brand-800 ring-brand-100",
  success: "bg-success-50 text-success-700 ring-success-700/15",
  warning: "bg-warning-50 text-warning-700 ring-warning-200",
  danger: "bg-danger-50 text-danger-700 ring-danger-600/15",
};

export function Badge({ tone = "neutral", className, ...props }: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset [&_svg]:size-3.5",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Selo padrão para qualquer conteúdo fictício exibido na Fase 1. */
export function DemoBadge({ className, label = "Demonstrativo" }: { className?: string; label?: string }) {
  return (
    <Badge tone="warning" className={className}>
      <span aria-hidden className="size-1.5 rounded-full bg-warning-700" />
      {label}
    </Badge>
  );
}
