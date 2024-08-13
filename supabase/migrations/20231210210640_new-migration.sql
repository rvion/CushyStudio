create table published_apps (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  task text check (char_length(task) > 3),
  is_complete boolean default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table published_apps enable row level security;

create policy "Individuals can create published_apps." on published_apps for
    insert with check (auth.uid() = user_id);

create policy "Everyone can see published_apps." on published_apps for
    select using (true);
    -- select using (auth.uid() = user_id);

create policy "Individuals can update their own published_apps." on published_apps for
    update using (auth.uid() = user_id);

create policy "Individuals can delete their own published_apps." on published_apps for
    delete using (auth.uid() = user_id);
