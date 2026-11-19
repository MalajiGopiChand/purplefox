-- Run in the Supabase SQL editor. No passwords or private API keys belong here.
begin;
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.admin_users where user_id = (select auth.uid())) $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.enquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (length(trim(name)) between 1 and 100),
  phone text not null check (phone ~ '^[+0-9 ()-]+$' and length(regexp_replace(phone,'[^0-9]','','g')) between 10 and 15),
  event text not null check (length(event) between 1 and 100),
  event_date date,
  location text not null default '' check (length(location) <= 150),
  guests integer check (guests between 1 and 100000),
  budget text not null default '' check (length(budget) <= 100),
  details text not null default '' check (length(details) <= 1500),
  source text not null check (source in ('whatsapp','event_form')),
  page text not null default '/' check (length(page) <= 300),
  status text not null default 'New' check (status in ('New','Contacted','Quoted','Confirmed','Closed')),
  admin_notes text not null default '' check (length(admin_notes) <= 5000)
);
create index if not exists enquiries_created_at_idx on public.enquiries(created_at desc);
create index if not exists enquiries_phone_idx on public.enquiries(phone,created_at desc);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
grant select, update on public.enquiries to authenticated;
create policy "Admins read enquiries" on public.enquiries for select to authenticated using ((select public.is_admin()));
create policy "Admins update enquiries" on public.enquiries for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Visitors can submit only; they cannot list or read any enquiry, including their own.
create or replace function public.submit_enquiry(payload jsonb) returns void
language plpgsql security definer set search_path = '' as $$
declare clean_phone text;
begin
  if jsonb_typeof(payload) <> 'object' then raise exception 'Invalid enquiry'; end if;
  clean_phone := regexp_replace(payload->>'phone','[^0-9]','','g');
  perform pg_advisory_xact_lock(hashtextextended(clean_phone,0));
  -- UUID retries are idempotent, including a retry after a dropped network response.
  if exists(select 1 from public.enquiries where id=(payload->>'id')::uuid) then return; end if;
  if exists(select 1 from public.enquiries where regexp_replace(phone,'[^0-9]','','g')=clean_phone and created_at > now()-interval '30 seconds') then
    raise exception 'Please wait a moment before submitting another enquiry';
  end if;
  if payload->>'source' = 'event_form' and length(trim(coalesce(payload->>'location',''))) = 0 then raise exception 'An event location is required'; end if;
  if nullif(payload->>'event_date','')::date < current_date then raise exception 'Choose an upcoming date'; end if;
  insert into public.enquiries(id,name,phone,event,event_date,location,guests,budget,details,source,page)
  values((payload->>'id')::uuid,trim(payload->>'name'),trim(payload->>'phone'),coalesce(nullif(trim(payload->>'event'),''),'To discuss'),nullif(payload->>'event_date','')::date,trim(coalesce(payload->>'location','')),nullif(payload->>'guests','')::integer,coalesce(payload->>'budget',''),coalesce(payload->>'details',''),payload->>'source',coalesce(payload->>'page','/'));
end $$;
revoke all on function public.submit_enquiry(jsonb) from public;
grant execute on function public.submit_enquiry(jsonb) to anon, authenticated;

create table if not exists public.event_plans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  title text not null check (length(trim(title)) between 1 and 150),
  client_name text not null check (length(trim(client_name)) between 1 and 100),
  phone text not null default '' check (length(phone)<=20), event_date date,
  venue text not null default '' check (length(venue)<=200),
  guests integer check (guests between 1 and 100000), budget numeric(14,2) check (budget between 0 and 1000000000),
  status text not null default 'Planning' check (status in ('Planning','Confirmed','In progress','Completed','Cancelled')),
  notes text not null default '' check (length(notes)<=5000)
);
alter table public.event_plans enable row level security;
revoke all on public.event_plans from anon, authenticated;
grant select,insert,update,delete on public.event_plans to authenticated;
create policy "Admins manage event plans" on public.event_plans for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  title text not null check (length(trim(title)) between 1 and 150),
  alt text not null check (length(trim(alt)) between 1 and 300),
  caption text not null default '' check (length(caption)<=1000),
  storage_path text not null unique check (storage_path ~ '^[a-f0-9-]+\.(jpg|png|webp)$'),
  placement text not null check (placement in ('gallery','event')),
  event_slug text not null check (length(event_slug)<=100),
  published boolean not null default false
);
alter table public.media enable row level security;
revoke all on public.media from anon, authenticated;
grant select on public.media to anon;
grant select,insert,update,delete on public.media to authenticated;
create policy "Published photos are visible" on public.media for select to anon,authenticated using (published);
create policy "Admins manage photos" on public.media for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at=now(); return new; end $$;
create trigger enquiries_updated before update on public.enquiries for each row execute function public.touch_updated_at();
create trigger event_plans_updated before update on public.event_plans for each row execute function public.touch_updated_at();
create trigger media_updated before update on public.media for each row execute function public.touch_updated_at();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('event-images','event-images',true,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Admins upload event photos" on storage.objects for insert to authenticated with check (bucket_id='event-images' and (select public.is_admin()));
create policy "Admins read stored event photos" on storage.objects for select to authenticated using (bucket_id='event-images' and (select public.is_admin()));
create policy "Admins remove event photos" on storage.objects for delete to authenticated using (bucket_id='event-images' and (select public.is_admin()));

-- Create this confirmed user in Authentication first. Authorization is tied to its UUID.
insert into public.admin_users(user_id)
select id from auth.users where lower(email)='purplefox@gmail.com' and email_confirmed_at is not null
on conflict do nothing;
commit;
