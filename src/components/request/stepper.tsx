import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
}: {
  steps: readonly { id: string; title: string }[];
  current: number;
}) {
  return (
    <nav aria-label="Etapas da solicitação">
      <p className="mb-3 text-[0.8125rem] font-semibold text-ink-subtle sm:hidden">
        Etapa {current + 1} de {steps.length} · <span className="text-ink">{steps[current].title}</span>
      </p>
      <ol className="flex gap-1.5 sm:gap-3">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step.id} className="flex-1" aria-current={active ? "step" : undefined}>
              <div
                className={cn(
                  "h-1 rounded-full transition-colors duration-300",
                  done || active ? "bg-brand-600" : "bg-line",
                )}
              />
              <div className="mt-2.5 hidden items-center gap-2 sm:flex">
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[0.6875rem] font-bold",
                    done && "bg-brand-600 text-ink-inverse",
                    active && "bg-brand-50 text-brand-800 ring-1 ring-brand-600",
                    !done && !active && "bg-subtle text-ink-subtle",
                  )}
                >
                  {done ? <Check aria-hidden className="size-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn("text-[0.8125rem] font-semibold", active ? "text-ink" : "text-ink-subtle")}>
                  {step.title}
                  {done && <span className="sr-only"> (concluída)</span>}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
