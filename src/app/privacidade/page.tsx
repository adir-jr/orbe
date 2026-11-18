import type { Metadata } from "next";
import { LegalDocument } from "@/components/marketing/legal-document";
import { MAX_CONTACT_GRANTS_PER_REQUEST } from "@/domain/contact-policy";

export const metadata: Metadata = {
  title: "Política de privacidade (minuta)",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Política de privacidade"
      intro="Como o ORBE Serviços pretende tratar dados pessoais, em linha com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      sections={[
        {
          title: "Quem somos",
          body: (
            <p>
              O ORBE Serviços (nome provisório) é uma plataforma da ORBE Group que conecta pessoas que precisam de
              serviços a profissionais. A identificação completa do controlador dos dados (razão social, CNPJ e
              endereço) e o contato do encarregado (DPO) serão incluídos antes do lançamento.
            </p>
          ),
        },
        {
          title: "Dados que coletamos",
          body: (
            <>
              <p>Coletamos apenas o necessário para o funcionamento da plataforma:</p>
              <ul>
                <li>
                  <strong>Clientes:</strong> nome, e-mail, telefone, bairro e cidade, além do conteúdo das
                  solicitações.
                </li>
                <li>
                  <strong>Profissionais:</strong> nome ou nome fantasia, e-mail, telefone, cidade, categorias,
                  regiões atendidas, apresentação e imagens de trabalhos enviadas voluntariamente.
                </li>
                <li>
                  <strong>Dados técnicos:</strong> registros de acesso exigidos pelo Marco Civil da Internet e
                  eventos de segurança.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Como usamos os dados",
          body: (
            <ul>
              <li>Exibir solicitações a profissionais compatíveis, sem dados de contato.</li>
              <li>Compartilhar o contato do cliente somente com os profissionais que ele autorizar.</li>
              <li>Moderar cadastros e solicitações e prevenir fraudes e abusos.</li>
              <li>Enviar comunicações operacionais sobre solicitações e contas.</li>
            </ul>
          ),
        },
        {
          title: "Compartilhamento de contatos",
          body: (
            <p>
              O telefone do cliente nunca é exibido em páginas públicas ou listagens. Ele é liberado individualmente,
              por escolha do cliente, para no máximo {MAX_CONTACT_GRANTS_PER_REQUEST} profissionais por solicitação.
              Cada liberação é registrada e pode ser revogada pelo cliente.
            </p>
          ),
        },
        {
          title: "Bases legais",
          body: (
            <p>
              Tratamos dados com base na execução do contrato (uso da plataforma), no consentimento (compartilhamento
              de contato), no cumprimento de obrigação legal (registros de acesso) e no legítimo interesse (segurança
              e prevenção a fraudes). A definição final das bases legais será validada juridicamente.
            </p>
          ),
        },
        {
          title: "Seus direitos",
          body: (
            <p>
              Você poderá solicitar confirmação, acesso, correção, portabilidade e exclusão dos seus dados, além de
              revogar consentimentos. O canal oficial de atendimento será informado antes do lançamento.
            </p>
          ),
        },
        {
          title: "Armazenamento e segurança",
          body: (
            <p>
              Os dados serão armazenados em infraestrutura de nuvem com controle de acesso por usuário, criptografia
              em trânsito e regras de acesso aplicadas diretamente no banco de dados. Mantemos os dados apenas pelo
              tempo necessário às finalidades descritas ou exigido por lei.
            </p>
          ),
        },
      ]}
    />
  );
}
