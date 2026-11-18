import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";

export const metadata: Metadata = {
  title: "Termos de uso (minuta)",
  alternates: { canonical: "/termos" },
};

export default function TermsPage() {
  return (
    <LegalDocument
      title="Termos de uso"
      intro="Regras gerais para utilização do ORBE Serviços por clientes e profissionais."
      sections={[
        {
          title: "O que é a plataforma",
          body: (
            <p>
              O ORBE Serviços é um ambiente digital que facilita o contato entre pessoas que precisam de serviços
              (clientes) e prestadores de serviços (profissionais). A plataforma não presta os serviços anunciados e
              não é parte nas negociações entre clientes e profissionais.
            </p>
          ),
        },
        {
          title: "Responsabilidades",
          body: (
            <>
              <p>
                Valores, prazos, condições, execução e pagamento dos serviços são combinados diretamente entre cliente
                e profissional. O ORBE Serviços não garante a qualidade, a realização ou o pagamento dos serviços.
              </p>
              <p>
                A aprovação de um cadastro profissional indica apenas que ele foi revisado conforme os critérios
                internos da plataforma, e não constitui certificação técnica ou verificação de antecedentes.
              </p>
            </>
          ),
        },
        {
          title: "Contas e cadastros",
          body: (
            <ul>
              <li>As informações fornecidas devem ser verdadeiras e mantidas atualizadas.</li>
              <li>Cada pessoa é responsável pela segurança de sua senha.</li>
              <li>Cadastros podem ser recusados, suspensos ou encerrados em caso de violação destes termos.</li>
            </ul>
          ),
        },
        {
          title: "Condutas proibidas",
          body: (
            <ul>
              <li>Publicar solicitações falsas, duplicadas ou com finalidade diversa da contratação de serviços.</li>
              <li>Usar contatos obtidos na plataforma para spam, assédio ou finalidades não relacionadas ao pedido.</li>
              <li>Manipular avaliações, perfis ou o funcionamento da plataforma.</li>
              <li>Utilizar meios automatizados para criar contas ou coletar dados.</li>
            </ul>
          ),
        },
        {
          title: "Condições para profissionais",
          body: (
            <p>
              O cadastro de profissionais é gratuito. O acesso às oportunidades poderá depender de assinatura, cujas
              condições serão apresentadas previamente e de forma destacada, antes de qualquer cobrança.
            </p>
          ),
        },
        {
          title: "Alterações e foro",
          body: (
            <p>
              Estes termos podem ser atualizados, com aviso prévio aos usuários. O foro e a legislação aplicável serão
              definidos na versão final, revisada juridicamente.
            </p>
          ),
        },
      ]}
    />
  );
}
