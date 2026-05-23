create policy "all_cmds"
on "storage"."buckets"
as permissive
for all
to authenticated
using ((auth.uid() = owner))
with check ((auth.uid() = owner));


create policy "all_cmds"
on "storage"."objects"
as permissive
for all
to authenticated
using ((auth.uid() = owner))
with check ((auth.uid() = owner));


create policy "all_cmds_for_atleast_viewer"
on "storage"."buckets"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole >= 2)))));


create policy "all_cmds_for_atleast_viewer"
on "storage"."objects"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole >= 2)))));
