-- Enable the UUID extension
CREATE EXTENSION
  IF NOT EXISTS "uuid-ossp";

CREATE TABLE
  APPLICATION_TABLE (
    applicationid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    userid UUID NOT NULL REFERENCES auth.users (id) on delete cascade
  );

ALTER TABLE
  APPLICATION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  PHASE_TABLE (
    phaseid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    phasename TEXT NOT NULL,
    phaselabel TEXT NOT NULL,
    phaseorder INT NOT NULL,
    startdate TIMESTAMPTZ NOT NULL,
    enddate TIMESTAMPTZ NOT NULL,
    sectionsenabled BOOLEAN NOT NULL,
    finished_evaluation TIMESTAMPTZ
  );

ALTER TABLE
  PHASE_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  SECTIONS_TABLE (
    sectionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    sectionname TEXT NOT NULL,
    sectiondescription TEXT NOT NULL,
    sectionorder INT NOT NULL,
    phaseid UUID NOT NULL REFERENCES PHASE_TABLE (phaseid)
  );

ALTER TABLE
  SECTIONS_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questiontype TEXT NOT NULL,
    questionorder INT NOT NULL,
    phaseid UUID NOT NULL REFERENCES PHASE_TABLE (phaseid),
    mandatory BOOLEAN NOT NULL,
    questiontext TEXT NOT NULL,
    questionnote TEXT,
    preinformationbox TEXT,
    postinformationbox TEXT,
    depends_on UUID,
    sectionid UUID REFERENCES SECTIONS_TABLE (sectionid)
  );

ALTER TABLE
  QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  ANSWER_TABLE (
    answerid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL REFERENCES QUESTION_TABLE (questionid) on delete cascade,
    applicationid UUID NOT NULL REFERENCES APPLICATION_TABLE (applicationid) on delete cascade,
    created TIMESTAMPTZ NOT NULL,
    lastUpdated TIMESTAMPTZ NOT NULL
  );

ALTER TABLE
  ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  SHORT_TEXT_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxtextlength INT NOT NULL,
    formattingregex TEXT,
    formattingdescription TEXT
  );

ALTER TABLE
  SHORT_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  LONG_TEXT_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid),
    maxtextlength INT NOT NULL
  );

ALTER TABLE
  LONG_TEXT_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  CHECKBOX_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid)
  );

ALTER TABLE
  CHECKBOX_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  MULTIPLE_CHOICE_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    minanswers INT NOT NULL,
    maxanswers INT NOT NULL,
    userinput BOOLEAN NOT NULL,
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid)
  );

ALTER TABLE
  MULTIPLE_CHOICE_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE (
    choiceid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL,
    choicetext TEXT NOT NULL,
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
    optiontext TEXT NOT NULL,
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
    maxfilesizeinmb DECIMAL NOT NULL
  );

ALTER TABLE
  IMAGE_UPLOAD_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

ALTER TABLE
  QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  CONDITIONAL_QUESTION_TABLE (
    questionid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    FOREIGN KEY (questionid) REFERENCES QUESTION_TABLE (questionid)
  );

ALTER TABLE
  CONDITIONAL_QUESTION_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  CONDITIONAL_QUESTION_CHOICE_TABLE (
    choiceid UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    questionid UUID NOT NULL,
    choicevalue TEXT NOT NULL,
    FOREIGN KEY (questionid) REFERENCES CONDITIONAL_QUESTION_TABLE (questionid)
  );

ALTER TABLE
  CONDITIONAL_QUESTION_CHOICE_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  SHORT_TEXT_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    answertext TEXT NOT NULL,
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
  CONDITIONAL_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    selectedchoice TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  CONDITIONAL_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  CHECKBOX_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    checked BOOLEAN NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  CHECKBOX_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  VIDEO_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    videoname TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  VIDEO_UPLOAD_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  IMAGE_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    imagename TEXT NOT NULL,
    FOREIGN KEY (answerid) REFERENCES ANSWER_TABLE (answerid) ON DELETE CASCADE
  );

ALTER TABLE
  IMAGE_UPLOAD_ANSWER_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE
  PDF_UPLOAD_ANSWER_TABLE (
    answerid UUID PRIMARY KEY,
    pdfname TEXT NOT NULL,
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



-- Roles Management
CREATE TABLE USER_ROLES_TABLE (
    userroleid SERIAL PRIMARY KEY,
    userrolename VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO USER_ROLES_TABLE (userrolename) VALUES ('applicant'), ('reviewer'), ('admin');

ALTER TABLE
  USER_ROLES_TABLE ENABLE ROW LEVEL SECURITY;

create table PUBLIC.USER_PROFILES_TABLE (
  userid uuid not null references auth.users on delete cascade,
  userrole INT  not null,
  isactive BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (userid)
);

alter table PUBLIC.USER_PROFILES_TABLE enable row level security;


CREATE TABLE PHASE_OUTCOME_TABLE (
    outcome_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_id UUID NOT NULL REFERENCES PHASE_TABLE (phaseid),
    user_id UUID NOT NULL REFERENCES USER_PROFILES_TABLE (userid) on delete cascade,
    outcome BOOLEAN NOT NULL, -- TRUE for pass, FALSE for fail
    reviewed_by UUID NOT NULL REFERENCES USER_PROFILES_TABLE (userid) on delete restrict, -- Admin who reviewed
    review_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE PHASE_OUTCOME_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE PHASE_ASSIGNMENT_TABLE (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase_id UUID NOT NULL REFERENCES PHASE_TABLE (phaseid),
    user_role_1_id UUID NOT NULL, --applicant
    user_role_2_id UUID NOT NULL, --reviewer
    FOREIGN KEY (user_role_1_id) REFERENCES USER_PROFILES_TABLE (userid) ON DELETE CASCADE,
    FOREIGN KEY (user_role_2_id) REFERENCES USER_PROFILES_TABLE (userid) ON DELETE CASCADE,
    CHECK (user_role_1_id != user_role_2_id)
);

ALTER TABLE PHASE_ASSIGNMENT_TABLE ENABLE ROW LEVEL SECURITY;

CREATE TABLE APPLICATION_LABELS_TABLE (
    labelid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "order" INT UNIQUE NOT NULL,
    questionid UUID UNIQUE NOT NULL,
    FOREIGN KEY (questionid) REFERENCES question_table (questionid) ON DELETE CASCADE
);

ALTER TABLE APPLICATION_LABELS_TABLE ENABLE ROW LEVEL SECURITY;

-- RLS SELECT POLICIES
CREATE POLICY select_policy ON PHASE_TABLE
  FOR SELECT USING (true);

CREATE POLICY select_policy ON APPLICATION_LABELS_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON SECTIONS_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON SHORT_TEXT_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON LONG_TEXT_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON MULTIPLE_CHOICE_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON VIDEO_UPLOAD_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON DATE_PICKER_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON DATETIME_PICKER_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON NUMBER_PICKER_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON DROPDOWN_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON DROPDOWN_QUESTION_OPTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON PDF_UPLOAD_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON IMAGE_UPLOAD_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_policy ON USER_ROLES_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY select_profile ON public.user_profiles_table 
  FOR SELECT USING (userid = auth.uid());

CREATE POLICY insert_profile ON user_profiles_table FOR INSERT
  WITH CHECK (userid = auth.uid());

CREATE POLICY update_profile ON user_profiles_table FOR UPDATE
  WITH CHECK (userid = auth.uid());

CREATE POLICY delete_profile ON public.user_profiles_table 
  FOR DELETE USING (userid = auth.uid());

CREATE POLICY select_application ON application_table FOR SELECT
  USING (userid = auth.uid());

CREATE POLICY insert_application ON application_table FOR INSERT
  WITH CHECK (userid = auth.uid());

CREATE POLICY update_application ON application_table FOR UPDATE
  WITH CHECK (userid = auth.uid());

CREATE POLICY delete_application ON application_table FOR DELETE
  USING (userid = auth.uid());

CREATE POLICY insert_answer ON public.answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.application_table
    WHERE application_table.applicationid = answer_table.applicationid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_answer ON public.answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.application_table
    WHERE application_table.applicationid = answer_table.applicationid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_answer ON public.answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.application_table
    WHERE application_table.applicationid = answer_table.applicationid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_answer ON public.answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.application_table
    WHERE application_table.applicationid = answer_table.applicationid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY insert_short_text_answer ON short_text_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = short_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_short_text_answer ON short_text_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = short_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_short_text_answer ON short_text_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = short_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_short_text_answer ON short_text_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = short_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY insert_long_text_answer ON long_text_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = long_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY select_long_text_answer ON long_text_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = long_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_long_text_answer ON long_text_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = long_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_long_text_answer ON long_text_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = long_text_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY insert_date_picker_answer ON date_picker_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = date_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_date_picker_answer ON date_picker_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = date_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_date_picker_answer ON date_picker_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = date_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_date_picker_answer ON date_picker_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = date_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_datetime_picker_answer ON datetime_picker_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = datetime_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_datetime_picker_answer ON datetime_picker_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = datetime_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_datetime_picker_answer ON datetime_picker_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = datetime_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_datetime_picker_answer ON datetime_picker_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = datetime_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_number_picker_answer ON number_picker_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = number_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_number_picker_answer ON number_picker_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = number_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_number_picker_answer ON number_picker_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = number_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_number_picker_answer ON number_picker_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = number_picker_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_multiple_choice_answer ON multiple_choice_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = multiple_choice_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_multiple_choice_answer ON multiple_choice_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = multiple_choice_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_multiple_choice_answer ON multiple_choice_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = multiple_choice_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_multiple_choice_answer ON multiple_choice_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = multiple_choice_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_dropdown_answer ON dropdown_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = dropdown_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_dropdown_answer ON dropdown_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = dropdown_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_dropdown_answer ON dropdown_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = dropdown_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_dropdown_answer ON dropdown_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = dropdown_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY insert_pdf_upload_answer ON pdf_upload_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = pdf_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_pdf_upload_answer ON pdf_upload_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = pdf_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_pdf_upload_answer ON pdf_upload_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = pdf_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_pdf_upload_answer ON pdf_upload_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = pdf_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_video_upload_answer ON video_upload_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = video_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_video_upload_answer ON video_upload_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = video_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_video_upload_answer ON video_upload_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = video_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_video_upload_answer ON video_upload_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = video_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY insert_image_upload_answer ON image_upload_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = image_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY select_image_upload_answer ON image_upload_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = image_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_image_upload_answer ON image_upload_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = image_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_image_upload_answer ON image_upload_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = image_upload_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

-- Policy for APPLICATION_TABLE
CREATE POLICY select_reviewer_application_table
ON APPLICATION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for DATETIME_PICKER_QUESTION_TABLE
CREATE POLICY select_reviewer_datetime_picker_question_table
ON DATETIME_PICKER_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for DATE_PICKER_QUESTION_TABLE
CREATE POLICY select_reviewer_date_picker_question_table
ON DATE_PICKER_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for DROPDOWN_QUESTION_OPTION_TABLE
CREATE POLICY select_reviewer_dropdown_question_option_table
ON DROPDOWN_QUESTION_OPTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for DROPDOWN_QUESTION_TABLE
CREATE POLICY select_reviewer_dropdown_question_table
ON DROPDOWN_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for IMAGE_UPLOAD_QUESTION_TABLE
CREATE POLICY select_reviewer_image_upload_question_table
ON IMAGE_UPLOAD_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for LONG_TEXT_QUESTION_TABLE
CREATE POLICY select_reviewer_long_text_question_table
ON LONG_TEXT_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
CREATE POLICY select_reviewer_multiple_choice_question_choice_table
ON MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for MULTIPLE_CHOICE_QUESTION_TABLE
CREATE POLICY select_reviewer_multiple_choice_question_table
ON MULTIPLE_CHOICE_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for NUMBER_PICKER_QUESTION_TABLE
CREATE POLICY select_reviewer_number_picker_question_table
ON NUMBER_PICKER_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for PDF_UPLOAD_QUESTION_TABLE
CREATE POLICY select_reviewer_pdf_upload_question_table
ON PDF_UPLOAD_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for QUESTION_TABLE
CREATE POLICY select_reviewer_question_table
ON QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for SHORT_TEXT_QUESTION_TABLE
CREATE POLICY select_reviewer_short_text_question_table
ON SHORT_TEXT_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);


-- Policy for USER_ROLES_TABLE
CREATE POLICY select_reviewer_user_roles_table
ON USER_ROLES_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);



-- Policy for VIDEO_UPLOAD_QUESTION_TABLE
CREATE POLICY select_reviewer_video_upload_question_table
ON VIDEO_UPLOAD_QUESTION_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);

CREATE POLICY select_reviewer_answer_table
ON ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN QUESTION_TABLE as qt ON ANSWER_TABLE.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        JOIN APPLICATION_TABLE as at ON ANSWER_TABLE.applicationid = at.applicationid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.userid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);


CREATE POLICY select_reviewer_DATETIME_PICKER_ANSWER_TABLE
ON DATETIME_PICKER_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON DATETIME_PICKER_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_DATE_PICKER_ANSWER_TABLE
ON DATE_PICKER_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON DATE_PICKER_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_DROPDOWN_ANSWER_TABLE
ON DROPDOWN_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON DROPDOWN_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_IMAGE_UPLOAD_ANSWER_TABLE
ON IMAGE_UPLOAD_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON IMAGE_UPLOAD_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_LONG_TEXT_ANSWER_TABLE
ON LONG_TEXT_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON LONG_TEXT_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_MULTIPLE_CHOICE_ANSWER_TABLE
ON MULTIPLE_CHOICE_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON MULTIPLE_CHOICE_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_NUMBER_PICKER_ANSWER_TABLE
ON NUMBER_PICKER_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON NUMBER_PICKER_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_PDF_UPLOAD_ANSWER_TABLE
ON PDF_UPLOAD_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON PDF_UPLOAD_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_SHORT_TEXT_ANSWER_TABLE
ON SHORT_TEXT_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON SHORT_TEXT_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);



CREATE POLICY select_reviewer_VIDEO_UPLOAD_ANSWER_TABLE
ON VIDEO_UPLOAD_ANSWER_TABLE
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE as up
        JOIN PHASE_ASSIGNMENT_TABLE as pat ON up.userid = pat.user_role_2_id
        JOIN ANSWER_TABLE as at ON VIDEO_UPLOAD_ANSWER_TABLE.answerid = at.answerid
        JOIN QUESTION_TABLE as qt ON at.questionid = qt.questionid
        JOIN PHASE_TABLE as pt ON qt.phaseid = pt.phaseid
        WHERE up.userid = auth.uid() 
          AND up.userrole = 2 
          AND pt.phaseid = pat.phase_id 
          AND EXISTS (
              SELECT 1
              FROM PUBLIC.USER_PROFILES_TABLE as up1
              WHERE up1.userid = at.applicationid 
                AND up1.userrole = 1
                AND pat.user_role_1_id = up1.userid
          )
    )
);


-- Policy for ANSWER_TABLE
CREATE POLICY admin_cmd_answer_table
ON ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for APPLICATION_TABLE
CREATE POLICY admin_cmd_application_table
ON APPLICATION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for DATETIME_PICKER_ANSWER_TABLE
CREATE POLICY admin_cmd_datetime_picker_answer_table
ON DATETIME_PICKER_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for DATETIME_PICKER_QUESTION_TABLE
CREATE POLICY admin_cmd_datetime_picker_question_table
ON DATETIME_PICKER_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for DATE_PICKER_ANSWER_TABLE
CREATE POLICY admin_cmd_date_picker_answer_table
ON DATE_PICKER_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for DATE_PICKER_QUESTION_TABLE
CREATE POLICY admin_cmd_date_picker_question_table
ON DATE_PICKER_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for DROPDOWN_ANSWER_TABLE
CREATE POLICY admin_cmd_dropdown_answer_table
ON DROPDOWN_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for DROPDOWN_QUESTION_OPTION_TABLE
CREATE POLICY admin_cmd_dropdown_question_option_table
ON DROPDOWN_QUESTION_OPTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for DROPDOWN_QUESTION_TABLE
CREATE POLICY admin_cmd_dropdown_question_table
ON DROPDOWN_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for IMAGE_UPLOAD_ANSWER_TABLE
CREATE POLICY admin_cmd_image_upload_answer_table
ON IMAGE_UPLOAD_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for IMAGE_UPLOAD_QUESTION_TABLE
CREATE POLICY admin_cmd_image_upload_question_table
ON IMAGE_UPLOAD_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for LONG_TEXT_ANSWER_TABLE
CREATE POLICY admin_cmd_long_text_answer_table
ON LONG_TEXT_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for LONG_TEXT_QUESTION_TABLE
CREATE POLICY admin_cmd_long_text_question_table
ON LONG_TEXT_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for MULTIPLE_CHOICE_ANSWER_TABLE
CREATE POLICY admin_cmd_multiple_choice_answer_table
ON MULTIPLE_CHOICE_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
CREATE POLICY admin_cmd_multiple_choice_question_choice_table
ON MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for MULTIPLE_CHOICE_QUESTION_TABLE
CREATE POLICY admin_cmd_multiple_choice_question_table
ON MULTIPLE_CHOICE_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for NUMBER_PICKER_ANSWER_TABLE
CREATE POLICY admin_cmd_number_picker_answer_table
ON NUMBER_PICKER_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for NUMBER_PICKER_QUESTION_TABLE
CREATE POLICY admin_cmd_number_picker_question_table
ON NUMBER_PICKER_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for PDF_UPLOAD_ANSWER_TABLE
CREATE POLICY admin_cmd_pdf_upload_answer_table
ON PDF_UPLOAD_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for PDF_UPLOAD_QUESTION_TABLE
CREATE POLICY admin_cmd_pdf_upload_question_table
ON PDF_UPLOAD_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for PHASE_TABLE
CREATE POLICY admin_cmd_phase_table
ON PHASE_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for QUESTION_TABLE
CREATE POLICY admin_cmd_question_table
ON QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for SHORT_TEXT_ANSWER_TABLE
CREATE POLICY admin_cmd_short_text_answer_table
ON SHORT_TEXT_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for SHORT_TEXT_QUESTION_TABLE
CREATE POLICY admin_cmd_short_text_question_table
ON SHORT_TEXT_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);


-- Policy for USER_ROLES_TABLE
CREATE POLICY admin_cmd_user_roles_table
ON USER_ROLES_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for VIDEO_UPLOAD_ANSWER_TABLE
CREATE POLICY admin_cmd_video_upload_answer_table
ON VIDEO_UPLOAD_ANSWER_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);



-- Policy for VIDEO_UPLOAD_QUESTION_TABLE
CREATE POLICY admin_cmd_video_upload_question_table
ON VIDEO_UPLOAD_QUESTION_TABLE
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);

CREATE POLICY select_policy ON CHECKBOX_QUESTION_TABLE
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY insert_checkbox_answer ON checkbox_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = checkbox_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY select_checkbox_answer ON checkbox_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = checkbox_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_checkbox_answer ON checkbox_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = checkbox_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_checkbox_answer ON checkbox_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = checkbox_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY select_policy ON conditional_question_choice_table
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policy for MULTIPLE_CHOICE_QUESTION_CHOICE_TABLE
CREATE POLICY select_reviewer_conditional_question_choice_table
ON conditional_question_choice_table
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 2
    )
);

CREATE POLICY conditional_question_choice_table
ON conditional_question_choice_table
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM PUBLIC.USER_PROFILES_TABLE
        WHERE USER_PROFILES_TABLE.userid = auth.uid() AND USER_PROFILES_TABLE.userrole = 3
    )
);

CREATE POLICY insert_conditional_answer ON conditional_answer_table
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = conditional_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);


CREATE POLICY select_conditional_answer ON conditional_answer_table
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = conditional_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY update_conditional_answer ON conditional_answer_table
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = conditional_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);

CREATE POLICY delete_conditional_answer ON conditional_answer_table
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.answer_table
    INNER JOIN public.application_table ON application_table.applicationid = answer_table.applicationid
    WHERE answer_table.answerid = conditional_answer_table.answerid
    AND application_table.userid = auth.uid()
  )
);