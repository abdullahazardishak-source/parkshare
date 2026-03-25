-- Safe additive migration for full data rollout.
-- No destructive changes: only create-if-not-exists, alter-if-needed, indexes, and policies.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('driver', 'owner', 'admin');
  end if;
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id text primary key,
  email text not null unique,
  full_name text not null,
  phone text not null,
  nic text not null,
  role user_role not null default 'driver',
  avatar_url text,
  is_verified boolean not null default false,
  wallet_balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicles (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  make text not null,
  model text not null,
  year integer not null,
  license_plate text not null,
  color text not null,
  vehicle_type text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id text primary key,
  owner_id text not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  address text not null,
  city text not null,
  district text not null,
  latitude double precision not null,
  longitude double precision not null,
  price_per_hour numeric(12,2) not null,
  price_per_day numeric(12,2) not null,
  images text[] not null default '{}',
  amenities text[] not null default '{}',
  vehicle_types text[] not null default '{}',
  total_spaces integer not null default 1,
  available_spaces integer not null default 0,
  operating_hours_start text not null default '00:00',
  operating_hours_end text not null default '23:59',
  is_24_hours boolean not null default false,
  status text not null default 'pending',
  verification_status text not null default 'pending',
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key,
  listing_id text not null references public.listings(id) on delete cascade,
  driver_id text not null references public.profiles(id) on delete cascade,
  vehicle_id text not null references public.vehicles(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  total_hours numeric(8,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  platform_fee numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  status text not null default 'pending',
  payment_status text not null default 'pending',
  payment_method text not null default 'wallet',
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  booking_id text not null references public.bookings(id) on delete cascade,
  listing_id text not null references public.listings(id) on delete cascade,
  driver_id text not null references public.profiles(id) on delete cascade,
  rating integer not null,
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'system',
  is_read boolean not null default false,
  data jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.complaints (
  id text primary key,
  booking_id text not null references public.bookings(id) on delete cascade,
  complainant_id text not null references public.profiles(id) on delete cascade,
  respondent_id text not null references public.profiles(id) on delete cascade,
  subject text not null,
  description text not null,
  status text not null default 'open',
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payouts (
  id text primary key,
  owner_id text not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null,
  status text not null default 'pending',
  method text not null default 'bank_transfer',
  bank_account text,
  mobile_number text,
  reference text,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_listings (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  listing_id text not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.wallet_transactions (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null,
  type text not null,
  description text not null,
  reference_type text,
  reference_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id text primary key,
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create unique index if not exists vehicles_user_plate_unique on public.vehicles(user_id, license_plate);
create unique index if not exists saved_listings_user_listing_unique on public.saved_listings(user_id, listing_id);
create unique index if not exists reviews_booking_driver_unique on public.reviews(booking_id, driver_id);
create index if not exists listings_owner_id_idx on public.listings(owner_id);
create index if not exists bookings_driver_id_idx on public.bookings(driver_id);
create index if not exists bookings_listing_id_idx on public.bookings(listing_id);
create index if not exists complaints_status_idx on public.complaints(status);
create index if not exists payouts_status_idx on public.payouts(status);
create index if not exists notifications_user_read_idx on public.notifications(user_id, is_read);

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.listings enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.complaints enable row level security;
alter table public.payouts enable row level security;
alter table public.saved_listings enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin on public.profiles for select
using (
  auth.uid()::text = id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin on public.profiles for update
using (
  auth.uid()::text = id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
)
with check (
  auth.uid()::text = id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists vehicles_manage_self_or_admin on public.vehicles;
create policy vehicles_manage_self_or_admin on public.vehicles for all
using (
  auth.uid()::text = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
)
with check (
  auth.uid()::text = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists listings_select_public on public.listings;
create policy listings_select_public on public.listings for select using (true);

drop policy if exists listings_manage_owner_or_admin on public.listings;
create policy listings_manage_owner_or_admin on public.listings for all
using (
  auth.uid()::text = owner_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
)
with check (
  auth.uid()::text = owner_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists bookings_select_party_or_admin on public.bookings;
create policy bookings_select_party_or_admin on public.bookings for select
using (
  auth.uid()::text = driver_id
  or exists (
    select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid()::text
  )
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists bookings_insert_driver_or_admin on public.bookings;
create policy bookings_insert_driver_or_admin on public.bookings for insert
with check (
  auth.uid()::text = driver_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists bookings_update_party_or_admin on public.bookings;
create policy bookings_update_party_or_admin on public.bookings for update
using (
  auth.uid()::text = driver_id
  or exists (
    select 1 from public.listings l where l.id = listing_id and l.owner_id = auth.uid()::text
  )
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists notifications_select_self_or_admin on public.notifications;
create policy notifications_select_self_or_admin on public.notifications for select
using (
  auth.uid()::text = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists notifications_manage_self_or_admin on public.notifications;
create policy notifications_manage_self_or_admin on public.notifications for all
using (
  auth.uid()::text = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
)
with check (
  auth.uid()::text = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists complaints_select_party_or_admin on public.complaints;
create policy complaints_select_party_or_admin on public.complaints for select
using (
  auth.uid()::text = complainant_id
  or auth.uid()::text = respondent_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists complaints_insert_complainant_or_admin on public.complaints;
create policy complaints_insert_complainant_or_admin on public.complaints for insert
with check (
  auth.uid()::text = complainant_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists complaints_update_admin on public.complaints;
create policy complaints_update_admin on public.complaints for update
using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists payouts_select_owner_or_admin on public.payouts;
create policy payouts_select_owner_or_admin on public.payouts for select
using (
  auth.uid()::text = owner_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists payouts_insert_owner_or_admin on public.payouts;
create policy payouts_insert_owner_or_admin on public.payouts for insert
with check (
  auth.uid()::text = owner_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists payouts_update_admin on public.payouts;
create policy payouts_update_admin on public.payouts for update
using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

drop policy if exists app_settings_admin_only on public.app_settings;
create policy app_settings_admin_only on public.app_settings for all
using (
  exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p where p.id = auth.uid()::text and p.role = 'admin'
  )
);

