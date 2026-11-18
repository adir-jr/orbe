"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";

/**
 * Menu de navegação para telas pequenas.
 *
 * Renderizado via portal no <body>: o cabeçalho usa backdrop-filter, que faria
 * um elemento `position: fixed` ficar preso dentro dele.
 */
export function MobileMenu({ items }: { items: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Rotas ficam preservadas (ocultas) pelo Next.js: fecha o menu ao sair.
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);

  const linkClass = "flex items-center justify-between border-b border-line py-4 text-lg font-semibold";

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Abrir menu"
        className="-mr-2 grid size-11 place-items-center rounded-md text-ink hover:bg-subtle"
      >
        <Menu className="size-5" />
      </button>

      {open &&
        createPortal(
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex animate-fade-up flex-col overflow-y-auto bg-canvas md:hidden"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
              <Logo onNavigate={close} />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Fechar menu"
                className="-mr-2 grid size-11 place-items-center rounded-md text-ink hover:bg-subtle"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Menu principal" className="flex flex-col px-4 py-4">
              {items.map((item) => (
                <Link key={item.href} href={item.href} onNavigate={close} className={linkClass}>
                  {item.label}
                  <ArrowRight aria-hidden className="size-4 text-ink-subtle" />
                </Link>
              ))}
              <Link href="/entrar" onNavigate={close} className={linkClass}>
                Entrar
                <ArrowRight aria-hidden className="size-4 text-ink-subtle" />
              </Link>
              <ButtonLink href="/solicitar" size="lg" className="mt-6" onNavigate={close}>
                Solicitar serviço
              </ButtonLink>
              <ButtonLink href="/para-profissionais" variant="outline" size="lg" className="mt-3" onNavigate={close}>
                Sou profissional
              </ButtonLink>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
