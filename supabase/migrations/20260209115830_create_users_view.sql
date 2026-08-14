create or replace view public.users as select * from auth.users;
  revoke all on public.users from anon, authenticated, public;
  grant select on public.users to service_role;

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
