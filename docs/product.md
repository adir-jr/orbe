# Produto e regras de negócio

> Documento vivo. Tudo marcado como **hipótese** precisa de validação com usuários reais.

## 1. Proposta

Conectar pessoas que precisam de serviços locais a profissionais autônomos, MEIs e
pequenas empresas de Joinville/SC. A plataforma intermedia **o contato**: valores,
execução e pagamento são combinados diretamente entre as partes.

- Cliente: *"Encontre profissionais para o que você precisa, de forma simples e prática."*
- Profissional: *"Mais oportunidades para o seu trabalho, em um só lugar."*

(Frases provisórias.)

## 2. Análise do modelo

### Requisitos essenciais (sem eles não há produto)

1. O cliente publica uma solicitação estruturada (serviço, bairro, prazo e descrição).
2. A solicitação chega somente a profissionais compatíveis.
3. O profissional demonstra interesse.
4. O cliente libera o contato de forma controlada.
5. A administração consegue moderar e medir tudo isso.

### Riscos e pontos fracos

| Risco | Por que importa | Mitigação proposta |
| --- | --- | --- |
| **Liquidez (ovo e galinha)** | Sem pedidos, o profissional não vê valor. Sem profissionais, o cliente não recebe resposta | Piloto com poucas categorias de alta recorrência. Recrutar profissionais **antes** de atrair clientes. Acesso gratuito no piloto. Operação manual (concierge) quando faltar oferta |
| **Desintermediação** | Depois do primeiro contato, as partes negociam fora da plataforma | Cobrar por acesso a oportunidades (assinatura), não por transação. Valor recorrente vem do fluxo de novos pedidos |
| **Assinatura sem volume** | R$ 49,90/mês só faz sentido com oportunidades relevantes | Só cobrar quando a métrica "oportunidades compatíveis por profissional/mês" justificar. Medir isso desde a Fase 2 |
| **Exposição de contatos (LGPD)** | Vazamento ou spam destrói a confiança do cliente | Contato liberado individualmente, no máximo 3 profissionais por pedido, leitura auditada, RLS no banco |
| **Pedidos falsos ou spam** | Desvalorizam a assinatura e geram atrito | Conta obrigatória, limite diário, moderação manual no piloto, denúncias |
| **Responsabilidade percebida** | O cliente pode achar que a plataforma garante o serviço | Comunicação explícita nos termos, no FAQ e na interface |
| **Marca/domínio** | "ORBE" pode não estar disponível | Nome centralizado em `src/lib/site.ts`. Fazer pesquisa no INPI antes do lançamento |

### Decisões adiadas de propósito

Provedor de pagamentos, preço final e limites da assinatura, avaliações, chat interno,
notificações por WhatsApp, busca geográfica por raio, app nativo, IA e expansão para
outras cidades.

## 3. Referências de mercado (análise preliminar)

Baseada em conhecimento geral sobre GetNinjas, Triider e Habitissimo. **Não foi feita
uma auditoria atualizada dos sites nesta fase.** Revisar com pesquisa própria antes da
Fase 3.

| Aspecto | Padrão observado no mercado | Posição do ORBE |
| --- | --- | --- |
| Homepage | Busca em destaque + grade de categorias | Mesmo padrão, com foco regional explícito e explicação de privacidade |
| Solicitação | Formulários longos e específicos por serviço | Base comum + poucas perguntas contextuais configuráveis |
| Monetização | Créditos ou pagamento por contato (custo imprevisível para o profissional) | Assinatura fixa (hipótese: monetização previsível) |
| Confiança | Avaliações e selos | Começar por curadoria manual e transparência. Avaliações só quando forem reais e verificáveis |
| Mobile | Uso majoritariamente mobile | Mobile-first, testado a partir de 360 px |

**Diferenciais pretendidos (hipóteses):** curadoria, perfis bem apresentados,
simplicidade, atendimento humano, transparência, proximidade regional e custo
previsível para o profissional.

## 4. Papéis

| Papel | Pode | Não pode |
| --- | --- | --- |
| Cliente | Criar e gerenciar as próprias solicitações, ver interessados, liberar ou revogar contatos | Ver dados de outros clientes, alterar o próprio papel |
| Profissional | Gerenciar o próprio perfil, ver oportunidades compatíveis, demonstrar interesse, ler contatos liberados | Ver pedidos incompatíveis, ler contatos sem concessão, aprovar o próprio perfil ou mudar o acesso comercial |
| Administrador | Moderar perfis e pedidos, gerir catálogo e regiões, conceder acesso no piloto, consultar indicadores e auditoria | — (toda ação relevante gera `moderation_events`/`audit_events`) |

Um usuário pode ser cliente e profissional ao mesmo tempo. O papel `professional`
indica que existe um `professional_profiles` associado. O papel `admin` só é atribuído
manualmente, no banco.

## 5. Solicitações

### Estados e transições

```
draft ──► published ──► in_negotiation ──► closed
  │          │  ▲            │
  ▼          ▼  └────────────┘
cancelled  cancelled      cancelled
published / in_negotiation ──► blocked   (somente moderação)
blocked ──► published (moderação) | cancelled (cliente ou moderação)
```

Estados finais: `closed` e `cancelled`. As regras ficam em `src/domain/request-status.ts`
e no trigger `validate_request_transition`.

### Campos

Serviço, descrição (20 a 1000 caracteres), respostas contextuais, cidade, bairro, prazo
(urgente / próximos dias / neste mês / flexível), período, orçamento opcional e
consentimento. Fotos ficam para depois.

### Perguntas contextuais

Cada serviço pode ter `questions` (JSON) com perguntas de escolha única. O formulário as
exibe automaticamente. Novos serviços não exigem código novo.

## 6. Compatibilidade (matching)

Um profissional vê uma oportunidade quando **todas** as condições abaixo são verdadeiras:

1. A solicitação está `published` ou `in_negotiation`.
2. O perfil do profissional está `approved`.
3. O acesso comercial é `pilot`, `trial` ou `subscriber`.
4. O profissional oferece o serviço da solicitação.
5. É a mesma cidade, e o profissional atende o bairro ou a cidade toda.
6. A solicitação não é do próprio profissional.

São regras simples, auditáveis e sem IA (`src/domain/matching.ts`).

## 7. Privacidade de contatos

1. A oportunidade mostra apenas serviço, bairro, prazo, período, orçamento e descrição.
2. "Tenho interesse" **não** libera contato. Há um limite de **5 interessados** por pedido.
3. O cliente escolhe a quem liberar. Há um limite de **3 concessões ativas** por pedido.
4. O telefone só é lido pela função `get_request_contact`, que verifica a concessão e
   grava `audit_events` (quem leu, quando e qual pedido).
5. O cliente pode revogar a concessão. Concessões não podem ser redirecionadas.
6. A descrição orienta o cliente a não incluir dados de contato. Um filtro automático
   de telefone e e-mail na descrição está previsto para a Fase 3.

Os limites são hipóteses iniciais e estão centralizados em `src/domain/contact-policy.ts`.

## 8. Profissionais

- Cadastro mínimo: nome, e-mail, telefone, cidade, tipo de atuação, serviços, regiões e
  descrição.
- Estados: `pending` → `approved` / `rejected`. `approved` ↔ `suspended`.
- **"Aprovado" ≠ "verificado".** Nenhum selo de verificação existe até que haja um
  procedimento real (documento, antecedentes etc.).
- Portfólio: imagens em bucket privado, servidas por URL assinada.

## 9. Monetização (hipótese)

- Cliente: sempre gratuito no MVP.
- Profissional: cadastro gratuito. A **hipótese** é uma assinatura de R$ 49,90/mês para
  acesso a oportunidades.
- No piloto: acesso `pilot` concedido manualmente, sem cobrança.
- A tabela `subscriptions` existe, mas nenhuma cobrança é implementada até a Fase 4.

Perguntas a responder com dados do piloto:

- Quantas oportunidades compatíveis por profissional/mês tornam a assinatura atrativa?
- O limite de interessados por pedido deve ser 3, 5 ou dinâmico?
- Faz sentido um período de teste (`trial`)? De quantos dias?
- Planos por categoria ou por região?
- Qual política de reembolso aplicar a pedidos inválidos?

## 10. Prevenção de abuso (proporcional ao piloto)

| Ameaça | Medida |
| --- | --- |
| Cadastros automatizados | Supabase Auth com confirmação de e-mail. CAPTCHA (Turnstile, gratuito) se houver abuso |
| Pedidos falsos ou duplicados | Conta obrigatória, limite de 5 publicações em 24 h, moderação e bloqueio |
| Spam a clientes | Limite de concessões, revogação, denúncias e auditoria de leituras |
| Escalada de privilégio | Triggers impedem mudar papel, status ou acesso comercial. RLS em todas as tabelas |
| Manipulação de avaliações | Avaliações só virão vinculadas a pedidos com contato liberado (Fase 5) |
| Uso excessivo de recursos | Limites de tamanho nos campos, busca limitada a 80 caracteres, limites de listagem |

## 11. Indicadores do piloto

Serão calculados a partir de dados reais (Fase 2/3). Nada é exibido antes disso.

- **Aquisição:** clientes e profissionais cadastrados, origem.
- **Operação:** pedidos publicados (total e por categoria), profissionais ativos por
  categoria, pedidos sem interessado, tempo até o primeiro interesse, pedidos encerrados.
- **Conversão:** % de pedidos com interesse, % com contato liberado. Futuramente:
  conversão e retenção de assinantes.
- **Qualidade:** pedidos bloqueados, denúncias, profissionais suspensos, oferta × demanda
  por bairro.
