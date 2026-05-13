create table api_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  month text not null, -- format: YYYY-MM
  explain_count integer default 0,
  proposal_count integer default 0,
  unique(user_id, month)
);

alter table api_usage enable row level security;

create policy "Users can view own usage" on api_usage
  for select using (auth.uid() = user_id);

-- Service role handles inserts/updates from API routes
