# Roadmap

## Fase 1 — Fundação e protótipo navegável ✅

Entregue:

- Projeto Next.js 16 + TypeScript + Tailwind 4, design tokens e componentes base.
- Homepage, categorias, páginas de serviço (SEO local), busca demonstrativa, perfis
  fictícios, formulário guiado em 4 etapas, páginas para profissionais e "como
  funciona", telas de acesso desativadas, minutas de termos e privacidade, 404, erro,
  sitemap e robots (bloqueado enquanto for protótipo).
- Regras de negócio em `src/domain` com testes unitários.
- Migração SQL com RLS testada em PostgreSQL embutido.
- Testes E2E (desktop e mobile), verificação de links quebrados e de largura em 360 px.

Ainda não existe: autenticação, persistência, painéis, administração, notificações e
cobrança.

## Fase 2 — MVP funcional (próxima)

Ordem sugerida, cada item entregue e testado antes do seguinte:

1. **Infra:** criar o projeto Supabase de desenvolvimento (gratuito, com aprovação dos
   fundadores), configurar `.env.local`, aplicar a migração e um seed do catálogo
   gerado a partir de `src/data`.
2. **Camada de dados:** trocar `src/server/catalog.ts` para ler do Supabase
   (`@supabase/ssr`). Remover `demo-professionals.ts` e o `PrototypeBanner` quando
   houver dados reais.
3. **Autenticação:** e-mail + senha (ou link mágico) com Supabase Auth, `proxy.ts` para
   rotas privadas, confirmação de e-mail e recuperação de senha.
4. **Solicitação real:** Server Action com o mesmo schema Zod, login antes de publicar
   e a área "Minhas solicitações" (lista, detalhe, cancelar, encerrar).
5. **Perfil profissional:** cadastro, serviços, bairros, apresentação, avatar e
   portfólio (Storage).
6. **Oportunidades:** painel com `list_opportunities()` e "Tenho interesse".
7. **Contato:** cliente vê os interessados e libera ou revoga o contato. O
   profissional lê o contato via `get_request_contact`.
8. **Admin mínimo:** aprovar, rejeitar ou suspender profissionais; conceder acesso
   `pilot`; bloquear solicitações; editar categorias e serviços.
9. **Testes:** E2E dos fluxos autenticados, `test:db` e um teste de RLS no Supabase real.

## Fase 3 — Piloto em Joinville

Curadoria de profissionais (recrutar antes de abrir para clientes), notificações por
e-mail (novo pedido compatível, novo interesse, contato liberado), indicadores reais
no admin, denúncias, filtro de contatos na descrição, exportação e exclusão de dados
(LGPD), revisão jurídica dos termos, pesquisa de marca e domínio, deploy em produção e
um teste de segurança dirigido.

## Fase 4 — Monetização

Somente após validar as regras comerciais com dados do piloto. Inclui provedor de
pagamentos (assinatura recorrente), gestão de assinantes, suspensão e reativação,
cancelamento e indicadores financeiros.

## Fase 5 — Expansão

Avaliações verificadas, favoritos, busca geográfica, notificações avançadas, destaques
patrocinados, novas cidades e, se a demanda justificar, aplicativo mobile.

## Pendências conhecidas da Fase 1

- Slugs inexistentes podem responder HTTP 200 (com `noindex`). Veja `architecture.md`.
- A lista de bairros de Joinville precisa ser conferida com a divisão oficial.
- A análise de concorrentes é preliminar (sem auditoria atualizada dos sites).
- A categoria "Outros serviços" está desativada (`isActive: false`) por decisão de
  escopo do piloto.
- Não há modo escuro. Os tokens permitem adicioná-lo depois.
