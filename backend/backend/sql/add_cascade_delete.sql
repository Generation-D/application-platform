-- SQL script to add ON DELETE CASCADE to foreign key constraints
-- This ensures that when a phase is deleted, all related entries are automatically deleted

-- Update SECTIONS_TABLE to cascade delete when phase is deleted
ALTER TABLE SECTIONS_TABLE
DROP CONSTRAINT IF EXISTS sections_table_phaseid_fkey,
ADD CONSTRAINT sections_table_phaseid_fkey
FOREIGN KEY (phaseid) REFERENCES PHASE_TABLE(phaseid) ON DELETE CASCADE;

-- Update QUESTION_TABLE to cascade delete when phase is deleted
ALTER TABLE QUESTION_TABLE
DROP CONSTRAINT IF EXISTS question_table_phaseid_fkey,
ADD CONSTRAINT question_table_phaseid_fkey
FOREIGN KEY (phaseid) REFERENCES PHASE_TABLE(phaseid) ON DELETE CASCADE;

-- Update all question type tables to cascade delete when question is deleted

-- SHORT_TEXT_QUESTION_TABLE
ALTER TABLE SHORT_TEXT_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS short_text_question_table_questionid_fkey,
ADD CONSTRAINT short_text_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- LONG_TEXT_QUESTION_TABLE
ALTER TABLE LONG_TEXT_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS long_text_question_table_questionid_fkey,
ADD CONSTRAINT long_text_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- CHECKBOX_QUESTION_TABLE
ALTER TABLE CHECKBOX_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS checkbox_question_table_questionid_fkey,
ADD CONSTRAINT checkbox_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- MULTIPLE_CHOICE_QUESTION_TABLE
ALTER TABLE MULTIPLE_CHOICE_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS multiple_choice_question_table_questionid_fkey,
ADD CONSTRAINT multiple_choice_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- VIDEO_UPLOAD_QUESTION_TABLE
ALTER TABLE VIDEO_UPLOAD_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS video_upload_question_table_questionid_fkey,
ADD CONSTRAINT video_upload_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- DATE_PICKER_QUESTION_TABLE
ALTER TABLE DATE_PICKER_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS date_picker_question_table_questionid_fkey,
ADD CONSTRAINT date_picker_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- DATETIME_PICKER_QUESTION_TABLE
ALTER TABLE DATETIME_PICKER_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS datetime_picker_question_table_questionid_fkey,
ADD CONSTRAINT datetime_picker_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- NUMBER_PICKER_QUESTION_TABLE
ALTER TABLE NUMBER_PICKER_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS number_picker_question_table_questionid_fkey,
ADD CONSTRAINT number_picker_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- DROPDOWN_QUESTION_TABLE
ALTER TABLE DROPDOWN_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS dropdown_question_table_questionid_fkey,
ADD CONSTRAINT dropdown_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- PDF_UPLOAD_QUESTION_TABLE
ALTER TABLE PDF_UPLOAD_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS pdf_upload_question_table_questionid_fkey,
ADD CONSTRAINT pdf_upload_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- IMAGE_UPLOAD_QUESTION_TABLE
ALTER TABLE IMAGE_UPLOAD_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS image_upload_question_table_questionid_fkey,
ADD CONSTRAINT image_upload_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- CONDITIONAL_QUESTION_TABLE
ALTER TABLE CONDITIONAL_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS conditional_question_table_questionid_fkey,
ADD CONSTRAINT conditional_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- Also update choice and option tables to cascade delete when their parent question is deleted

-- MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
ALTER TABLE MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
DROP CONSTRAINT IF EXISTS multiple_choice_question_choice_table_questionid_fkey,
ADD CONSTRAINT multiple_choice_question_choice_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES MULTIPLE_CHOICE_QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- DROPDOWN_QUESTION_OPTION_TABLE
ALTER TABLE DROPDOWN_QUESTION_OPTION_TABLE
DROP CONSTRAINT IF EXISTS dropdown_question_option_table_questionid_fkey,
ADD CONSTRAINT dropdown_question_option_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES DROPDOWN_QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- CONDITIONAL_QUESTION_CHOICE_TABLE
ALTER TABLE CONDITIONAL_QUESTION_CHOICE_TABLE
DROP CONSTRAINT IF EXISTS conditional_question_choice_table_questionid_fkey,
ADD CONSTRAINT conditional_question_choice_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES CONDITIONAL_QUESTION_TABLE(questionid) ON DELETE CASCADE;

-- Verify the constraints have been updated
SELECT tc.constraint_name, tc.table_name, tc.constraint_type,
       ccu.table_name AS foreign_table_name,
       rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.referential_constraints rc
     ON tc.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage ccu
     ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name LIKE '%_question_%'
  AND tc.constraint_type = 'FOREIGN KEY';
