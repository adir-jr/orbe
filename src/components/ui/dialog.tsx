"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal acessível baseado no elemento nativo <dialog>:
 * foco preso, tecla Esc e fundo inerte sem dependências externas.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Fecha ao sair da página (Next.js preserva rotas ocultas com <Activity>).
  useLayoutEffect(() => () => ref.current?.close(), []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="dialog-title"
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-line bg-surface p-0 text-ink shadow-raised backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] open:animate-fade-up",
        className,
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="dialog-title" className="text-lg font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mt-1 -mr-2 grid size-9 place-items-center rounded-md text-ink-subtle hover:bg-subtle hover:text-ink"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>
        {description && <div className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{description}</div>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </dialog>
  );
}
