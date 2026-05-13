DROP FUNCTION IF EXISTS public.fetch_checkbox_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_conditional_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_date_picker_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_datetime_picker_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_image_upload_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_long_text_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_multiple_choice_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_video_upload_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_dropdown_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_number_picker_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_pdf_upload_answer_table(uuid, uuid);
DROP FUNCTION IF EXISTS public.fetch_short_text_answer_table(uuid, uuid);


CREATE OR REPLACE FUNCTION public.fetch_checkbox_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, checked boolean)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.checked
    FROM CHECKBOX_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_conditional_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, selectedchoice text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedchoice
    FROM CONDITIONAL_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_date_picker_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, pickeddate date)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickeddate
    FROM DATE_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_datetime_picker_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, pickeddatetime timestamp with time zone)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickeddatetime
    FROM DATETIME_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_dropdown_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, selectedoptions text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedoptions
    FROM DROPDOWN_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_image_upload_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, imagename text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.imagename
    FROM IMAGE_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_long_text_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, answertext text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.answertext
    FROM LONG_TEXT_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_multiple_choice_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, selectedchoice text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedchoice
    FROM MULTIPLE_CHOICE_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_number_picker_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, pickednumber integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickednumber
    FROM NUMBER_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_pdf_upload_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, pdfname text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pdfname
    FROM PDF_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_short_text_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, answertext text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.answertext
    FROM SHORT_TEXT_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_video_upload_answer_table(question_id uuid, application_id uuid)
 RETURNS TABLE(answerid uuid, videoname text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.videoname
    FROM VIDEO_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    WHERE a.questionid = question_id AND a.applicationid = application_id;
END;
$function$
;