create table profiles (
  id uuid references auth.users on delete cascade primary key,
  business_name text,
  location text,
  naics text,
  services text,
  certifications text[],
  contract_size text,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can manage own profile" on profiles
  for all using (auth.uid() = id);
