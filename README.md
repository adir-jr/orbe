# ORBE Serviços

Marketplace regional de serviços locais da ORBE Group — piloto em Joinville/SC.
*(Nome provisório.)*

> **Status: Fase 1 — protótipo navegável.** Nenhum dado é enviado ou armazenado.
> Perfis de profissionais são fictícios e sinalizados como tal.

## Requisitos

- Node.js 22 ou superior
- npm 10 ou superior

Nenhuma conta ou serviço externo é necessário nesta fase.

## Como executar

```bash
npm install
cp .env.example .env.local   # opcional na Fase 1
npm run dev
```

Acesse http://localhost:3000.

Para rodar a versão de produção localmente:

```bash
npm run build
npm run start
```

## Verificações

| Comando | O que faz |
| --- | --- |
| `npm run typecheck` | Gera os tipos de rota do Next.js e roda o TypeScript |
| `npm run lint` | ESLint (regras do Next.js) |
| `npm run test` | Testes unitários das regras de negócio (Vitest) |
| `npm run test:db` | Aplica as migrações SQL em PostgreSQL embutido e testa as regras de segurança (RLS) |
| `npm run build` | Build de produção |
| `npm run test:e2e` | Testes de ponta a ponta no navegador (Playwright). Rode `npm run build` antes |
| `npm run check` | Todas as verificações acima, exceto E2E |

Os testes E2E usam o Chromium do Playwright. Se ele não estiver instalado na sua
máquina: `npx playwright install chromium`.

## Páginas disponíveis

| Rota | Descrição |
| --- | --- |
| `/` | Página inicial |
| `/categorias` e `/categorias/[slug]` | Categorias e serviços |
| `/servicos/[slug]` | Página do serviço (SEO local) |
| `/buscar?q=` | Busca demonstrativa |
| `/solicitar` | Formulário guiado de solicitação (não envia dados) |
| `/profissionais/[slug]` | Perfil profissional (somente perfis fictícios) |
| `/como-funciona`, `/para-profissionais` | Páginas institucionais |
| `/entrar`, `/cadastro` | Telas de acesso (desativadas na Fase 1) |
| `/termos`, `/privacidade` | Minutas para revisão jurídica |

## Documentação

- [`docs/product.md`](docs/product.md) — regras de negócio, análise e decisões de produto
- [`docs/architecture.md`](docs/architecture.md) — arquitetura, dados, segurança e custos
- [`docs/roadmap.md`](docs/roadmap.md) — fases e próximos passos
- [`CLAUDE.md`](CLAUDE.md) — convenções para desenvolvimento assistido por IA
