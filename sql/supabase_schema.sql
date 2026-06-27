-- FitPersona v4 Supabase 数据表
-- 在 Supabase Dashboard -> SQL Editor 里整段运行

create extension if not exists pgcrypto;

create table if not exists public.fitpersona_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  participant_id text not null,
  result_id text,
  result_code text not null,
  persona_name text,

  score jsonb,
  dimensions jsonb,
  answers jsonb,
  consent boolean default true,

  app_version text,
  user_agent text,
  screen_width integer,
  screen_height integer,
  timezone text,
  language text,
  referrer text,
  page_url text,

  payload jsonb
);

create table if not exists public.fitpersona_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  participant_id text not null,
  event_name text not null,
  result_code text,
  app_version text,

  payload jsonb,
  user_agent text,
  page_url text
);

alter table public.fitpersona_responses enable row level security;
alter table public.fitpersona_events enable row level security;

-- 允许匿名用户写入，但不允许匿名读取/修改/删除
drop policy if exists "anon can insert fitpersona responses" on public.fitpersona_responses;
create policy "anon can insert fitpersona responses"
on public.fitpersona_responses
for insert
to anon
with check (true);

drop policy if exists "anon can insert fitpersona events" on public.fitpersona_events;
create policy "anon can insert fitpersona events"
on public.fitpersona_events
for insert
to anon
with check (true);

grant insert on public.fitpersona_responses to anon;
grant insert on public.fitpersona_events to anon;

-- 你自己后台读取时请使用 service_role_key，不要在前端暴露 service_role_key。
