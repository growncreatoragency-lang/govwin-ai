-- Add Stripe fields to profiles table
alter table profiles
  add column if not exists stripe_customer_id text,
  add column if not exists subscription_status text default 'inactive';

-- Index for webhook lookups
create index if not exists profiles_stripe_customer_id_idx on profiles(stripe_customer_id);
