
-- Disable foreign key constraint check
SET session_replication_role = replica;

-- Empty each table
TRUNCATE TABLE SHORT_TEXT_ANSWER_TABLE CASCADE;
TRUNCATE TABLE LONG_TEXT_ANSWER_TABLE CASCADE;
TRUNCATE TABLE MULTIPLE_CHOICE_ANSWER_TABLE CASCADE;
TRUNCATE TABLE CHECKBOX_ANSWER_TABLE CASCADE;
TRUNCATE TABLE VIDEO_UPLOAD_ANSWER_TABLE CASCADE;
TRUNCATE TABLE DATE_PICKER_ANSWER_TABLE CASCADE;
TRUNCATE TABLE DATETIME_PICKER_ANSWER_TABLE CASCADE;
TRUNCATE TABLE NUMBER_PICKER_ANSWER_TABLE CASCADE;
TRUNCATE TABLE DROPDOWN_ANSWER_TABLE CASCADE;
TRUNCATE TABLE PDF_UPLOAD_ANSWER_TABLE CASCADE;
TRUNCATE TABLE IMAGE_UPLOAD_ANSWER_TABLE CASCADE;
TRUNCATE TABLE ANSWER_TABLE CASCADE;
TRUNCATE TABLE SHORT_TEXT_QUESTION_TABLE CASCADE;
TRUNCATE TABLE LONG_TEXT_QUESTION_TABLE CASCADE;
TRUNCATE TABLE MULTIPLE_CHOICE_QUESTION_TABLE CASCADE;
TRUNCATE TABLE MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE CASCADE;
TRUNCATE TABLE CHECKBOX_QUESTION_TABLE CASCADE;
TRUNCATE TABLE VIDEO_UPLOAD_QUESTION_TABLE CASCADE;
TRUNCATE TABLE DATE_PICKER_QUESTION_TABLE CASCADE;
TRUNCATE TABLE DATETIME_PICKER_QUESTION_TABLE CASCADE;
TRUNCATE TABLE NUMBER_PICKER_QUESTION_TABLE CASCADE;
TRUNCATE TABLE DROPDOWN_QUESTION_TABLE CASCADE;
TRUNCATE TABLE DROPDOWN_QUESTION_OPTION_TABLE CASCADE;
TRUNCATE TABLE PDF_UPLOAD_QUESTION_TABLE CASCADE;
TRUNCATE TABLE IMAGE_UPLOAD_QUESTION_TABLE CASCADE;
TRUNCATE TABLE QUESTION_TABLE CASCADE;
TRUNCATE TABLE PHASE_TABLE CASCADE;
TRUNCATE TABLE APPLICATION_TABLE CASCADE;
TRUNCATE TABLE USER_PROFILES_TABLE CASCADE;
TRUNCATE TABLE USER_ROLES_TABLE CASCADE;
TRUNCATE TABLE SECTIONS_TABLE CASCADE;
TRUNCATE TABLE PHASE_OUTCOME_TABLE CASCADE;
TRUNCATE TABLE PHASE_ASSIGNMENT_TABLE CASCADE;
TRUNCATE TABLE CONDITIONAL_QUESTION_CHOICE_TABLE CASCADE;
TRUNCATE TABLE CONDITIONAL_QUESTION_TABLE CASCADE;
TRUNCATE TABLE CONDITIONAL_ANSWER_TABLE CASCADE;
TRUNCATE TABLE auth.users CASCADE;

-- Re-enable foreign key constraint check
SET session_replication_role = DEFAULT;