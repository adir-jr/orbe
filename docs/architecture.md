# Arquitetura

## Visão geral

Um único aplicativo Next.js (monólito modular) e, a partir da Fase 2, um projeto
Supabase. Não há microsserviços, filas ou servidores próprios.

```
Navegador ──► Next.js (Server Components, Server Actions)
                 │  src/app          páginas e rotas
                 │  src/components   interface
                 │  src/server       acesso a dados (server-only)
                 │  src/domain       regras de negócio puras
                 ▼
             Supabase (Fase 2): PostgreSQL + RLS · Auth · Storage
```

### Por que esta stack

| Escolha | Motivo |
| --- | --- |
| Next.js 16 + React 19 | Páginas públicas pré-renderizadas (SEO e velocidade) e páginas privadas no mesmo código. Amplamente documentado |
| TypeScript estrito | Erros pegos antes de chegar ao usuário |
| Tailwind 4 + tokens | Identidade visual alterável em um único arquivo (`globals.css`) |
| Componentes próprios em vez da CLI do shadcn/ui | Mesmo padrão (Tailwind + composição), menos dependências (sem Radix por ora) e código 100% do projeto. Adotar shadcn pontualmente se surgir necessidade (ex.: combobox ou menus complexos) |
| Zod | O mesmo schema valida no navegador e no servidor |
| Sem React Hook Form na Fase 1 | O formulário é pequeno e o estado é simples. Reavaliar na Fase 2 (perfil profissional, admin) |
| Supabase | PostgreSQL padrão (exportável com `pg_dump`), autenticação pronta, RLS e plano gratuito para testes |

### Cache Components (Next.js 16)

O projeto usa `cacheComponents: true`. Implicações práticas:

- Páginas de catálogo são pré-renderizadas no build (`generateStaticParams`).
- Rotas que leem `searchParams` (busca, formulário, cadastro) renderizam um "shell"
  estático e completam o conteúdo dentro de `<Suspense>`.
- **Limitação conhecida:** um slug inexistente (ex.: `/servicos/xyz`) mostra a página
  "não encontrada" com `noindex`, mas pode responder HTTP 200 em vez de 404. Isso
  acontece porque o streaming já começou quando `notFound()` executa (comportamento
  documentado do Next.js). Não prejudica o SEO, já que a página não é indexada. Se for
  necessário um 404 estrito, validar os slugs em `proxy.ts` na Fase 2.
- Rotas ocultas ficam preservadas (`<Activity>`). Menus e diálogos fecham ao navegar.

## Organização do código

Veja `CLAUDE.md` para a árvore completa. Fluxo de dependências permitido:

```
app → components → domain
app → server → data (Fase 1) | supabase (Fase 2)
server → domain
domain → (nada)
```

`src/domain` não importa React, Next ou banco. Por isso é fácil de testar.

## Rotas

| Área | Rotas | Fase |
| --- | --- | --- |
| Pública | `/`, `/categorias`, `/categorias/[slug]`, `/servicos/[slug]`, `/buscar`, `/profissionais/[slug]`, `/como-funciona`, `/para-profissionais`, `/termos`, `/privacidade` | 1 ✅ |
| Acesso | `/entrar`, `/cadastro` | 1 (telas) · 2 (funcional) |
| Solicitação | `/solicitar` | 1 (demo) · 2 (funcional) |
| Cliente | `/cliente`, `/cliente/solicitacoes`, `/cliente/solicitacoes/[id]`, `/cliente/conta` | 2 |
| Profissional | `/profissional`, `/profissional/perfil`, `/profissional/oportunidades`, `/profissional/interesses`, `/profissional/atendimento`, `/profissional/conta` | 2 |
| Admin | `/admin`, `/admin/usuarios`, `/admin/profissionais`, `/admin/solicitacoes`, `/admin/categorias`, `/admin/moderacao`, `/admin/indicadores` | 2–3 |

As áreas privadas serão protegidas em três camadas: `proxy.ts` (redirecionamento),
verificação de sessão e papel no servidor (layout e Server Actions) e RLS no banco.

## Modelo de dados

Migração: `supabase/migrations/0001_initial_schema.sql` (**ainda não aplicada**).

```
auth.users 1─1 profiles 1─0..1 professional_profiles
                  │                 ├─< professional_services >─ services >─ categories
                  │                 ├─< service_areas >─ neighborhoods >─ cities
                  │                 ├─< professional_portfolio
                  │                 └─< subscriptions (futuro)
                  └─< service_requests ─< request_interests
                                       └─< contact_grants
moderation_events · reports · audit_events
```

Destaques:

- Dados de contato apenas em `profiles`, legíveis só pelo dono e pela administração.
- Profissionais **não** leem `service_requests` diretamente. Usam
  `list_opportunities()`, que devolve só colunas não identificáveis.
- Triggers aplicam: transições de estado, limite de 5 publicações/24 h, limite de 5
  interesses e 3 concessões por pedido, imutabilidade de concessões, bloqueio de
  autoaprovação e de mudança de papel.
- `is_privileged()` permite operações de servidor (`service_role`, console SQL), mas
  nunca de `anon`/`authenticated` sem papel de admin.
- Índices parciais para as consultas de oportunidades abertas.

### Teste de segurança do banco

`npm run test:db` aplica a migração em PostgreSQL embutido (PGlite) com stubs do
Supabase e executa 35 cenários: escalada de privilégio, leitura indevida de contatos,
limites, transições e auditoria. Esses testes já encontraram e corrigiram três falhas
de projeto na migração. **Não substituem** um teste no Supabase real antes do piloto.

## Segurança

- Segredos em variáveis de ambiente (`.env.example` documenta os nomes).
  `SUPABASE_SERVICE_ROLE_KEY` só no servidor.
- Validação com Zod em toda entrada (cliente e servidor).
- RLS em todas as tabelas. Sem política, não há acesso.
- Logs/auditoria com IDs, sem dados pessoais.
- Ambientes separados: projeto Supabase de desenvolvimento ≠ produção.
- LGPD: exportação e exclusão de conta (Fase 3) via função administrativa com auditoria.
- Storage: bucket `portfolio` privado, escrita restrita ao prefixo `<uid>/` e leitura
  por URL assinada.

## Custos estimados de infraestrutura

Valores de referência em USD. Conferir as tabelas oficiais antes de contratar.

| Fase | Supabase | Hospedagem | Total aproximado |
| --- | --- | --- | --- |
| 1 (protótipo local) | — | — | **R$ 0** |
| 2 (testes internos) | Free | Vercel Hobby | **R$ 0** |
| 3 (piloto com usuários) | Pro ~US$ 25/mês (backups, sem pausa por inatividade) | Vercel Pro ~US$ 20/mês* | **~US$ 45/mês** |

\* O plano Hobby da Vercel é restrito a uso não comercial. Alternativas: Netlify ou
Cloudflare (verificar compatibilidade com Next.js 16) ou um servidor Node próprio
(VPS ~US$ 5–10/mês, com mais trabalho operacional). Domínio `.com.br`: ~R$ 40/ano.
E-mail transacional (Resend ou similar) tem plano gratuito suficiente para o piloto.

## Portabilidade

- Banco: PostgreSQL padrão (`pg_dump`). As únicas dependências específicas do Supabase
  são `auth.users` e `auth.uid()`.
- Aplicação: `next build && next start` roda em qualquer servidor Node 22+.
