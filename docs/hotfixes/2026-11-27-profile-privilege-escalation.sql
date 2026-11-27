-- HOTFIX for databases created from the pre-baseline migrations (production).
-- Apply manually, e.g. in the Supabase SQL editor. Safe to run more than once.
--
-- Problem: users could delete their own user_profiles_table row and insert a
-- new one with userrole = 3, making themselves admin. They could also create
-- extra application rows or delete their application.
--
-- All legitimate writes to these tables go through the service role
-- (sign-up, admin user management, scripts), so users only need to read
-- their own rows.

begin;

drop policy if exists "insert_profile" on public.user_profiles_table;
drop policy if exists "update_profile" on public.user_profiles_table;
drop policy if exists "delete_profile" on public.user_profiles_table;

drop policy if exists "insert_application" on public.application_table;
drop policy if exists "update_application" on public.application_table;
drop policy if exists "delete_application" on public.application_table;

-- Users must not be able to create storage buckets either.
drop policy if exists "all_cmds" on storage.buckets;

commit;

-- Check afterwards whether anyone already used the hole:
--   select p.userid, u.email, p.userrole, u.created_at
--   from public.user_profiles_table p join auth.users u on u.id = p.userid
--   where p.userrole = 3
--   order by u.created_at;
