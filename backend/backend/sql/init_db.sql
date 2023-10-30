-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE APPLICATION_TABLE (
    applicationId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES APL_AUTHENTICATION(userId),
    lastLogin TIMESTAMPTZ,
    lastUpdate TIMESTAMPTZ,
    created TIMESTAMPTZ NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
);
ALTER TABLE APPLICATION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE PHASE_TABLE (
    phaseId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phaseName VARCHAR(255) NOT NULL,
    phaseOrder INT NOT NULL,
    startDate TIMESTAMPTZ NOT NULL,
    endDate TIMESTAMPTZ NOT NULL
);
ALTER TABLE PHASE_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE QUESTION_TABLE (
    questionId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionType VARCHAR(255) NOT NULL,
    questionOrder INT NOT NULL,
    phaseId UUID NOT NULL REFERENCES PHASE_TABLE(phaseId),
    mandatory INT NOT NULL
);
ALTER TABLE QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE ANSWER_TABLE (
    answerId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionId UUID NOT NULL REFERENCES QUESTION_TABLE(questionId),
    applicationId UUID NOT NULL REFERENCES APPLICATION_TABLE(applicationId),
    timestamp TIMESTAMPTZ NOT NULL
);
ALTER TABLE ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE SHORT_TEXT_QUESTION_TABLE (
    questionId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionText VARCHAR(255) NOT NULL,
    FOREIGN KEY (questionId) REFERENCES QUESTION_TABLE (questionId)
);
ALTER TABLE SHORT_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE LONG_TEXT_QUESTION_TABLE (
    questionId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionText TEXT NOT NULL,
    FOREIGN KEY (questionId) REFERENCES QUESTION_TABLE (questionId)
);
ALTER TABLE LONG_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE MULTIPLE_CHOICE_QUESTION_TABLE (
    questionId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionText TEXT NOT NULL,
    minAnswers INT NOT NULL,
    maxAnswers INT NOT NULL,
    FOREIGN KEY (questionId) REFERENCES QUESTION_TABLE (questionId)
);
ALTER TABLE MULTIPLE_CHOICE_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE MULTIPLE_CHOICE_QUESTION_CHOICES_TABLE (
    choiceId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionId UUID NOT NULL,
    choiceText VARCHAR(255) NOT NULL,
    FOREIGN KEY (questionId) REFERENCES MULTIPLE_CHOICE_QUESTION_TABLE (questionId)
);
ALTER TABLE MULTIPLE_CHOICE_QUESTION_CHOICES_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE VIDEO_UPLOAD_QUESTION_TABLE (
    questionId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionText TEXT NOT NULL,
    FOREIGN KEY (questionId) REFERENCES QUESTION_TABLE (questionId)
);
ALTER TABLE VIDEO_UPLOAD_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE SHORT_TEXT_ANSWER_TABLE (
    answerId UUID PRIMARY KEY,
    answerText VARCHAR(255) NOT NULL,
    FOREIGN KEY (answerId) REFERENCES ANSWER_TABLE (answerId) ON DELETE CASCADE
);
ALTER TABLE SHORT_TEXT_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE LONG_TEXT_ANSWER_TABLE (
    answerId UUID PRIMARY KEY,
    answerText TEXT NOT NULL,
    FOREIGN KEY (answerId) REFERENCES ANSWER_TABLE (answerId) ON DELETE CASCADE
);
ALTER TABLE LONG_TEXT_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE MULTIPLE_CHOICE_ANSWER_TABLE (
    answerId UUID PRIMARY KEY,
    selectedChoice TEXT NOT NULL, -- This will store a JSON array
    FOREIGN KEY (answerId) REFERENCES ANSWER_TABLE (answerId) ON DELETE CASCADE
);
ALTER TABLE MULTIPLE_CHOICE_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE VIDEO_ANSWER_TABLE (
    answerId UUID PRIMARY KEY,
    videoUrl VARCHAR(255) NOT NULL, -- change to Videoupload later on
    FOREIGN KEY (answerId) REFERENCES ANSWER_TABLE (answerId) ON DELETE CASCADE
);
ALTER TABLE VIDEO_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;
