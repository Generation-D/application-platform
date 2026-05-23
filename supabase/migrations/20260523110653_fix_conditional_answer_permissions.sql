create policy "select_reviewer_conditional_answer_table"
on "public"."conditional_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "conditional_answer_table"
on "public"."conditional_answer_table"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));
  