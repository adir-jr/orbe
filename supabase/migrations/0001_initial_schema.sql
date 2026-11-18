-- =============================================================================
-- ORBE Serviços — esquema inicial (proposta para a Fase 2)
--
-- Status: NÃO APLICADO em nenhum ambiente. Validado sintaticamente e com testes
-- de regras em PostgreSQL local (ver docs/architecture.md). Revisar antes de
-- aplicar no Supabase com `supabase db push`.
--
-- Princípios:
--   * Toda tabela tem RLS ativado. Sem política = sem acesso.
--   * Dados de contato (telefone/e-mail) ficam apenas em `profiles`, legíveis
--     somente pelo dono e pela administração. Profissionais só os obtêm pela
--     função `get_request_contact`, que exige um contact_grant ativo e registra
--     a leitura em audit_events.
--   * Regras críticas (transições de estado, limites) são aplicadas por
--     triggers, e não apenas no frontend.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------
create type public.app_role as enum ('client', 'professional', 'admin');
create type public.professional_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.commercial_access as enum ('none', 'pilot', 'trial', 'subscriber');
create type public.request_status as enum ('draft', 'published', 'in_negotiation', 'closed', 'cancelled', 'blocked');
create type public.request_urgency as enum ('urgent', 'this_week', 'this_month', 'flexible');
create type public.preferred_period as enum ('morning', 'afternoon', 'evening', 'any');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'cancelled', 'expired');

-- -----------------------------------------------------------------------------
-- Utilitários
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- -----------------------------------------------------------------------------
-- Usuários
-- -----------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        public.app_role not null default 'client',
  full_name   text not null check (char_length(full_name) between 2 and 120),
  phone       text check (phone ~ '^\+?[0-9]{10,14}$'),
  city_slug   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.profiles is 'Dados gerais e PRIVADOS dos usuários. Nunca expor em listagens.';

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Verifica papel de administrador sem recursão de RLS.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Sessão confiável: administrador logado OU conexão de servidor (service_role,
-- console SQL, migrações). NÃO é security definer de propósito: current_user
-- precisa refletir quem está executando.
create or replace function public.is_privileged()
returns boolean language sql stable as $$
  select current_user not in ('anon', 'authenticated') or public.is_admin();
$$;

-- Impede que um usuário altere o próprio papel (escalada de privilégio).
create or replace function public.guard_profile_role()
returns trigger language plpgsql as $$
begin
  if new.role is distinct from old.role and not public.is_privileged() then
    raise exception 'Somente administradores podem alterar papéis.' using errcode = '42501';
  end if;
  return new;
end $$;

create trigger profiles_guard_role before update on public.profiles
  for each row execute function public.guard_profile_role();

-- Cria o perfil automaticamente no cadastro (Supabase Auth).
-- Papel aceito do cadastro: apenas 'client' ou 'professional'; nunca 'admin'.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  requested text := coalesce(new.raw_user_meta_data ->> 'role', 'client');
  name text := btrim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
begin
  -- Nunca deixar o cadastro falhar por um nome inválido: usa um padrão editável.
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    case when char_length(name) between 2 and 120 then name else 'Usuário' end,
    case when requested = 'professional' then 'professional'::public.app_role else 'client'::public.app_role end
  );
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Catálogo e localidades (configuráveis pelo painel administrativo)
-- -----------------------------------------------------------------------------
create table public.cities (
  slug       text primary key check (slug ~ '^[a-z0-9-]+$'),
  name       text not null,
  state      char(2) not null,
  is_active  boolean not null default false
);

create table public.neighborhoods (
  id         uuid primary key default gen_random_uuid(),
  city_slug  text not null references public.cities (slug),
  slug       text not null check (slug ~ '^[a-z0-9-]+$'),
  name       text not null,
  is_active  boolean not null default true,
  unique (city_slug, slug)
);

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name        text not null,
  description text not null default '',
  icon        text not null default 'wrench',
  sort_order  integer not null default 0,
  is_active   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.services (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name        text not null,
  summary     text not null default '',
  keywords    text[] not null default '{}',
  icon        text not null default 'wrench',
  -- Perguntas contextuais do formulário (ver src/domain/types.ts: ServiceQuestion)
  questions   jsonb not null default '[]' check (jsonb_typeof(questions) = 'array'),
  sort_order  integer not null default 0,
  is_active   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index services_category_idx on public.services (category_id);

create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Profissionais
-- -----------------------------------------------------------------------------
create table public.professional_profiles (
  user_id             uuid primary key references public.profiles (id) on delete cascade,
  slug                text not null unique check (slug ~ '^[a-z0-9-]+$'),
  display_name        text not null check (char_length(display_name) between 2 and 80),
  headline            text not null default '' check (char_length(headline) <= 120),
  about               text not null default '' check (char_length(about) <= 2000),
  city_slug           text not null references public.cities (slug),
  serves_whole_city   boolean not null default false,
  years_of_experience smallint check (years_of_experience between 0 and 70),
  availability        text not null default '' check (char_length(availability) <= 200),
  avatar_path         text,
  status              public.professional_status not null default 'pending',
  commercial_access   public.commercial_access not null default 'none',
  reviewed_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index professional_profiles_status_idx on public.professional_profiles (status, city_slug);

create trigger professional_profiles_updated_at before update on public.professional_profiles
  for each row execute function public.set_updated_at();

-- Status de moderação e acesso comercial só mudam pela administração.
create or replace function public.guard_professional_admin_fields()
returns trigger language plpgsql as $$
begin
  if public.is_privileged() then return new; end if;
  if tg_op = 'INSERT' then
    new.status := 'pending';
    new.commercial_access := 'none';
    new.reviewed_at := null;
  elsif new.status is distinct from old.status
     or new.commercial_access is distinct from old.commercial_access
     or new.reviewed_at is distinct from old.reviewed_at then
    raise exception 'Campos de moderação só podem ser alterados pela administração.' using errcode = '42501';
  end if;
  return new;
end $$;

create trigger professional_profiles_guard before insert or update on public.professional_profiles
  for each row execute function public.guard_professional_admin_fields();

create table public.professional_services (
  professional_id uuid not null references public.professional_profiles (user_id) on delete cascade,
  service_id      uuid not null references public.services (id),
  created_at      timestamptz not null default now(),
  primary key (professional_id, service_id)
);
create index professional_services_service_idx on public.professional_services (service_id);

-- Bairros atendidos (quando serves_whole_city = false).
create table public.service_areas (
  professional_id uuid not null references public.professional_profiles (user_id) on delete cascade,
  neighborhood_id uuid not null references public.neighborhoods (id),
  created_at      timestamptz not null default now(),
  primary key (professional_id, neighborhood_id)
);
create index service_areas_neighborhood_idx on public.service_areas (neighborhood_id);

create table public.professional_portfolio (
  id              uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles (user_id) on delete cascade,
  storage_path    text not null,           -- caminho no bucket privado "portfolio"
  caption         text check (char_length(caption) <= 200),
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);
create index professional_portfolio_owner_idx on public.professional_portfolio (professional_id, sort_order);

-- -----------------------------------------------------------------------------
-- Solicitações
-- -----------------------------------------------------------------------------
create table public.service_requests (
  id                 uuid primary key default gen_random_uuid(),
  client_id          uuid not null references public.profiles (id) on delete cascade,
  service_id         uuid not null references public.services (id),
  city_slug          text not null references public.cities (slug),
  neighborhood_id    uuid not null references public.neighborhoods (id),
  description        text not null check (char_length(description) between 20 and 1000),
  answers            jsonb not null default '{}' check (jsonb_typeof(answers) = 'object'),
  urgency            public.request_urgency not null,
  preferred_period   public.preferred_period not null,
  budget_cents       integer check (budget_cents between 0 and 100000000),
  status             public.request_status not null default 'draft',
  contact_consent_at timestamptz,
  published_at       timestamptz,
  closed_at          timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint published_requires_consent
    check (status in ('draft', 'cancelled') or contact_consent_at is not null)
);
create index service_requests_client_idx on public.service_requests (client_id, created_at desc);
create index service_requests_open_idx on public.service_requests (service_id, neighborhood_id)
  where status in ('published', 'in_negotiation');

create trigger service_requests_updated_at before update on public.service_requests
  for each row execute function public.set_updated_at();

-- Espelha src/domain/request-status.ts. Alterar os dois juntos.
create or replace function public.validate_request_transition()
returns trigger language plpgsql as $$
declare
  admin boolean := public.is_privileged();
  ok boolean;
begin
  if tg_op = 'INSERT' then
    if new.status not in ('draft', 'published') then
      raise exception 'Uma solicitação nasce como rascunho ou publicada.' using errcode = '23514';
    end if;
  elsif new.status is distinct from old.status then
    ok := case old.status
      when 'draft'          then new.status in ('published', 'cancelled')
      when 'published'      then new.status in ('in_negotiation', 'closed', 'cancelled', 'blocked')
      when 'in_negotiation' then new.status in ('published', 'closed', 'cancelled', 'blocked')
      when 'blocked'        then new.status in ('published', 'cancelled')
      else false
    end;
    if not ok then
      raise exception 'Transição não permitida: % -> %', old.status, new.status using errcode = '23514';
    end if;
    if (new.status = 'blocked' or (old.status = 'blocked' and new.status <> 'cancelled')) and not admin then
      raise exception 'Somente a moderação bloqueia ou libera solicitações.' using errcode = '42501';
    end if;
  end if;

  -- Proteções do cliente: não altera conteúdo depois de publicada nem troca de dono.
  if tg_op = 'UPDATE' and not admin then
    if new.client_id <> old.client_id then
      raise exception 'Não é possível transferir a solicitação.' using errcode = '42501';
    end if;
    if old.status <> 'draft' and (new.service_id <> old.service_id or new.neighborhood_id <> old.neighborhood_id) then
      raise exception 'Serviço e bairro não podem mudar após a publicação.' using errcode = '42501';
    end if;
  end if;

  if new.status = 'published' and new.published_at is null then new.published_at := now(); end if;
  if new.status in ('closed', 'cancelled') and new.closed_at is null then new.closed_at := now(); end if;

  -- Antiabuso proporcional ao piloto: até 5 publicações por cliente em 24 h.
  if new.status = 'published' and (tg_op = 'INSERT' or old.status = 'draft') and not admin then
    if (select count(*) from public.service_requests r
        where r.client_id = new.client_id and r.published_at > now() - interval '24 hours'
          and r.id <> new.id) >= 5 then
      raise exception 'Limite diário de solicitações atingido.' using errcode = '54000';
    end if;
  end if;

  return new;
end $$;

create trigger service_requests_transition before insert or update on public.service_requests
  for each row execute function public.validate_request_transition();

-- Espelha src/domain/matching.ts.
create or replace function public.is_eligible_for_request(p_request_id uuid, p_professional_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.service_requests r
    join public.professional_profiles p on p.user_id = p_professional_id
    where r.id = p_request_id
      and r.status in ('published', 'in_negotiation')
      and p.status = 'approved'
      and p.commercial_access in ('pilot', 'trial', 'subscriber')
      and r.client_id <> p.user_id
      and p.city_slug = r.city_slug
      and exists (select 1 from public.professional_services ps
                  where ps.professional_id = p.user_id and ps.service_id = r.service_id)
      and (p.serves_whole_city or exists (select 1 from public.service_areas sa
                  where sa.professional_id = p.user_id and sa.neighborhood_id = r.neighborhood_id))
  );
$$;

-- Oportunidades do profissional logado: SOMENTE colunas não identificáveis.
create or replace function public.list_opportunities()
returns table (
  id uuid, service_id uuid, neighborhood_id uuid, city_slug text, description text,
  answers jsonb, urgency public.request_urgency, preferred_period public.preferred_period,
  budget_cents integer, status public.request_status, published_at timestamptz
)
language sql stable security definer set search_path = '' as $$
  select r.id, r.service_id, r.neighborhood_id, r.city_slug, r.description, r.answers,
         r.urgency, r.preferred_period, r.budget_cents, r.status, r.published_at
  from public.service_requests r
  where public.is_eligible_for_request(r.id, auth.uid())
  order by r.published_at desc
  limit 100;
$$;

-- -----------------------------------------------------------------------------
-- Interesse e liberação de contato (espelha src/domain/contact-policy.ts)
-- -----------------------------------------------------------------------------
create table public.request_interests (
  id              uuid primary key default gen_random_uuid(),
  request_id      uuid not null references public.service_requests (id) on delete cascade,
  professional_id uuid not null references public.professional_profiles (user_id) on delete cascade,
  message         text check (char_length(message) <= 500),
  created_at      timestamptz not null default now(),
  unique (request_id, professional_id)
);
create index request_interests_professional_idx on public.request_interests (professional_id, created_at desc);

create or replace function public.validate_interest()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_eligible_for_request(new.request_id, new.professional_id) then
    raise exception 'Profissional não elegível para esta solicitação.' using errcode = '42501';
  end if;
  -- Serializa inserções concorrentes na mesma solicitação.
  perform 1 from public.service_requests where id = new.request_id for update;
  if (select count(*) from public.request_interests where request_id = new.request_id) >= 5 then
    raise exception 'Esta solicitação já atingiu o limite de interessados.' using errcode = '54000';
  end if;
  return new;
end $$;

create trigger request_interests_validate before insert on public.request_interests
  for each row execute function public.validate_interest();

create table public.contact_grants (
  id              uuid primary key default gen_random_uuid(),
  request_id      uuid not null references public.service_requests (id) on delete cascade,
  professional_id uuid not null references public.professional_profiles (user_id) on delete cascade,
  granted_by      uuid not null references public.profiles (id),
  created_at      timestamptz not null default now(),
  revoked_at      timestamptz,
  unique (request_id, professional_id)
);
create index contact_grants_professional_idx on public.contact_grants (professional_id) where revoked_at is null;

create or replace function public.validate_contact_grant()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  req public.service_requests;
begin
  select * into req from public.service_requests where id = new.request_id for update;
  if req.client_id <> new.granted_by then
    raise exception 'Somente o cliente da solicitação pode liberar o contato.' using errcode = '42501';
  end if;
  if req.status not in ('published', 'in_negotiation') then
    raise exception 'Solicitação não está aberta.' using errcode = '23514';
  end if;
  if req.contact_consent_at is null then
    raise exception 'Consentimento de compartilhamento ausente.' using errcode = '23514';
  end if;
  if not exists (select 1 from public.request_interests
                 where request_id = new.request_id and professional_id = new.professional_id) then
    raise exception 'O profissional precisa ter demonstrado interesse.' using errcode = '23514';
  end if;
  if (select count(*) from public.contact_grants
      where request_id = new.request_id and revoked_at is null) >= 3 then
    raise exception 'Limite de profissionais com contato liberado atingido.' using errcode = '54000';
  end if;
  return new;
end $$;

create trigger contact_grants_validate before insert on public.contact_grants
  for each row execute function public.validate_contact_grant();

-- Após criada, a concessão só pode ser revogada (nunca redirecionada ou reativada).
create or replace function public.guard_contact_grant_update()
returns trigger language plpgsql as $$
begin
  if new.request_id <> old.request_id or new.professional_id <> old.professional_id
     or new.granted_by <> old.granted_by or new.created_at <> old.created_at
     or (old.revoked_at is not null and new.revoked_at is distinct from old.revoked_at) then
    raise exception 'Uma concessão de contato só pode ser revogada.' using errcode = '42501';
  end if;
  return new;
end $$;

create trigger contact_grants_guard_update before update on public.contact_grants
  for each row execute function public.guard_contact_grant_update();

-- -----------------------------------------------------------------------------
-- Moderação, denúncias, assinaturas e auditoria
-- -----------------------------------------------------------------------------
create table public.moderation_events (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid not null references public.profiles (id),
  target_type text not null check (target_type in ('professional', 'request', 'user', 'portfolio')),
  target_id   uuid not null,
  action      text not null,          -- ex.: approve, reject, suspend, block, unblock
  reason      text,
  created_at  timestamptz not null default now()
);
create index moderation_events_target_idx on public.moderation_events (target_type, target_id, created_at desc);

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id),
  target_type text not null check (target_type in ('professional', 'request', 'user')),
  target_id   uuid not null,
  reason      text not null check (char_length(reason) between 3 and 80),
  details     text check (char_length(details) <= 1000),
  status      public.report_status not null default 'open',
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);
create index reports_status_idx on public.reports (status, created_at desc);

-- Estrutura futura (Fase 4). Nenhuma cobrança é feita a partir desta tabela.
create table public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  professional_id      uuid not null references public.professional_profiles (user_id) on delete cascade,
  plan_code            text not null,
  price_cents          integer not null check (price_cents >= 0),
  status               public.subscription_status not null,
  current_period_start timestamptz,
  current_period_end   timestamptz,
  provider             text,           -- ex.: nome do provedor de pagamentos
  provider_reference   text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index subscriptions_professional_idx on public.subscriptions (professional_id, status);

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Log de segurança/operação. Sem dados pessoais em metadata (apenas IDs).
create table public.audit_events (
  id          bigint generated always as identity primary key,
  actor_id    uuid,
  event_type  text not null,       -- ex.: contact.viewed, professional.approved
  entity_type text,
  entity_id   uuid,
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index audit_events_entity_idx on public.audit_events (entity_type, entity_id, created_at desc);

-- Única forma de um profissional ler o contato de um cliente.
create or replace function public.get_request_contact(p_request_id uuid)
returns table (full_name text, phone text)
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.contact_grants g
    join public.service_requests r on r.id = g.request_id
    where g.request_id = p_request_id and g.professional_id = auth.uid()
      and g.revoked_at is null and r.status in ('published', 'in_negotiation')
  ) then
    raise exception 'Contato não autorizado.' using errcode = '42501';
  end if;

  insert into public.audit_events (actor_id, event_type, entity_type, entity_id)
  values (auth.uid(), 'contact.viewed', 'service_request', p_request_id);

  return query
    select p.full_name, p.phone
    from public.service_requests r join public.profiles p on p.id = r.client_id
    where r.id = p_request_id;
end $$;

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles               enable row level security;
alter table public.cities                 enable row level security;
alter table public.neighborhoods          enable row level security;
alter table public.categories             enable row level security;
alter table public.services               enable row level security;
alter table public.professional_profiles  enable row level security;
alter table public.professional_services  enable row level security;
alter table public.service_areas          enable row level security;
alter table public.professional_portfolio enable row level security;
alter table public.service_requests       enable row level security;
alter table public.request_interests      enable row level security;
alter table public.contact_grants         enable row level security;
alter table public.moderation_events      enable row level security;
alter table public.reports                enable row level security;
alter table public.subscriptions          enable row level security;
alter table public.audit_events           enable row level security;

-- profiles: somente o próprio usuário e a administração.
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- Catálogo: leitura pública do que está ativo; escrita só administração.
create policy cities_read on public.cities for select to anon, authenticated using (is_active or public.is_admin());
create policy cities_admin on public.cities for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy neighborhoods_read on public.neighborhoods for select to anon, authenticated using (is_active or public.is_admin());
create policy neighborhoods_admin on public.neighborhoods for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy categories_read on public.categories for select to anon, authenticated using (is_active or public.is_admin());
create policy categories_admin on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy services_read on public.services for select to anon, authenticated using (is_active or public.is_admin());
create policy services_admin on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Perfis profissionais: aprovados são públicos; dono edita; administração modera.
create policy pro_read on public.professional_profiles for select to anon, authenticated
  using (status = 'approved' or user_id = auth.uid() or public.is_admin());
create policy pro_insert on public.professional_profiles for insert to authenticated
  with check (user_id = auth.uid());
create policy pro_update on public.professional_profiles for update to authenticated
  using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());

create policy pro_services_read on public.professional_services for select to anon, authenticated
  using (exists (select 1 from public.professional_profiles p where p.user_id = professional_id
                 and (p.status = 'approved' or p.user_id = auth.uid())) or public.is_admin());
create policy pro_services_write on public.professional_services for all to authenticated
  using (professional_id = auth.uid() or public.is_admin()) with check (professional_id = auth.uid() or public.is_admin());

create policy areas_read on public.service_areas for select to anon, authenticated
  using (exists (select 1 from public.professional_profiles p where p.user_id = professional_id
                 and (p.status = 'approved' or p.user_id = auth.uid())) or public.is_admin());
create policy areas_write on public.service_areas for all to authenticated
  using (professional_id = auth.uid() or public.is_admin()) with check (professional_id = auth.uid() or public.is_admin());

create policy portfolio_read on public.professional_portfolio for select to anon, authenticated
  using (exists (select 1 from public.professional_profiles p where p.user_id = professional_id
                 and (p.status = 'approved' or p.user_id = auth.uid())) or public.is_admin());
create policy portfolio_write on public.professional_portfolio for all to authenticated
  using (professional_id = auth.uid() or public.is_admin()) with check (professional_id = auth.uid() or public.is_admin());

-- Solicitações: apenas o cliente dono e a administração leem a tabela.
-- Profissionais usam list_opportunities() (colunas restritas).
create policy requests_select on public.service_requests for select to authenticated
  using (client_id = auth.uid() or public.is_admin());
create policy requests_insert on public.service_requests for insert to authenticated
  with check (client_id = auth.uid());
create policy requests_update on public.service_requests for update to authenticated
  using (client_id = auth.uid() or public.is_admin()) with check (client_id = auth.uid() or public.is_admin());

create policy interests_select on public.request_interests for select to authenticated
  using (professional_id = auth.uid() or public.is_admin()
         or exists (select 1 from public.service_requests r where r.id = request_id and r.client_id = auth.uid()));
create policy interests_insert on public.request_interests for insert to authenticated
  with check (professional_id = auth.uid());
create policy interests_delete on public.request_interests for delete to authenticated
  using (professional_id = auth.uid() or public.is_admin());

create policy grants_select on public.contact_grants for select to authenticated
  using (professional_id = auth.uid() or granted_by = auth.uid() or public.is_admin());
create policy grants_insert on public.contact_grants for insert to authenticated
  with check (granted_by = auth.uid());
-- O cliente pode revogar (preencher revoked_at).
create policy grants_update on public.contact_grants for update to authenticated
  using (granted_by = auth.uid() or public.is_admin()) with check (granted_by = auth.uid() or public.is_admin());

create policy moderation_admin on public.moderation_events for all to authenticated
  using (public.is_admin()) with check (public.is_admin() and actor_id = auth.uid());

create policy reports_insert on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy reports_select on public.reports for select to authenticated
  using (reporter_id = auth.uid() or public.is_admin());
create policy reports_admin on public.reports for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy subscriptions_select on public.subscriptions for select to authenticated
  using (professional_id = auth.uid() or public.is_admin());
create policy subscriptions_admin on public.subscriptions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- audit_events: leitura só administração; escrita apenas por funções security definer.
create policy audit_admin_read on public.audit_events for select to authenticated using (public.is_admin());

-- Funções expostas via API: restringir a usuários autenticados.
revoke execute on function public.list_opportunities() from public, anon;
revoke execute on function public.get_request_contact(uuid) from public, anon;
revoke execute on function public.is_eligible_for_request(uuid, uuid) from public, anon;
grant execute on function public.list_opportunities() to authenticated;
grant execute on function public.get_request_contact(uuid) to authenticated;

-- Storage (aplicar na Fase 2): bucket "portfolio" privado, escrita restrita a
-- objetos sob o prefixo "<auth.uid()>/", leitura via URLs assinadas.
