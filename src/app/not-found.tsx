import { Compass } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";

export default function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <EmptyState
        icon={Compass}
        title="Página não encontrada"
        description="O endereço pode ter mudado ou o conteúdo não está mais disponível."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <ButtonLink href="/">Ir para o início</ButtonLink>
            <ButtonLink href="/categorias" variant="outline">
              Ver categorias
            </ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
