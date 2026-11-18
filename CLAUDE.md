@AGENTS.md

# ORBE Serviços — guia do projeto

Marketplace regional que conecta clientes a profissionais de serviços locais.
Piloto em **Joinville/SC**. Nome "ORBE Serviços" é provisório.
Fase atual: **Fase 1 — protótipo navegável** (nada é salvo; perfis são fictícios).

Leitura obrigatória antes de mudanças relevantes:
`docs/product.md` (regras de negócio) · `docs/architecture.md` · `docs/roadmap.md`.

## Stack

- Next.js 16 (App Router, `cacheComponents` ligado) · React 19 · TypeScript estrito
- Tailwind CSS 4 (tokens em `src/app/globals.css`) · lucide-react · Zod 4
- Vitest (unidade) · Playwright (E2E) · PGlite (testes de RLS do banco)
- Fase 2: Supabase (PostgreSQL, Auth, Storage). Migrações em `supabase/migrations`.

## Comandos

```bash
npm run dev         # desenvolvimento em http://localhost:3000
npm run typecheck   # gera tipos de rota + tsc
npm run lint
npm run test        # regras de negócio (Vitest)
npm run test:db     # migrações + RLS em PostgreSQL embutido
npm run build
npm run test:e2e    # requer build antes (usa next start na porta 3100)
npm run check       # typecheck + lint + test + test:db + build
```

## Estrutura

```
src/app/            rotas (App Router) — páginas finas, sem regra de negócio
src/components/ui/  componentes base (Button, Field, Card, Badge, Alert, Dialog, ChoiceGroup…)
src/components/*/   componentes de domínio (layout, catalog, request, professional, marketing, search, brand)
src/domain/         regras de negócio PURAS (sem React, sem I/O) — testadas em tests/unit
src/data/           dados locais da Fase 1 (catálogo, bairros, perfis demonstrativos)
src/server/         acesso a dados ("server-only"); páginas só leem dados por aqui
src/lib/            utilitários e configuração do site
supabase/           migrações SQL e teste de RLS
tests/unit, tests/e2e
docs/               produto, arquitetura, roadmap
```

## Regras de arquitetura

1. Regra de negócio vai em `src/domain` e tem teste. Componentes não decidem regras.
2. Páginas obtêm dados apenas via `src/server/*`. Na Fase 2 só essa camada muda.
3. Regras críticas existem em DOIS lugares, mantidos em sincronia:
   `src/domain/request-status.ts` ↔ trigger `validate_request_transition`;
   `src/domain/matching.ts` ↔ `is_eligible_for_request`;
   `src/domain/contact-policy.ts` ↔ triggers de `request_interests`/`contact_grants`.
4. Categorias/serviços são dados (nunca `if (slug === "eletricista")` no código).
   Perguntas específicas de um serviço vão em `questions` do próprio serviço.
5. Cache Components: rotas dinâmicas precisam de `generateStaticParams` (≥1 item)
   e `notFound()` para slugs inválidos — `dynamicParams` não é suportado.
   `searchParams` deve ser lido dentro de `<Suspense>`. Não usar `new Date()`/`Math.random()`
   em componentes de servidor pré-renderizados.
6. Estado de UI efêmero (menus, popovers) deve fechar ao navegar: use `onNavigate`
   do `Link` e cleanup em `useLayoutEffect` (rotas ficam ocultas via `<Activity>`).
7. Nada de microsserviços, filas, IA ou novos serviços pagos sem aprovação dos fundadores.

## Segurança e privacidade (não negociável)

- Telefone, e-mail e endereço completo NUNCA aparecem em páginas públicas,
  listagens de oportunidades ou respostas de API sem `contact_grant` ativo.
- Autorização é verificada no servidor E no banco (RLS). Nunca confiar no frontend.
- Usuário comum não altera `role`, `status` de moderação nem `commercial_access`.
- Segredos só em variáveis de ambiente; nunca commitar `.env*` (exceto `.env.example`).
- Logs e `audit_events` guardam IDs, não dados pessoais.

## Honestidade do produto

- Nunca simular funcionalidade como operacional. Conteúdo fictício usa `DemoBadge`
  / `Alert tone="warning"` e `isDemo: true`.
- Nunca criar avaliações, selos "verificado" ou métricas falsas.
- Não prometer clientes, renda ou quantidade de oportunidades.

## Convenções

- Código e identificadores em inglês; textos de interface e documentação em pt-BR.
- URLs públicas em português e kebab-case (`/servicos/eletricista`).
- Arquivos em kebab-case; componentes em PascalCase; um componente principal por arquivo.
- Estilos só com tokens semânticos (`bg-brand-700`, `text-ink-muted`, `border-line`).
  Não usar cores Tailwind cruas (`bg-blue-500`).
- Formulários: rótulo visível, `aria-describedby` para ajuda/erro, mensagens em pt-BR.

## Fluxo de trabalho

Analisar contexto → explicar objetivo → alterar só o necessário → `npm run check`
→ `npm run test:e2e` em mudanças de UI → atualizar docs → resumir o que mudou.
Não declarar algo pronto sem verificação.
