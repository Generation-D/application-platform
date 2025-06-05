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



