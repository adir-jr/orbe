import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-md border bg-surface text-ink placeholder:text-ink-subtle transition-colors outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-subtle disabled:text-ink-subtle";

const controlState = (invalid?: boolean) =>
  invalid ? "border-danger-600 focus:border-danger-600 focus:ring-danger-50" : "border-line-strong";

type ControlProps = { invalid?: boolean };

export function Input({ className, invalid, ...props }: ComponentProps<"input"> & ControlProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(controlBase, controlState(invalid), "h-11 px-3.5 text-[0.9375rem]", className)}
      {...props}
    />
  );
}

export function Textarea({ className, invalid, ...props }: ComponentProps<"textarea"> & ControlProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(controlBase, controlState(invalid), "min-h-32 px-3.5 py-3 text-[0.9375rem] leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({ className, invalid, children, ...props }: ComponentProps<"select"> & ControlProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(controlBase, controlState(invalid), "h-11 appearance-none pr-10 pl-3.5 text-[0.9375rem]", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-subtle" />
    </div>
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("text-sm font-semibold text-ink", className)} {...props} />;
}

/**
 * Agrupa rótulo, controle, ajuda e erro com os atributos de acessibilidade corretos.
 * O controle deve receber `id={id}` e `aria-describedby={describedBy}`.
 */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: (a11y: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-subtle">(opcional)</span>}
      </Label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-[0.8125rem] text-ink-subtle">
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-[0.8125rem] font-medium text-danger-700">
      {message}
    </p>
  );
}
