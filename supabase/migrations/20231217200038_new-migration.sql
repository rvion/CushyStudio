delete from published_apps;

alter table published_apps add column app_id text not null;

-- add unique constraint on app_id + user_id
alter table published_apps
add constraint published_apps_app_id_user_id_unique unique (app_id, user_id);