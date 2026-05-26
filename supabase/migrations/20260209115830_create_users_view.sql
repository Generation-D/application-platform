create or replace view public.users as select * from auth.users;
  revoke all on public.users from anon, authenticated, public;
  grant select on public.users to service_role;

create or replace function fetch_applications_paginated(
  page_size int default 10,
  page_number int default 1
)
returns table (
  applicationid uuid,
  email varchar(255)
) 
language plpgsql
security definer
set search_path = public
as $$
declare
  offset_val int := (page_number - 1) * page_size;
begin
  if not exists (
    select 1 from user_profiles_table 
    where userid = auth.uid() and userrole >= 2
  ) then
    raise exception 'Access Denied';
  end if;

  return query
  select 
    a.applicationid,
    v.email
  from public.users v
  join public.application_table a on v.id = a.userid
  order by a.applicationid 
  limit page_size
  offset offset_val;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  auth_provider text;
begin
  auth_provider := new.raw_app_meta_data->>'provider';

  if auth_provider = 'slack_oidc' then

    insert into public.user_profiles_table (userid, userrole, isactive)
    values (
      new.id, 
      2,
      TRUE
    );

  else
    
    insert into public.user_profiles_table (userid, userrole, isactive)
    values (
      new.id, 
      1,
      TRUE
    );

  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
