import Link from "next/link";
import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Alert } from "@/components/ui/alert";

/**
 * Moldura das telas de autenticação na Fase 1.
 * Os campos ficam desativados: a autenticação real (Supabase Auth) chega na Fase 2.
 */
export function AuthPreview({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <Container className="flex justify-center py-12 sm:py-20">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-line bg-surface p-6 shadow-card sm:p-8">
          <Logo />
          <h1 className="mt-6 text-2xl font-extrabold">{title}</h1>
          <p className="mt-1.5 text-[0.9375rem] text-ink-muted">{description}</p>
          <Alert tone="warning" title="Disponível na próxima fase" className="mt-6">
            O acesso com conta ainda não está ativo. Os campos abaixo mostram apenas como a tela funcionará.
          </Alert>
          <fieldset disabled className="mt-6 space-y-4">
            <legend className="sr-only">Formulário desativado</legend>
            {children}
          </fieldset>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-ink-subtle">
            <Lock aria-hidden className="size-3.5" />
            Conexão segura e dados protegidos conforme a LGPD.
          </p>
        </div>
        <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>
        <p className="mt-3 text-center text-sm">
          <Link href="/" className="font-semibold text-brand-700 hover:underline">
            Voltar ao início
          </Link>
        </p>
      </div>
    </Container>
  );
}
