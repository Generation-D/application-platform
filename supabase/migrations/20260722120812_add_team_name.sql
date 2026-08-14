ALTER TABLE application_table 
ADD team_name TEXT;

create or replace function fetch_applications_paginated(
  page_size int default 10,
  page_number int default 1
)
returns table (
  applicationid uuid,
  team_name TEXT,
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
    a.team_name,
    v.email
  from public.users v
  join public.application_table a on v.id = a.userid
  order by a.applicationid 
  limit page_size
  offset offset_val;
end;
$$;
