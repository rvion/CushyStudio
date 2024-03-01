create table creator_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  username text not null,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


create policy "Individuals can create creator_profile." on creator_profile for
    insert with check (auth.uid() = user_id);

create policy "Everyone can see creator_profile." on creator_profile for
    select using (true);

create policy "Individuals can update their own creator_profile." on creator_profile for
    update using (auth.uid() = user_id);

create policy "Individuals can delete their own creator_profile." on creator_profile for
    delete using (auth.uid() = user_id);
