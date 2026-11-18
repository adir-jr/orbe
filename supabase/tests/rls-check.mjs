/**
 * Testes de segurança do banco (RLS, triggers e funções) sem Docker nem Supabase.
 * Aplica as migrações em um PostgreSQL embutido (PGlite) com stubs mínimos do
 * Supabase (schema auth, auth.uid(), papéis anon/authenticated) e simula
 * cliente, profissional e administrador.
 *
 * Uso: npm run test:db
 * Limitação: não substitui um teste no Supabase real (Fase 2).
 */
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const db = new PGlite();
const stub = `
create schema auth;
create table auth.users (id uuid primary key, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create role anon; create role authenticated;
grant usage on schema public, auth to anon, authenticated;
`;
await db.exec(stub);
const dir = new URL('../migrations/', import.meta.url).pathname;
for (const f of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) await db.exec(readFileSync(join(dir, f), 'utf8'));
await db.exec(`grant select, insert, update, delete on all tables in schema public to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;`);
console.log('MIGRATION OK');

const C='11111111-1111-1111-1111-111111111111', P='22222222-2222-2222-2222-222222222222', A='33333333-3333-3333-3333-333333333333', P2='44444444-4444-4444-4444-444444444444';
await db.exec(`
insert into auth.users values ('${C}', '{"full_name":"Cliente"}'), ('${P}', '{"full_name":"Pro","role":"professional"}'), ('${A}', '{"full_name":"Admin","role":"admin"}'), ('${P2}', '{"full_name":"Pro2","role":"professional"}');
update public.profiles set phone='+5547999990000' where id='${C}';
update public.profiles set role='admin' where id='${A}';
insert into public.cities values ('joinville','Joinville','SC',true);
insert into public.neighborhoods (city_slug, slug, name) values ('joinville','america','América'), ('joinville','itaum','Itaum');
insert into public.categories (slug,name,is_active) values ('casa','Casa',true);
insert into public.services (category_id, slug, name, is_active) select id,'eletricista','Eletricista',true from public.categories;
`);

let pass=0, fail=0;
async function as(uid, sql) { await db.exec(`reset role; select set_config('request.jwt.claim.sub','${uid}',false); set role authenticated;`); return db.query(sql); }
async function expectOk(name, uid, sql) { try { const r = await as(uid, sql); pass++; console.log('  ok  ', name); return r; } catch (e) { fail++; console.log('  FAIL', name, e.message); } }
async function expectErr(name, uid, sql) { try { await as(uid, sql); fail++; console.log('  FAIL (no error)', name); } catch (e) { pass++; console.log('  ok  ', name, '->', e.message); } }
async function expectRows(name, uid, sql, n) { const r = await as(uid, sql); if (r.rows.length===n) { pass++; console.log('  ok  ', name, `(${n})`);} else { fail++; console.log('  FAIL', name, r.rows.length); } return r; }

await expectErr('cliente não vira admin', C, `update public.profiles set role='admin' where id='${C}'`);
await db.exec(`reset role; insert into auth.users values ('55555555-5555-5555-5555-555555555555','{"full_name":"X","role":"admin"}')`);
const x = await db.query(`select role from public.profiles where id='55555555-5555-5555-5555-555555555555'`);
if (x.rows[0].role === 'client') { pass++; console.log('  ok   cadastro pedindo role=admin vira client'); } else { fail++; console.log('  FAIL cadastro admin'); }

await expectOk('profissional cria perfil', P, `insert into public.professional_profiles (user_id, slug, display_name, city_slug, status, commercial_access) values ('${P}','pro','Pro','joinville','approved','subscriber')`);
await expectRows('perfil nasce pendente/sem acesso (trigger)', P, `select 1 from public.professional_profiles where status='pending' and commercial_access='none'`, 1);
await expectErr('profissional não se auto-aprova', P, `update public.professional_profiles set status='approved' where user_id='${P}'`);
await expectOk('profissional informa serviço', P, `insert into public.professional_services select '${P}', id from public.services`);
await expectOk('profissional informa bairro', P, `insert into public.service_areas select '${P}', id from public.neighborhoods where slug='america'`);
await expectRows('anon não vê perfil pendente', '', `select 1 from public.professional_profiles`, 0);

await expectErr('publicar sem consentimento falha', C, `insert into public.service_requests (client_id, service_id, city_slug, neighborhood_id, description, urgency, preferred_period, status) select '${C}', s.id, 'joinville', n.id, 'Instalar tomadas novas na sala de estar', 'this_week','morning','published' from public.services s, public.neighborhoods n where n.slug='america'`);
await expectOk('cliente publica solicitação', C, `insert into public.service_requests (client_id, service_id, city_slug, neighborhood_id, description, urgency, preferred_period, status, contact_consent_at) select '${C}', s.id, 'joinville', n.id, 'Instalar tomadas novas na sala de estar', 'this_week','morning','published', now() from public.services s, public.neighborhoods n where n.slug='america'`);
await expectErr('cliente cria pedido em nome de outro', C, `insert into public.service_requests (client_id, service_id, city_slug, neighborhood_id, description, urgency, preferred_period) select '${P}', s.id, 'joinville', n.id, 'Instalar tomadas novas na sala de estar', 'this_week','morning' from public.services s, public.neighborhoods n where n.slug='america'`);
const reqId = (await (async()=>{await db.exec("reset role");return db.query(`select id from public.service_requests`)})()).rows[0].id;

await expectRows('pendente não vê oportunidades', P, `select * from public.list_opportunities()`, 0);
await expectOk('admin aprova + acesso piloto', A, `update public.professional_profiles set status='approved', commercial_access='pilot' where user_id='${P}'`);
await expectRows('aprovado vê 1 oportunidade', P, `select * from public.list_opportunities()`, 1);
await expectRows('profissional NÃO lê a tabela de pedidos', P, `select * from public.service_requests`, 0);
await expectRows('profissional NÃO lê profiles do cliente', P, `select * from public.profiles where id='${C}'`, 0);
await expectErr('contato sem concessão é negado', P, `select * from public.get_request_contact('${reqId}')`);
await expectErr('cliente não libera contato sem interesse', C, `insert into public.contact_grants (request_id, professional_id, granted_by) values ('${reqId}','${P}','${C}')`);
await expectOk('profissional demonstra interesse', P, `insert into public.request_interests (request_id, professional_id) values ('${reqId}','${P}')`);
await expectRows('cliente vê o interesse', C, `select * from public.request_interests`, 1);
await expectOk('cliente libera contato', C, `insert into public.contact_grants (request_id, professional_id, granted_by) values ('${reqId}','${P}','${C}')`);
const contact = await expectOk('profissional lê contato liberado', P, `select * from public.get_request_contact('${reqId}')`);
console.log('     ->', JSON.stringify(contact?.rows));
await expectRows('leitura registrada em audit_events (admin)', A, `select * from public.audit_events where event_type='contact.viewed'`, 1);
await expectRows('profissional não lê audit_events', P, `select * from public.audit_events`, 0);
await expectErr('concessão não pode ser redirecionada', C, `update public.contact_grants set professional_id='${P2}'`);
await expectErr('cliente não bloqueia', C, `update public.service_requests set status='blocked'`);
await expectErr('transição inválida published->draft', C, `update public.service_requests set status='draft'`);
await expectOk('cliente revoga contato', C, `update public.contact_grants set revoked_at=now()`);
await expectErr('contato revogado é negado', P, `select * from public.get_request_contact('${reqId}')`);
await expectOk('admin bloqueia', A, `update public.service_requests set status='blocked'`);
await expectRows('bloqueada some das oportunidades', P, `select * from public.list_opportunities()`, 0);
await expectOk('cliente cancela bloqueada', C, `update public.service_requests set status='cancelled'`);
await expectErr('estado final não muda', A, `update public.service_requests set status='published'`);
await expectRows('anon lê catálogo ativo', '', `select * from public.services`, 1);
try { await db.exec('reset role; set role anon'); await db.query('select * from public.list_opportunities()'); fail++; console.log('  FAIL anon list'); } catch (e) { pass++; console.log('  ok   anon não chama list_opportunities ->', e.message); }
console.log(`\n${pass} ok, ${fail} falhas`);
process.exit(fail ? 1 : 0);
