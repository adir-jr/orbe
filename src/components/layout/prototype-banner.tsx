import { FlaskConical } from "lucide-react";

/**
 * Faixa exibida em todas as páginas enquanto o produto estiver na Fase 1.
 * Garante que nenhum visitante confunda o protótipo com um serviço em operação.
 */
export function PrototypeBanner() {
  return (
    <div className="border-b border-warning-200 bg-warning-50 text-warning-700">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[0.8125rem] font-medium">
        <FlaskConical aria-hidden className="size-3.5 shrink-0" />
        <span>
          Protótipo em desenvolvimento: nenhum dado é enviado ou armazenado, e os perfis exibidos são fictícios.
        </span>
      </p>
    </div>
  );
}
