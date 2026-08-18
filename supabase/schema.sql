-- ============================================================
-- Biryani & Chill — Supabase Schema
-- Run this in your Supabase SQL editor (Dashboard > SQL > New query)
-- ============================================================

-- Products
create table if not exists products (
  id          text primary key,
  name        text not null,
  description text not null,
  price       int  not null,
  image_url   text not null default '/food-hero.png',
  badge       text,
  is_available boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Areas
create table if not exists areas (
  id          text primary key,
  label       text not null,
  emoji       text not null default '📍',
  is_active   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Orders
create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text unique not null,
  items           jsonb not null,
  subtotal        int not null,
  discount        int default 0,
  delivery_charge int default 30,
  total           int not null,
  promo_code      text,
  delivery        jsonb not null,
  status          text default 'pending',
  placed_at       timestamptz default now()
);

-- Banner
create table if not exists banner (
  id          int primary key default 1,
  badge_text  text default '🔥 Limited Offer',
  title       text default 'First order? 10% off',
  subtitle    text default 'Use code FIRSTORDER at checkout.',
  promo_hint  text default 'Also try CHILL20 for ৳20 off',
  is_active   boolean default true
);

-- Promo Codes
create table if not exists promo_codes (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  type        text not null check (type in ('percent', 'flat')),
  discount    int not null,
  label       text not null,
  is_active   boolean default true,
  usage_count int default 0,
  -- How many times a single customer may use this code. null = unlimited.
  per_user_limit int check (per_user_limit is null or per_user_limit > 0),
  created_at  timestamptz default now()
);

-- ============================================================
-- Seed data
-- ============================================================

insert into products (id, name, description, price, image_url, badge, sort_order) values
  ('beef-tehari',     'Beef Tehari',             'Slow-cooked beef in aromatic saffron rice',  190, '/food-hero.png', '🔥 Popular',  1),
  ('chicken-biryani', 'Chicken Biryani / Tehari', 'Tender chicken with fragrant basmati rice',  170, '/food-hero.png', 'Bestseller',  2),
  ('chicken-khichuri','Chicken Khichuri',         'Comfort khichuri with juicy chicken pieces', 170, '/food-hero.png', null,          3),
  ('beef-khichuri',   'Beef Khichuri',            'Rich beef khichuri, slow-cooked perfection', 190, '/food-hero.png', null,          4)
on conflict (id) do nothing;

insert into areas (id, label, emoji, sort_order) values
  ('bashundhara', 'Bashundhara', '📍', 1),
  ('uttara',      'Uttara',      '🏙️', 2),
  ('gulshan',     'Gulshan',     '✨', 3),
  ('banani',      'Banani',      '🌿', 4),
  ('dhanmondi',   'Dhanmondi',   '🎨', 5),
  ('mirpur',      'Mirpur',      '🏘️', 6),
  ('mohakhali',   'Mohakhali',   '🌆', 7),
  ('mohammadpur', 'Mohammadpur', '🕌', 8)
on conflict (id) do nothing;

insert into banner (id, badge_text, title, subtitle, promo_hint)
values (1, '🔥 Limited Offer', 'First order? 10% off', 'Use code FIRSTORDER at checkout.', 'Also try CHILL20 for ৳20 off')
on conflict (id) do update set id = excluded.id;

insert into promo_codes (code, type, discount, label) values
  ('FIRSTORDER', 'percent', 10, '10% off your first order'),
  ('CHILL20',    'flat',    20, '৳20 off'),
  ('WELCOME50',  'flat',    50, '৳50 off')
on conflict (code) do nothing;
