-- Slack members are trusted reviewers. Other registrations remain applicants.
-- This affects new accounts only; existing roles and activation states are preserved.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_profiles_table (userid, userrole, isactive)
  values (
    new.id,
    case when new.raw_app_meta_data->>'provider' = 'slack_oidc' then 2 else 1 end,
    true
  );
  return new;
end;
$$;
