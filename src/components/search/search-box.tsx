"use client";

import { useRouter } from "next/navigation";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { rankBySearch } from "@/domain/search";
import { cn } from "@/lib/utils";

export interface SearchOption {
  label: string;
  hint: string;
  href: string;
  keywords: readonly string[];
}

/**
 * Busca com sugestões (combobox acessível).
 * Funciona sem JavaScript: o formulário envia GET para /buscar?q=...
 */
export function SearchBox({
  options,
  defaultValue = "",
  size = "lg",
  className,
  autoFocus,
}: {
  options: SearchOption[];
  defaultValue?: string;
  size?: "md" | "lg";
  className?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  useLayoutEffect(() => () => setOpen(false), []);

  const suggestions = useMemo(
    () =>
      rankBySearch(options, query, (o) => ({ name: o.label, keywords: o.keywords, extra: [o.hint] })).slice(0, 6),
    [options, query],
  );

  const showList = open && query.trim().length >= 2;

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      go(suggestions[active].href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const tall = size === "lg";

  return (
    <form action="/buscar" method="get" role="search" className={cn("relative", className)}>
      <label htmlFor={`${listId}-input`} className="sr-only">
        Qual serviço você procura?
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-line-strong bg-surface shadow-card transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100",
          tall ? "p-1.5 pl-4" : "p-1 pl-3.5",
        )}
      >
        <Search aria-hidden className="size-5 shrink-0 text-ink-subtle" />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          name="q"
          type="search"
          autoComplete="off"
          autoFocus={autoFocus}
          maxLength={80}
          value={query}
          placeholder="Ex.: eletricista, diarista, vazamento…"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-subtle [&::-webkit-search-cancel-button]:hidden",
            tall ? "h-11 text-base sm:text-[1.0625rem]" : "h-10 text-[0.9375rem]",
          )}
        />
        <button
          type="submit"
          className={cn(
            "shrink-0 rounded-md bg-brand-700 font-semibold text-ink-inverse transition-colors hover:bg-brand-800",
            tall ? "h-11 px-4 sm:px-6" : "h-10 px-4 text-sm",
          )}
        >
          Buscar
        </button>
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Sugestões"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-line bg-surface py-1.5 shadow-raised"
        >
          {suggestions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink-muted">
              Nenhuma sugestão. Pressione <strong>Buscar</strong> para ver todos os resultados.
            </li>
          ) : (
            suggestions.map((s, i) => (
              <li
                key={s.href}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  go(s.href);
                }}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5",
                  i === active && "bg-subtle",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink">{s.label}</span>
                  <span className="block truncate text-[0.8125rem] text-ink-subtle">{s.hint}</span>
                </span>
                <ArrowUpRight aria-hidden className="size-4 shrink-0 text-ink-subtle" />
              </li>
            ))
          )}
        </ul>
      )}
    </form>
  );
}
