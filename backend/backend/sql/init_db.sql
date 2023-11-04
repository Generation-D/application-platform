-- Enable the UUID extension
CREATE EXTENSION
  IF NOT EXISTS "uuid-ossp";

CREATE TABLE
  APPLICATION_TABLE (
    applicationid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    userid UUID NOT NULL REFERENCES auth.users (id),
    lastlogin TIMESTAMPTZ,
    lastupdate TIMESTAMPTZ,
    created TIMESTAMPTZ NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
);
ALTER TABLE APPLICATION_TABLE ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  APPLICATION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  PHASE_TABLE (
    phaseid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    phasename VARCHAR(255) NOT NULL,
    phaseorder INT NOT NULL,
    startdate TIMESTAMPTZ NOT NULL,
    enddate TIMESTAMPTZ NOT NULL
  );

ALTER TABLE
  PHASE_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questiontype VARCHAR(255) NOT NULL,
    questionorder INT NOT NULL,
    phaseid UUID NOT NULL REFERENCES PHASE_TABLE (phaseid),
    mandatory BOOLEAN NOT NULL,
    questiontext TEXT NOT NULL
  );

ALTER TABLE
  QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  ANSWER_TABLE (
    answerid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL REFERENCES QUESTION_TABLE (questionid),
    applicationid UUID NOT NULL REFERENCES APPLICATION_TABLE (applicationid),
    timestamp TIMESTAMPTZ NOT NULL
  );

CREATE TABLE SHORT_TEXT_QUESTION_TABLE (
    questionId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maxTextLength INT NOT NULL,
    regex VARCHAR(255) NOT NULL,
    FOREIGN KEY (questionId) REFERENCES QUESTION_TABLE (questionId)
);
ALTER TABLE SHORT_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE LONG_TEXT_QUESTION_TABLE (
    questionId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    questionText TEXT NOT NULL,
    maxTextLength INT NOT NULL,
    FOREIGN KEY (questionId) REFERENCES QUESTION_TABLE (questionId)
);
ALTER TABLE LONG_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

ALTER TABLE ANSWER_TABLE ENABLE ROW LEVEL SECURITY;


ALTER TABLE
  SHORT_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  LONG_TEXT_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid)
  );

ALTER TABLE
  LONG_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE SHORT_TEXT_ANSWER_TABLE (
    answerId UUID PRIMARY KEY,
    answerText VARCHAR(255) NOT NULL,
    maxTextLength INT NOT NULL,
    FOREIGN KEY (answerId) REFERENCES ANSWER_TABLE (answerId) ON DELETE CASCADE
);
ALTER TABLE SHORT_TEXT_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE LONG_TEXT_ANSWER_TABLE (
    answerId UUID PRIMARY KEY,
    answerText TEXT NOT NULL,
    maxTextLength INT NOT NULL,
    FOREIGN KEY (answerId) REFERENCES ANSWER_TABLE (answerId) ON DELETE CASCADE
);
ALTER TABLE LONG_TEXT_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  MULTIPLE_CHOICE_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    minanswers INT NOT NULL,
    maxanswers INT NOT NULL,
    userinput BOOLEAN NOT NULL,
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid)
  );

ALTER TABLE  MULTIPLE_CHOICE_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE (
    choiceid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL,
    choicetext VARCHAR(255) NOT NULL,
    FOREIGN KEY (questionid) REFERENCES MULTIPLE_CHOICE_QUESTION_TABLE (questionid)
  );

ALTER TABLE
  MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  VIDEO_UPLOAD_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxfilesizeinmb DECIMAL NOT NULL
  );

ALTER TABLE
  VIDEO_UPLOAD_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DATE_PICKER_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    mindate DATE NOT NULL,
    maxdate DATE NOT NULL
  );

ALTER TABLE
  DATE_PICKER_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DATETIME_PICKER_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    mindatetime TIMESTAMPTZ NOT NULL,
    maxdatetime TIMESTAMPTZ NOT NULL
  );

ALTER TABLE
  DATETIME_PICKER_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  NUMBER_PICKER_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    minnumber INT NOT NULL,
    maxnumber INT NOT NULL
  );

ALTER TABLE
  NUMBER_PICKER_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DROPDOWN_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    minanswers INT NOT NULL,
    maxanswers INT NOT NULL,
    userinput BOOLEAN NOT NULL,
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid)
  );

ALTER TABLE
  DROPDOWN_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DROPDOWN_QUESTION_OPTION_TABLE (
    optionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL,
    optiontext VARCHAR(255) NOT NULL,
    FOREIGN KEY (questionid) REFERENCES DROPDOWN_QUESTION_TABLE (questionid)
  );

ALTER TABLE
  DROPDOWN_QUESTION_OPTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  PDF_UPLOAD_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxfilesizeinmb DECIMAL NOT NULL
  );

ALTER TABLE
  PDF_UPLOAD_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  IMAGE_UPLOAD_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxfilesizeinmb DECIMAL NOT NULL,
    allowedfiletypes TEXT NOT NULL
  );

ALTER TABLE
  IMAGE_UPLOAD_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  SHORT_TEXT_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    answertext VARCHAR(255) NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  SHORT_TEXT_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  LONG_TEXT_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    answertext TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  LONG_TEXT_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  MULTIPLE_CHOICE_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    selectedchoice TEXT NOT NULL, -- This will store a JSON array
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  MULTIPLE_CHOICE_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  VIDEO_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    videourl VARCHAR(255) NOT NULL, -- change to Videoupload later on
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  VIDEO_UPLOAD_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  IMAGE_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    imageurl VARCHAR(255) NOT NULL, -- change to Image Upload later on
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  IMAGE_UPLOAD_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  PDF_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pdfurl VARCHAR(255) NOT NULL, -- change to PDF Upload later on
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  PDF_UPLOAD_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DATE_PICKER_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pickeddate DATE NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  DATE_PICKER_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DATETIME_PICKER_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pickeddatetime TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  DATETIME_PICKER_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  NUMBER_PICKER_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pickednumber INT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  NUMBER_PICKER_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  DROPDOWN_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    selectedoptions TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  DROPDOWN_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;
