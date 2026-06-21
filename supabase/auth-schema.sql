-- ============================================================
-- Biryani & Chill — Auth / Profiles / Referrals schema
-- Additive migration. Run AFTER schema.sql in the Supabase SQL editor
-- (Dashboard > SQL > New query). Safe to re-run.
-- ============================================================

-- Users (one row per Google account)
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  google_id     text unique not null,
  email         text unique,
  name          text,
  phone         text,
  area          text,
  address       text,
  referral_code text unique not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Rewards: each row is BOTH a referral redemption record and the
-- referrer's one-time 25% reward code.
--   referrer_id        -> the user who owns the referral code (gets the reward)
--   referred_user_id   -> the user who redeemed the referral code (unique => once per user)
--   code               -> the GIFT-XXXX reward code the referrer can spend once
create table if not exists rewards (
  id               uuid primary key default gen_random_uuid(),
  code             text unique not null,
  referrer_id      uuid references users(id) on delete cascade,
  referred_user_id uuid references users(id) on delete set null unique,
  source_order     text,
  is_used          boolean default false,
  used_at          timestamptz,
  used_order       text,
  created_at       timestamptz default now()
);

create index if not exists rewards_referrer_idx on rewards (referrer_id);

-- Link orders to a user (nullable — legacy/guest orders keep null)
alter table orders add column if not exists user_id uuid references users(id);
