"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldError } from "./form-controls";

export interface ChoiceOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}

/**
 * Grupo de opções exclusivas (radio) com aparência de cartões ou pílulas.
 * Usa inputs nativos: navegação por setas e leitores de tela funcionam sem código extra.
 */
export function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  variant = "card",
  columns = 2,
  optional,
  hideLegend,
}: {
  name: string;
  legend: ReactNode;
  options: ChoiceOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  variant?: "card" | "pill";
  columns?: 1 | 2 | 3;
  optional?: boolean;
  hideLegend?: boolean;
}) {
  const errorId = error ? `${name}-error` : undefined;
  const grid = { 1: "grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" }[columns];

  return (
    <fieldset aria-describedby={errorId} aria-invalid={error ? true : undefined}>
      <legend className={cn("mb-2.5 text-sm font-semibold text-ink", hideLegend && "sr-only")}>
        {legend}
        {optional && <span className="ml-1.5 font-normal text-ink-subtle">(opcional)</span>}
      </legend>
      <div className={cn(variant === "card" ? `grid gap-2.5 ${grid}` : "flex flex-wrap gap-2")}>
        {options.map((opt) => {
          const checked = value === opt.value;
          const id = `${name}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                "relative cursor-pointer transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-brand-200",
                variant === "card"
                  ? "flex items-start gap-3 rounded-md border bg-surface p-3.5"
                  : "inline-flex items-center gap-1.5 rounded-full border bg-surface px-4 py-2 text-sm font-semibold",
                checked
                  ? "border-brand-600 bg-brand-50 text-brand-900"
                  : error
                    ? "border-danger-600/60 hover:border-danger-600"
                    : "border-line-strong hover:border-ink-subtle",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {variant === "card" && opt.icon}
              <span className="min-w-0 flex-1">
                <span className={cn("block", variant === "card" && "font-semibold")}>{opt.label}</span>
                {opt.description && (
                  <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-muted">{opt.description}</span>
                )}
              </span>
              {variant === "card" && (
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                    checked ? "border-brand-600 bg-brand-600 text-ink-inverse" : "border-line-strong",
                  )}
                >
                  {checked && <Check className="size-3" strokeWidth={3} />}
                </span>
              )}
              {variant === "pill" && checked && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
            </label>
          );
        })}
      </div>
      <div className="mt-2">
        <FieldError id={errorId} message={error} />
      </div>
    </fieldset>
  );
}
