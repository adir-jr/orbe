import { cn } from "@/lib/utils";

/** Anéis concêntricos com pontos em órbita — motivo visual da marca. */
export function OrbitBackdrop({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const ring = tone === "light" ? "var(--color-line-strong)" : "rgb(255 255 255 / 0.14)";
  const dot = tone === "light" ? "var(--color-brand-500)" : "var(--color-brand-200)";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      <svg viewBox="0 0 600 600" className="size-full">
        <g fill="none" stroke={ring} strokeWidth="1">
          <circle cx="300" cy="300" r="140" />
          <circle cx="300" cy="300" r="210" strokeDasharray="2 6" />
          <circle cx="300" cy="300" r="290" />
        </g>
      </svg>
      <div className="absolute inset-0 animate-orbit">
        <svg viewBox="0 0 600 600" className="size-full">
          <circle cx="300" cy="10" r="5" fill={dot} />
          <circle cx="90" cy="300" r="3.5" fill={dot} opacity="0.6" />
        </svg>
      </div>
      <div className="absolute inset-0 animate-orbit [animation-direction:reverse] [animation-duration:42s]">
        <svg viewBox="0 0 600 600" className="size-full">
          <circle cx="510" cy="300" r="4" fill={dot} opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}
