"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-16 sm:py-24">
      <EmptyState
        icon={TriangleAlert}
        title="Algo não saiu como esperado"
        description="Não foi possível carregar esta página. Verifique sua conexão e tente novamente."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset}>
              <RotateCcw /> Tentar novamente
            </Button>
            <ButtonLink href="/" variant="outline">
              Ir para o início
            </ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
