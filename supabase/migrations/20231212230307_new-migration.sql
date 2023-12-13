alter table published_apps
    add column illustration_url text;

alter table published_apps
    add column description text;

alter table published_apps
    add tags text[];
