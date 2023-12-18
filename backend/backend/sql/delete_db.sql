-- Disable foreign key constraint check
SET session_replication_role = replica;

-- Delete each table
DROP TABLE IF EXISTS SHORT_TEXT_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS AUTHENTICATION CASCADE;

DROP TABLE IF EXISTS LONG_TEXT_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS MULTIPLE_CHOICE_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS CHECKBOX_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS VIDEO_UPLOAD_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS DATE_PICKER_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS DATETIME_PICKER_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS NUMBER_PICKER_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS DROPDOWN_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS PDF_UPLOAD_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS IMAGE_UPLOAD_ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS ANSWER_TABLE CASCADE;

DROP TABLE IF EXISTS SHORT_TEXT_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS LONG_TEXT_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS MULTIPLE_CHOICE_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE CASCADE;

DROP TABLE IF EXISTS CHECKBOX_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS VIDEO_UPLOAD_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS DATE_PICKER_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS DATETIME_PICKER_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS NUMBER_PICKER_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS DROPDOWN_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS DROPDOWN_QUESTION_OPTION_TABLE CASCADE;

DROP TABLE IF EXISTS PDF_UPLOAD_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS IMAGE_UPLOAD_QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS QUESTION_TABLE CASCADE;

DROP TABLE IF EXISTS PHASE_TABLE CASCADE;

DROP TABLE IF EXISTS APPLICATION_TABLE CASCADE;

DROP TABLE IF EXISTS USER_PROFILES_TABLE CASCADE;

DROP TABLE IF EXISTS USER_ROLES_TABLE CASCADE;

DROP TABLE IF EXISTS SECTIONS_TABLE;

DROP TABLE IF EXISTS PHASE_OUTCOME_TABLE;

DROP TABLE IF EXISTS PHASE_ASSIGNMENT_TABLE;

DROP TABLE IF EXISTS CONDITIONAL_QUESTION_CHOICE_TABLE;

DROP TABLE IF EXISTS CONDITIONAL_QUESTION_TABLE;

DROP TABLE IF EXISTS CONDITIONAL_ANSWER_TABLE;

DELETE FROM auth.users;

-- Re-enable foreign key constraint check
SET session_replication_role = DEFAULT;
