-- Coup — schema
-- Run this in the Supabase SQL editor (or `supabase db push`) before seeding.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  photo text,
  bio text default '',
  "current_role" text default '',
  cohort_group text default '',
  location text default '',
  linkedin_url text,
  contact_preference text default 'Email',
  contact_handle text default '',
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------- profile tag tables
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  company text not null default '',
  industry text not null default '',
  function text not null default '',
  years numeric not null default 0
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  skill text not null,
  unique (user_id, skill)
);

create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  interest text not null,
  unique (user_id, interest)
);

create table if not exists public.looking_for (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null,
  unique (user_id, category)
);

-- ------------------------------------------------------------ content tables
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  category text not null default 'Other',
  url text not null,
  tags text[] not null default '{}',
  uploaded_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text default '',
  type text not null default 'Other',
  industry text default '',
  role text default '',
  location text default '',
  deadline date,
  description text default '',
  url text default '',
  posted_by uuid references public.users(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  tags text[] not null default '{}',
  posted_by uuid references public.users(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists experience_user_idx on public.experience(user_id);
create index if not exists skills_user_idx on public.skills(user_id);
create index if not exists interests_user_idx on public.interests(user_id);
create index if not exists looking_for_user_idx on public.looking_for(user_id);
create index if not exists resources_created_idx on public.resources(created_at desc);
create index if not exists opportunities_created_idx on public.opportunities(created_at desc);
create index if not exists help_requests_created_idx on public.help_requests(created_at desc);

-- ------------------------------------------------------------------- helpers
-- A signed-in auth user counts as a cohort member when their email is on the list.
create or replace function public.current_member_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id
  from public.users u
  where u.id = auth.uid()
     or lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  limit 1;
$$;

create or replace function public.is_cohort_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_member_id() is not null;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
    where u.id = public.current_member_id() and u.role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------- RLS
alter table public.users enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.interests enable row level security;
alter table public.looking_for enable row level security;
alter table public.resources enable row level security;
alter table public.opportunities enable row level security;
alter table public.help_requests enable row level security;

-- Everything is readable by approved cohort members only.
drop policy if exists "members read users" on public.users;
create policy "members read users" on public.users
  for select using (public.is_cohort_member());

drop policy if exists "own profile update" on public.users;
create policy "own profile update" on public.users
  for update using (id = public.current_member_id() or public.is_admin())
  with check (id = public.current_member_id() or public.is_admin());

drop policy if exists "admin manage users" on public.users;
create policy "admin manage users" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

-- Profile tag tables: read as a member, write only your own rows (or admin).
do $$
declare t text;
begin
  foreach t in array array['experience', 'skills', 'interests', 'looking_for'] loop
    execute format('drop policy if exists "members read %1$s" on public.%1$I', t);
    execute format(
      'create policy "members read %1$s" on public.%1$I for select using (public.is_cohort_member())', t);
    execute format('drop policy if exists "own rows %1$s" on public.%1$I', t);
    execute format(
      'create policy "own rows %1$s" on public.%1$I for all using (user_id = public.current_member_id() or public.is_admin()) with check (user_id = public.current_member_id() or public.is_admin())', t);
  end loop;
end $$;

-- Content: any member reads, any member posts, author or admin edits/deletes.
drop policy if exists "members read resources" on public.resources;
create policy "members read resources" on public.resources
  for select using (public.is_cohort_member());
drop policy if exists "members insert resources" on public.resources;
create policy "members insert resources" on public.resources
  for insert with check (uploaded_by = public.current_member_id());
drop policy if exists "author manage resources" on public.resources;
create policy "author manage resources" on public.resources
  for all using (uploaded_by = public.current_member_id() or public.is_admin())
  with check (uploaded_by = public.current_member_id() or public.is_admin());

drop policy if exists "members read opportunities" on public.opportunities;
create policy "members read opportunities" on public.opportunities
  for select using (public.is_cohort_member());
drop policy if exists "members insert opportunities" on public.opportunities;
create policy "members insert opportunities" on public.opportunities
  for insert with check (posted_by = public.current_member_id());
drop policy if exists "author manage opportunities" on public.opportunities;
create policy "author manage opportunities" on public.opportunities
  for all using (posted_by = public.current_member_id() or public.is_admin())
  with check (posted_by = public.current_member_id() or public.is_admin());

drop policy if exists "members read help_requests" on public.help_requests;
create policy "members read help_requests" on public.help_requests
  for select using (public.is_cohort_member());
drop policy if exists "members insert help_requests" on public.help_requests;
create policy "members insert help_requests" on public.help_requests
  for insert with check (posted_by = public.current_member_id());
drop policy if exists "author manage help_requests" on public.help_requests;
create policy "author manage help_requests" on public.help_requests
  for all using (posted_by = public.current_member_id() or public.is_admin())
  with check (posted_by = public.current_member_id() or public.is_admin());

-- Storage bucket for profile photos and uploaded files (optional).
insert into storage.buckets (id, name, public)
values ('cohort-files', 'cohort-files', true)
on conflict (id) do nothing;
