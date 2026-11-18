import type { Metadata } from "next";
import Link from "next/link";
import { AuthPreview } from "@/components/marketing/auth-preview";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-controls";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthPreview
      title="Entrar na sua conta"
      description="Acompanhe suas solicitações ou as oportunidades do seu perfil profissional."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-brand-700 hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      <Field id="email" label="E-mail">
        {(a) => <Input id={a.id} type="email" autoComplete="email" placeholder="voce@exemplo.com" />}
      </Field>
      <Field id="password" label="Senha">
        {(a) => <Input id={a.id} type="password" autoComplete="current-password" placeholder="••••••••" />}
      </Field>
      <Button type="submit" size="lg" className="w-full">
        Entrar
      </Button>
    </AuthPreview>
  );
}
