import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Marca provisória: um anel (a "órbita") com um ponto em movimento,
 * representando a conexão entre quem precisa e quem faz.
 */
export function OrbeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="16" r="4" fill="currentColor" />
      <circle cx="26.4" cy="8.2" r="3.2" fill="var(--color-brand-300)" stroke="var(--color-surface)" strokeWidth="1.6" />
    </svg>
  );
}

export function Logo({
  className,
  inverse = false,
  onNavigate,
}: {
  className?: string;
  inverse?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/"
      onNavigate={onNavigate}
      aria-label={`${siteConfig.name} — página inicial`}
      className={cn(
        "inline-flex items-center gap-2 rounded-md",
        inverse ? "text-ink-inverse" : "text-brand-800",
        className,
      )}
    >
      <OrbeMark className="size-7" />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className={cn("text-[1.3rem] font-extrabold tracking-[-0.04em]", inverse ? "text-ink-inverse" : "text-ink")}>
          orbe
        </span>
        <span className={cn("text-[0.8125rem] font-semibold tracking-tight", inverse ? "text-brand-200" : "text-ink-subtle")}>
          serviços
        </span>
      </span>
    </Link>
  );
}
