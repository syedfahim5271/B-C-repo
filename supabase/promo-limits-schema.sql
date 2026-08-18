-- ============================================================
-- Biryani & Chill — Per-customer promo code limits
-- Additive migration. Run AFTER schema.sql and auth-schema.sql in the
-- Supabase SQL editor (Dashboard > SQL > New query). Safe to re-run.
-- ============================================================

-- How many times a single customer may use a code. null = unlimited,
-- which is what every existing code stays on after this migration.
alter table promo_codes
  add column if not exists per_user_limit int;

alter table promo_codes
  drop constraint if exists promo_codes_per_user_limit_check;

alter table promo_codes
  add constraint promo_codes_per_user_limit_check
  check (per_user_limit is null or per_user_limit > 0);

-- One row per (customer, code) redemption. Counting rows here is how the
-- per_user_limit is enforced; promo_codes.usage_count stays the global total.
-- user_id is nullable so a guest order still leaves a trace, but only
-- signed-in redemptions can be counted against a limit.
create table if not exists promo_redemptions (
  id           uuid primary key default gen_random_uuid(),
  code         text not null,
  user_id      uuid references users(id) on delete cascade,
  order_number text,
  created_at   timestamptz default now()
);

create index if not exists promo_redemptions_code_user_idx
  on promo_redemptions (code, user_id);
