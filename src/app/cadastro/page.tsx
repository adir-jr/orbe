import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthPreview } from "@/components/marketing/auth-preview";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-controls";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

export default function SignUpPage(props: PageProps<"/cadastro">) {
  return (
    <Suspense fallback={<SignUpForm role="cliente" />}>
      <SignUpLoader searchParams={props.searchParams} />
    </Suspense>
  );
}

async function SignUpLoader({ searchParams }: { searchParams: PageProps<"/cadastro">["searchParams"] }) {
  const { perfil } = await searchParams;
  return <SignUpForm role={perfil === "profissional" ? "profissional" : "cliente"} />;
}

function SignUpForm({ role }: { role: "cliente" | "profissional" }) {
  const isPro = role === "profissional";
  return (
    <AuthPreview
      title={isPro ? "Criar perfil profissional" : "Criar sua conta"}
      description={
        isPro
          ? "Comece com as informações essenciais. Você completa o perfil depois."
          : "Gratuito para quem contrata serviços."
      }
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/entrar" className="font-semibold text-brand-700 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <div role="group" aria-label="Tipo de conta" className="grid grid-cols-2 gap-1 rounded-md bg-subtle p-1">
        {(
          [
            ["cliente", "Quero contratar", "/cadastro"],
            ["profissional", "Sou profissional", "/cadastro?perfil=profissional"],
          ] as const
        ).map(([value, label, href]) => (
          <Link
            key={value}
            href={href}
            aria-current={role === value ? "page" : undefined}
            className={cn(
              "rounded-[0.4rem] px-3 py-2 text-center text-sm font-semibold transition",
              role === value ? "bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink",
            )}
          >
            {label}
          </Link>
        ))}
      </div>
      <Field id="name" label={isPro ? "Nome profissional ou nome fantasia" : "Nome"}>
        {(a) => <Input id={a.id} autoComplete="name" />}
      </Field>
      <Field id="email" label="E-mail">
        {(a) => <Input id={a.id} type="email" autoComplete="email" />}
      </Field>
      <Field id="phone" label="Celular (WhatsApp)" hint="Compartilhado apenas com a sua autorização.">
        {(a) => <Input id={a.id} aria-describedby={a.describedBy} type="tel" autoComplete="tel" />}
      </Field>
      {isPro && (
        <Field id="services" label="Serviços que você oferece">
          {(a) => <Input id={a.id} placeholder="Ex.: eletricista, reparos gerais" />}
        </Field>
      )}
      <Field id="password" label="Senha">
        {(a) => <Input id={a.id} type="password" autoComplete="new-password" />}
      </Field>
      <Button type="submit" size="lg" className="w-full">
        Criar conta
      </Button>
    </AuthPreview>
  );
}
