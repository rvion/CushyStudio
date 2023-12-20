alter table published_apps
    rename column inserted_at to created_at;

alter table published_apps
    add column updated_at timestamp with time zone default timezone('utc'::text, now()) not null;


alter table published_apps
    drop column is_complete;

alter table published_apps
    rename column task to name