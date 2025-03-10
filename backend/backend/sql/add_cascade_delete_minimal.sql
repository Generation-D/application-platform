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

-- PDF_UPLOAD_QUESTION_TABLE
ALTER TABLE PDF_UPLOAD_QUESTION_TABLE
DROP CONSTRAINT IF EXISTS pdf_upload_question_table_questionid_fkey,
ADD CONSTRAINT pdf_upload_question_table_questionid_fkey
FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE(questionid) ON DELETE CASCADE;

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
