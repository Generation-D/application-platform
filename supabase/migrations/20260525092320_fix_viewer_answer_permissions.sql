create policy "select_answer_for_viewer"
on "public"."answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_checkbox_answer_for_viewer"
on "public"."checkbox_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_conditional_answer_for_viewer"
on "public"."conditional_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_date_picker_answer_for_viewer"
on "public"."date_picker_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_datetime_picker_answer_for_viewer"
on "public"."datetime_picker_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_dropdown_answer_for_viewer"
on "public"."dropdown_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_image_upload_answer_for_viewer"
on "public"."image_upload_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_long_text_answer_for_viewer"
on "public"."long_text_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_multiple_choice_answer_for_viewer"
on "public"."multiple_choice_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_number_picker_answer_for_viewer"
on "public"."number_picker_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_pdf_upload_answer_for_viewer"
on "public"."pdf_upload_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_short_text_answer_for_viewer"
on "public"."short_text_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));

create policy "select_video_upload_answer_for_viewer"
on "public"."video_upload_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));