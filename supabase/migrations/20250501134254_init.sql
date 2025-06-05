create sequence "public"."user_roles_table_userroleid_seq";

create table "public"."answer_table" (
    "answerid" uuid not null default uuid_generate_v4(),
    "questionid" uuid not null,
    "applicationid" uuid not null,
    "created" timestamp with time zone not null,
    "lastupdated" timestamp with time zone not null
);


alter table "public"."answer_table" enable row level security;

create table "public"."application_table" (
    "applicationid" uuid not null default uuid_generate_v4(),
    "userid" uuid not null
);


alter table "public"."application_table" enable row level security;

create table "public"."checkbox_answer_table" (
    "answerid" uuid not null,
    "checked" boolean not null
);


alter table "public"."checkbox_answer_table" enable row level security;

create table "public"."checkbox_question_table" (
    "questionid" uuid not null default uuid_generate_v4()
);


alter table "public"."checkbox_question_table" enable row level security;

create table "public"."conditional_answer_table" (
    "answerid" uuid not null,
    "selectedchoice" text not null
);


alter table "public"."conditional_answer_table" enable row level security;

create table "public"."conditional_question_choice_table" (
    "choiceid" uuid not null default uuid_generate_v4(),
    "questionid" uuid not null,
    "choicevalue" text not null
);


alter table "public"."conditional_question_choice_table" enable row level security;

create table "public"."conditional_question_table" (
    "questionid" uuid not null default uuid_generate_v4()
);


alter table "public"."conditional_question_table" enable row level security;

create table "public"."date_picker_answer_table" (
    "answerid" uuid not null,
    "pickeddate" date not null
);


alter table "public"."date_picker_answer_table" enable row level security;

create table "public"."date_picker_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "mindate" date not null,
    "maxdate" date not null
);


alter table "public"."date_picker_question_table" enable row level security;

create table "public"."datetime_picker_answer_table" (
    "answerid" uuid not null,
    "pickeddatetime" timestamp with time zone not null
);


alter table "public"."datetime_picker_answer_table" enable row level security;

create table "public"."datetime_picker_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "mindatetime" timestamp with time zone not null,
    "maxdatetime" timestamp with time zone not null
);


alter table "public"."datetime_picker_question_table" enable row level security;

create table "public"."dropdown_answer_table" (
    "answerid" uuid not null,
    "selectedoptions" text not null
);


alter table "public"."dropdown_answer_table" enable row level security;

create table "public"."dropdown_question_option_table" (
    "optionid" uuid not null default uuid_generate_v4(),
    "questionid" uuid not null,
    "optiontext" text not null
);


alter table "public"."dropdown_question_option_table" enable row level security;

create table "public"."dropdown_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "minanswers" integer not null,
    "maxanswers" integer not null,
    "userinput" boolean not null
);


alter table "public"."dropdown_question_table" enable row level security;

create table "public"."image_upload_answer_table" (
    "answerid" uuid not null,
    "imagename" text not null
);


alter table "public"."image_upload_answer_table" enable row level security;

create table "public"."image_upload_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "maxfilesizeinmb" numeric not null
);


alter table "public"."image_upload_question_table" enable row level security;

create table "public"."long_text_answer_table" (
    "answerid" uuid not null,
    "answertext" text not null
);


alter table "public"."long_text_answer_table" enable row level security;

create table "public"."long_text_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "maxtextlength" integer not null
);


alter table "public"."long_text_question_table" enable row level security;

create table "public"."multiple_choice_answer_table" (
    "answerid" uuid not null,
    "selectedchoice" text not null
);


alter table "public"."multiple_choice_answer_table" enable row level security;

create table "public"."multiple_choice_question_choice_table" (
    "choiceid" uuid not null default uuid_generate_v4(),
    "questionid" uuid not null,
    "choicetext" text not null
);


alter table "public"."multiple_choice_question_choice_table" enable row level security;

create table "public"."multiple_choice_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "minanswers" integer not null,
    "maxanswers" integer not null,
    "userinput" boolean not null
);


alter table "public"."multiple_choice_question_table" enable row level security;

create table "public"."number_picker_answer_table" (
    "answerid" uuid not null,
    "pickednumber" integer not null
);


alter table "public"."number_picker_answer_table" enable row level security;

create table "public"."number_picker_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "minnumber" integer not null,
    "maxnumber" integer not null
);


alter table "public"."number_picker_question_table" enable row level security;

create table "public"."pdf_upload_answer_table" (
    "answerid" uuid not null,
    "pdfname" text not null
);


alter table "public"."pdf_upload_answer_table" enable row level security;

create table "public"."pdf_upload_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "maxfilesizeinmb" numeric not null
);


alter table "public"."pdf_upload_question_table" enable row level security;

create table "public"."phase_assignment_table" (
    "assignment_id" uuid not null default uuid_generate_v4(),
    "phase_id" uuid not null,
    "user_role_1_id" uuid not null,
    "user_role_2_id" uuid not null
);


alter table "public"."phase_assignment_table" enable row level security;

create table "public"."phase_outcome_table" (
    "outcome_id" uuid not null default uuid_generate_v4(),
    "phase_id" uuid not null,
    "user_id" uuid not null,
    "outcome" boolean not null,
    "reviewed_by" uuid not null,
    "review_date" timestamp with time zone not null default now()
);


alter table "public"."phase_outcome_table" enable row level security;

create table "public"."phase_table" (
    "phaseid" uuid not null default uuid_generate_v4(),
    "phasename" text not null,
    "phaselabel" text not null,
    "phaseorder" integer not null,
    "startdate" timestamp with time zone not null,
    "enddate" timestamp with time zone not null,
    "sectionsenabled" boolean not null,
    "finished_evaluation" timestamp with time zone
);


alter table "public"."phase_table" enable row level security;

create table "public"."question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "questiontype" text not null,
    "questionorder" integer not null,
    "phaseid" uuid not null,
    "mandatory" boolean not null,
    "questiontext" text not null,
    "questionnote" text,
    "preinformationbox" text,
    "postinformationbox" text,
    "depends_on" uuid,
    "sectionid" uuid
);


alter table "public"."question_table" enable row level security;

create table "public"."sections_table" (
    "sectionid" uuid not null default uuid_generate_v4(),
    "sectionname" text not null,
    "sectiondescription" text not null,
    "sectionorder" integer not null,
    "phaseid" uuid not null
);


alter table "public"."sections_table" enable row level security;

create table "public"."short_text_answer_table" (
    "answerid" uuid not null,
    "answertext" text not null
);


alter table "public"."short_text_answer_table" enable row level security;

create table "public"."short_text_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "maxtextlength" integer not null,
    "formattingregex" text,
    "formattingdescription" text
);


alter table "public"."short_text_question_table" enable row level security;

create table "public"."user_profiles_table" (
    "userid" uuid not null,
    "userrole" integer not null,
    "isactive" boolean default true
);


alter table "public"."user_profiles_table" enable row level security;

create table "public"."user_roles_table" (
    "userroleid" integer not null default nextval('user_roles_table_userroleid_seq'::regclass),
    "userrolename" character varying(50) not null
);


alter table "public"."user_roles_table" enable row level security;

create table "public"."video_upload_answer_table" (
    "answerid" uuid not null,
    "videoname" text not null
);


alter table "public"."video_upload_answer_table" enable row level security;

create table "public"."video_upload_question_table" (
    "questionid" uuid not null default uuid_generate_v4(),
    "maxfilesizeinmb" numeric not null
);


alter table "public"."video_upload_question_table" enable row level security;

alter sequence "public"."user_roles_table_userroleid_seq" owned by "public"."user_roles_table"."userroleid";

CREATE UNIQUE INDEX answer_table_pkey ON public.answer_table USING btree (answerid);

CREATE UNIQUE INDEX application_table_pkey ON public.application_table USING btree (applicationid);

CREATE UNIQUE INDEX checkbox_answer_table_pkey ON public.checkbox_answer_table USING btree (answerid);

CREATE UNIQUE INDEX checkbox_question_table_pkey ON public.checkbox_question_table USING btree (questionid);

CREATE UNIQUE INDEX conditional_answer_table_pkey ON public.conditional_answer_table USING btree (answerid);

CREATE UNIQUE INDEX conditional_question_choice_table_pkey ON public.conditional_question_choice_table USING btree (choiceid);

CREATE UNIQUE INDEX conditional_question_table_pkey ON public.conditional_question_table USING btree (questionid);

CREATE UNIQUE INDEX date_picker_answer_table_pkey ON public.date_picker_answer_table USING btree (answerid);

CREATE UNIQUE INDEX date_picker_question_table_pkey ON public.date_picker_question_table USING btree (questionid);

CREATE UNIQUE INDEX datetime_picker_answer_table_pkey ON public.datetime_picker_answer_table USING btree (answerid);

CREATE UNIQUE INDEX datetime_picker_question_table_pkey ON public.datetime_picker_question_table USING btree (questionid);

CREATE UNIQUE INDEX dropdown_answer_table_pkey ON public.dropdown_answer_table USING btree (answerid);

CREATE UNIQUE INDEX dropdown_question_option_table_pkey ON public.dropdown_question_option_table USING btree (optionid);

CREATE UNIQUE INDEX dropdown_question_table_pkey ON public.dropdown_question_table USING btree (questionid);

CREATE UNIQUE INDEX image_upload_answer_table_pkey ON public.image_upload_answer_table USING btree (answerid);

CREATE UNIQUE INDEX image_upload_question_table_pkey ON public.image_upload_question_table USING btree (questionid);

CREATE UNIQUE INDEX long_text_answer_table_pkey ON public.long_text_answer_table USING btree (answerid);

CREATE UNIQUE INDEX long_text_question_table_pkey ON public.long_text_question_table USING btree (questionid);

CREATE UNIQUE INDEX multiple_choice_answer_table_pkey ON public.multiple_choice_answer_table USING btree (answerid);

CREATE UNIQUE INDEX multiple_choice_question_choice_table_pkey ON public.multiple_choice_question_choice_table USING btree (choiceid);

CREATE UNIQUE INDEX multiple_choice_question_table_pkey ON public.multiple_choice_question_table USING btree (questionid);

CREATE UNIQUE INDEX number_picker_answer_table_pkey ON public.number_picker_answer_table USING btree (answerid);

CREATE UNIQUE INDEX number_picker_question_table_pkey ON public.number_picker_question_table USING btree (questionid);

CREATE UNIQUE INDEX pdf_upload_answer_table_pkey ON public.pdf_upload_answer_table USING btree (answerid);

CREATE UNIQUE INDEX pdf_upload_question_table_pkey ON public.pdf_upload_question_table USING btree (questionid);

CREATE UNIQUE INDEX phase_assignment_table_pkey ON public.phase_assignment_table USING btree (assignment_id);

CREATE UNIQUE INDEX phase_outcome_table_pkey ON public.phase_outcome_table USING btree (outcome_id);

CREATE UNIQUE INDEX phase_table_pkey ON public.phase_table USING btree (phaseid);

CREATE UNIQUE INDEX question_table_pkey ON public.question_table USING btree (questionid);

CREATE UNIQUE INDEX sections_table_pkey ON public.sections_table USING btree (sectionid);

CREATE UNIQUE INDEX short_text_answer_table_pkey ON public.short_text_answer_table USING btree (answerid);

CREATE UNIQUE INDEX short_text_question_table_pkey ON public.short_text_question_table USING btree (questionid);

CREATE UNIQUE INDEX user_profiles_table_pkey ON public.user_profiles_table USING btree (userid);

CREATE UNIQUE INDEX user_roles_table_pkey ON public.user_roles_table USING btree (userroleid);

CREATE UNIQUE INDEX user_roles_table_userrolename_key ON public.user_roles_table USING btree (userrolename);

CREATE UNIQUE INDEX video_upload_answer_table_pkey ON public.video_upload_answer_table USING btree (answerid);

CREATE UNIQUE INDEX video_upload_question_table_pkey ON public.video_upload_question_table USING btree (questionid);

alter table "public"."answer_table" add constraint "answer_table_pkey" PRIMARY KEY using index "answer_table_pkey";

alter table "public"."application_table" add constraint "application_table_pkey" PRIMARY KEY using index "application_table_pkey";

alter table "public"."checkbox_answer_table" add constraint "checkbox_answer_table_pkey" PRIMARY KEY using index "checkbox_answer_table_pkey";

alter table "public"."checkbox_question_table" add constraint "checkbox_question_table_pkey" PRIMARY KEY using index "checkbox_question_table_pkey";

alter table "public"."conditional_answer_table" add constraint "conditional_answer_table_pkey" PRIMARY KEY using index "conditional_answer_table_pkey";

alter table "public"."conditional_question_choice_table" add constraint "conditional_question_choice_table_pkey" PRIMARY KEY using index "conditional_question_choice_table_pkey";

alter table "public"."conditional_question_table" add constraint "conditional_question_table_pkey" PRIMARY KEY using index "conditional_question_table_pkey";

alter table "public"."date_picker_answer_table" add constraint "date_picker_answer_table_pkey" PRIMARY KEY using index "date_picker_answer_table_pkey";

alter table "public"."date_picker_question_table" add constraint "date_picker_question_table_pkey" PRIMARY KEY using index "date_picker_question_table_pkey";

alter table "public"."datetime_picker_answer_table" add constraint "datetime_picker_answer_table_pkey" PRIMARY KEY using index "datetime_picker_answer_table_pkey";

alter table "public"."datetime_picker_question_table" add constraint "datetime_picker_question_table_pkey" PRIMARY KEY using index "datetime_picker_question_table_pkey";

alter table "public"."dropdown_answer_table" add constraint "dropdown_answer_table_pkey" PRIMARY KEY using index "dropdown_answer_table_pkey";

alter table "public"."dropdown_question_option_table" add constraint "dropdown_question_option_table_pkey" PRIMARY KEY using index "dropdown_question_option_table_pkey";

alter table "public"."dropdown_question_table" add constraint "dropdown_question_table_pkey" PRIMARY KEY using index "dropdown_question_table_pkey";

alter table "public"."image_upload_answer_table" add constraint "image_upload_answer_table_pkey" PRIMARY KEY using index "image_upload_answer_table_pkey";

alter table "public"."image_upload_question_table" add constraint "image_upload_question_table_pkey" PRIMARY KEY using index "image_upload_question_table_pkey";

alter table "public"."long_text_answer_table" add constraint "long_text_answer_table_pkey" PRIMARY KEY using index "long_text_answer_table_pkey";

alter table "public"."long_text_question_table" add constraint "long_text_question_table_pkey" PRIMARY KEY using index "long_text_question_table_pkey";

alter table "public"."multiple_choice_answer_table" add constraint "multiple_choice_answer_table_pkey" PRIMARY KEY using index "multiple_choice_answer_table_pkey";

alter table "public"."multiple_choice_question_choice_table" add constraint "multiple_choice_question_choice_table_pkey" PRIMARY KEY using index "multiple_choice_question_choice_table_pkey";

alter table "public"."multiple_choice_question_table" add constraint "multiple_choice_question_table_pkey" PRIMARY KEY using index "multiple_choice_question_table_pkey";

alter table "public"."number_picker_answer_table" add constraint "number_picker_answer_table_pkey" PRIMARY KEY using index "number_picker_answer_table_pkey";

alter table "public"."number_picker_question_table" add constraint "number_picker_question_table_pkey" PRIMARY KEY using index "number_picker_question_table_pkey";

alter table "public"."pdf_upload_answer_table" add constraint "pdf_upload_answer_table_pkey" PRIMARY KEY using index "pdf_upload_answer_table_pkey";

alter table "public"."pdf_upload_question_table" add constraint "pdf_upload_question_table_pkey" PRIMARY KEY using index "pdf_upload_question_table_pkey";

alter table "public"."phase_assignment_table" add constraint "phase_assignment_table_pkey" PRIMARY KEY using index "phase_assignment_table_pkey";

alter table "public"."phase_outcome_table" add constraint "phase_outcome_table_pkey" PRIMARY KEY using index "phase_outcome_table_pkey";

alter table "public"."phase_table" add constraint "phase_table_pkey" PRIMARY KEY using index "phase_table_pkey";

alter table "public"."question_table" add constraint "question_table_pkey" PRIMARY KEY using index "question_table_pkey";

alter table "public"."sections_table" add constraint "sections_table_pkey" PRIMARY KEY using index "sections_table_pkey";

alter table "public"."short_text_answer_table" add constraint "short_text_answer_table_pkey" PRIMARY KEY using index "short_text_answer_table_pkey";

alter table "public"."short_text_question_table" add constraint "short_text_question_table_pkey" PRIMARY KEY using index "short_text_question_table_pkey";

alter table "public"."user_profiles_table" add constraint "user_profiles_table_pkey" PRIMARY KEY using index "user_profiles_table_pkey";

alter table "public"."user_roles_table" add constraint "user_roles_table_pkey" PRIMARY KEY using index "user_roles_table_pkey";

alter table "public"."video_upload_answer_table" add constraint "video_upload_answer_table_pkey" PRIMARY KEY using index "video_upload_answer_table_pkey";

alter table "public"."video_upload_question_table" add constraint "video_upload_question_table_pkey" PRIMARY KEY using index "video_upload_question_table_pkey";

alter table "public"."answer_table" add constraint "answer_table_applicationid_fkey" FOREIGN KEY (applicationid) REFERENCES application_table(applicationid) ON DELETE CASCADE not valid;

alter table "public"."answer_table" validate constraint "answer_table_applicationid_fkey";

alter table "public"."answer_table" add constraint "answer_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."answer_table" validate constraint "answer_table_questionid_fkey";

alter table "public"."application_table" add constraint "application_table_userid_fkey" FOREIGN KEY (userid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."application_table" validate constraint "application_table_userid_fkey";

alter table "public"."checkbox_answer_table" add constraint "checkbox_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."checkbox_answer_table" validate constraint "checkbox_answer_table_answerid_fkey";

alter table "public"."checkbox_question_table" add constraint "checkbox_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."checkbox_question_table" validate constraint "checkbox_question_table_questionid_fkey";

alter table "public"."conditional_answer_table" add constraint "conditional_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."conditional_answer_table" validate constraint "conditional_answer_table_answerid_fkey";

alter table "public"."conditional_question_choice_table" add constraint "conditional_question_choice_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES conditional_question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."conditional_question_choice_table" validate constraint "conditional_question_choice_table_questionid_fkey";

alter table "public"."conditional_question_table" add constraint "conditional_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."conditional_question_table" validate constraint "conditional_question_table_questionid_fkey";

alter table "public"."date_picker_answer_table" add constraint "date_picker_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."date_picker_answer_table" validate constraint "date_picker_answer_table_answerid_fkey";

alter table "public"."date_picker_question_table" add constraint "date_picker_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."date_picker_question_table" validate constraint "date_picker_question_table_questionid_fkey";

alter table "public"."datetime_picker_answer_table" add constraint "datetime_picker_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."datetime_picker_answer_table" validate constraint "datetime_picker_answer_table_answerid_fkey";

alter table "public"."datetime_picker_question_table" add constraint "datetime_picker_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."datetime_picker_question_table" validate constraint "datetime_picker_question_table_questionid_fkey";

alter table "public"."dropdown_answer_table" add constraint "dropdown_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."dropdown_answer_table" validate constraint "dropdown_answer_table_answerid_fkey";

alter table "public"."dropdown_question_option_table" add constraint "dropdown_question_option_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES dropdown_question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."dropdown_question_option_table" validate constraint "dropdown_question_option_table_questionid_fkey";

alter table "public"."dropdown_question_table" add constraint "dropdown_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."dropdown_question_table" validate constraint "dropdown_question_table_questionid_fkey";

alter table "public"."image_upload_answer_table" add constraint "image_upload_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."image_upload_answer_table" validate constraint "image_upload_answer_table_answerid_fkey";

alter table "public"."image_upload_question_table" add constraint "image_upload_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."image_upload_question_table" validate constraint "image_upload_question_table_questionid_fkey";

alter table "public"."long_text_answer_table" add constraint "long_text_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."long_text_answer_table" validate constraint "long_text_answer_table_answerid_fkey";

alter table "public"."long_text_question_table" add constraint "long_text_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."long_text_question_table" validate constraint "long_text_question_table_questionid_fkey";

alter table "public"."multiple_choice_answer_table" add constraint "multiple_choice_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."multiple_choice_answer_table" validate constraint "multiple_choice_answer_table_answerid_fkey";

alter table "public"."multiple_choice_question_choice_table" add constraint "multiple_choice_question_choice_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES multiple_choice_question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."multiple_choice_question_choice_table" validate constraint "multiple_choice_question_choice_table_questionid_fkey";

alter table "public"."multiple_choice_question_table" add constraint "multiple_choice_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."multiple_choice_question_table" validate constraint "multiple_choice_question_table_questionid_fkey";

alter table "public"."number_picker_answer_table" add constraint "number_picker_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."number_picker_answer_table" validate constraint "number_picker_answer_table_answerid_fkey";

alter table "public"."number_picker_question_table" add constraint "number_picker_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."number_picker_question_table" validate constraint "number_picker_question_table_questionid_fkey";

alter table "public"."pdf_upload_answer_table" add constraint "pdf_upload_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."pdf_upload_answer_table" validate constraint "pdf_upload_answer_table_answerid_fkey";

alter table "public"."pdf_upload_question_table" add constraint "pdf_upload_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."pdf_upload_question_table" validate constraint "pdf_upload_question_table_questionid_fkey";

alter table "public"."phase_assignment_table" add constraint "phase_assignment_table_check" CHECK ((user_role_1_id <> user_role_2_id)) not valid;

alter table "public"."phase_assignment_table" validate constraint "phase_assignment_table_check";

alter table "public"."phase_assignment_table" add constraint "phase_assignment_table_phase_id_fkey" FOREIGN KEY (phase_id) REFERENCES phase_table(phaseid) not valid;

alter table "public"."phase_assignment_table" validate constraint "phase_assignment_table_phase_id_fkey";

alter table "public"."phase_assignment_table" add constraint "phase_assignment_table_user_role_1_id_fkey" FOREIGN KEY (user_role_1_id) REFERENCES user_profiles_table(userid) not valid;

alter table "public"."phase_assignment_table" validate constraint "phase_assignment_table_user_role_1_id_fkey";

alter table "public"."phase_assignment_table" add constraint "phase_assignment_table_user_role_2_id_fkey" FOREIGN KEY (user_role_2_id) REFERENCES user_profiles_table(userid) not valid;

alter table "public"."phase_assignment_table" validate constraint "phase_assignment_table_user_role_2_id_fkey";

alter table "public"."phase_outcome_table" add constraint "phase_outcome_table_phase_id_fkey" FOREIGN KEY (phase_id) REFERENCES phase_table(phaseid) not valid;

alter table "public"."phase_outcome_table" validate constraint "phase_outcome_table_phase_id_fkey";

alter table "public"."phase_outcome_table" add constraint "phase_outcome_table_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES user_profiles_table(userid) not valid;

alter table "public"."phase_outcome_table" validate constraint "phase_outcome_table_reviewed_by_fkey";

alter table "public"."phase_outcome_table" add constraint "phase_outcome_table_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles_table(userid) not valid;

alter table "public"."phase_outcome_table" validate constraint "phase_outcome_table_user_id_fkey";

alter table "public"."question_table" add constraint "question_table_phaseid_fkey" FOREIGN KEY (phaseid) REFERENCES phase_table(phaseid) ON DELETE CASCADE not valid;

alter table "public"."question_table" validate constraint "question_table_phaseid_fkey";

alter table "public"."question_table" add constraint "question_table_sectionid_fkey" FOREIGN KEY (sectionid) REFERENCES sections_table(sectionid) not valid;

alter table "public"."question_table" validate constraint "question_table_sectionid_fkey";

alter table "public"."sections_table" add constraint "sections_table_phaseid_fkey" FOREIGN KEY (phaseid) REFERENCES phase_table(phaseid) ON DELETE CASCADE not valid;

alter table "public"."sections_table" validate constraint "sections_table_phaseid_fkey";

alter table "public"."short_text_answer_table" add constraint "short_text_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."short_text_answer_table" validate constraint "short_text_answer_table_answerid_fkey";

alter table "public"."short_text_question_table" add constraint "short_text_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."short_text_question_table" validate constraint "short_text_question_table_questionid_fkey";

alter table "public"."user_profiles_table" add constraint "user_profiles_table_userid_fkey" FOREIGN KEY (userid) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_profiles_table" validate constraint "user_profiles_table_userid_fkey";

alter table "public"."user_roles_table" add constraint "user_roles_table_userrolename_key" UNIQUE using index "user_roles_table_userrolename_key";

alter table "public"."video_upload_answer_table" add constraint "video_upload_answer_table_answerid_fkey" FOREIGN KEY (answerid) REFERENCES answer_table(answerid) ON DELETE CASCADE not valid;

alter table "public"."video_upload_answer_table" validate constraint "video_upload_answer_table_answerid_fkey";

alter table "public"."video_upload_question_table" add constraint "video_upload_question_table_questionid_fkey" FOREIGN KEY (questionid) REFERENCES question_table(questionid) ON DELETE CASCADE not valid;

alter table "public"."video_upload_question_table" validate constraint "video_upload_question_table_questionid_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_checkbox_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, checked boolean)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.checked
    FROM CHECKBOX_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_conditional_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, selectedchoice text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedchoice
    FROM CONDITIONAL_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_date_picker_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, pickeddate date)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickeddate
    FROM DATE_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_datetime_picker_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, pickeddatetime timestamp with time zone)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickeddatetime
    FROM DATETIME_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_dropdown_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, selectedoptions text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedoptions
    FROM DROPDOWN_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_image_upload_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, imagename text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.imagename
    FROM IMAGE_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_long_text_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, answertext text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.answertext
    FROM LONG_TEXT_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_multiple_choice_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, selectedchoice text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.selectedchoice
    FROM MULTIPLE_CHOICE_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_number_picker_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, pickednumber integer)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pickednumber
    FROM NUMBER_PICKER_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_pdf_upload_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, pdfname text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.pdfname
    FROM PDF_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_short_text_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, answertext text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.answertext
    FROM SHORT_TEXT_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.fetch_video_upload_answer_table(question_id uuid, user_id uuid)
 RETURNS TABLE(answerid uuid, videoname text)
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
    RETURN QUERY
    SELECT t.answerid, t.videoname
    FROM VIDEO_UPLOAD_ANSWER_TABLE t
    INNER JOIN answer_table a ON t.answerid = a.answerid
    INNER JOIN application_table app ON a.applicationid = app.applicationid
    WHERE a.questionid = question_id AND app.userid = user_id;
END;
$function$
;

grant delete on table "public"."answer_table" to "anon";

grant insert on table "public"."answer_table" to "anon";

grant references on table "public"."answer_table" to "anon";

grant select on table "public"."answer_table" to "anon";

grant trigger on table "public"."answer_table" to "anon";

grant truncate on table "public"."answer_table" to "anon";

grant update on table "public"."answer_table" to "anon";

grant delete on table "public"."answer_table" to "authenticated";

grant insert on table "public"."answer_table" to "authenticated";

grant references on table "public"."answer_table" to "authenticated";

grant select on table "public"."answer_table" to "authenticated";

grant trigger on table "public"."answer_table" to "authenticated";

grant truncate on table "public"."answer_table" to "authenticated";

grant update on table "public"."answer_table" to "authenticated";

grant delete on table "public"."answer_table" to "service_role";

grant insert on table "public"."answer_table" to "service_role";

grant references on table "public"."answer_table" to "service_role";

grant select on table "public"."answer_table" to "service_role";

grant trigger on table "public"."answer_table" to "service_role";

grant truncate on table "public"."answer_table" to "service_role";

grant update on table "public"."answer_table" to "service_role";

grant delete on table "public"."application_table" to "anon";

grant insert on table "public"."application_table" to "anon";

grant references on table "public"."application_table" to "anon";

grant select on table "public"."application_table" to "anon";

grant trigger on table "public"."application_table" to "anon";

grant truncate on table "public"."application_table" to "anon";

grant update on table "public"."application_table" to "anon";

grant delete on table "public"."application_table" to "authenticated";

grant insert on table "public"."application_table" to "authenticated";

grant references on table "public"."application_table" to "authenticated";

grant select on table "public"."application_table" to "authenticated";

grant trigger on table "public"."application_table" to "authenticated";

grant truncate on table "public"."application_table" to "authenticated";

grant update on table "public"."application_table" to "authenticated";

grant delete on table "public"."application_table" to "service_role";

grant insert on table "public"."application_table" to "service_role";

grant references on table "public"."application_table" to "service_role";

grant select on table "public"."application_table" to "service_role";

grant trigger on table "public"."application_table" to "service_role";

grant truncate on table "public"."application_table" to "service_role";

grant update on table "public"."application_table" to "service_role";

grant delete on table "public"."checkbox_answer_table" to "anon";

grant insert on table "public"."checkbox_answer_table" to "anon";

grant references on table "public"."checkbox_answer_table" to "anon";

grant select on table "public"."checkbox_answer_table" to "anon";

grant trigger on table "public"."checkbox_answer_table" to "anon";

grant truncate on table "public"."checkbox_answer_table" to "anon";

grant update on table "public"."checkbox_answer_table" to "anon";

grant delete on table "public"."checkbox_answer_table" to "authenticated";

grant insert on table "public"."checkbox_answer_table" to "authenticated";

grant references on table "public"."checkbox_answer_table" to "authenticated";

grant select on table "public"."checkbox_answer_table" to "authenticated";

grant trigger on table "public"."checkbox_answer_table" to "authenticated";

grant truncate on table "public"."checkbox_answer_table" to "authenticated";

grant update on table "public"."checkbox_answer_table" to "authenticated";

grant delete on table "public"."checkbox_answer_table" to "service_role";

grant insert on table "public"."checkbox_answer_table" to "service_role";

grant references on table "public"."checkbox_answer_table" to "service_role";

grant select on table "public"."checkbox_answer_table" to "service_role";

grant trigger on table "public"."checkbox_answer_table" to "service_role";

grant truncate on table "public"."checkbox_answer_table" to "service_role";

grant update on table "public"."checkbox_answer_table" to "service_role";

grant delete on table "public"."checkbox_question_table" to "anon";

grant insert on table "public"."checkbox_question_table" to "anon";

grant references on table "public"."checkbox_question_table" to "anon";

grant select on table "public"."checkbox_question_table" to "anon";

grant trigger on table "public"."checkbox_question_table" to "anon";

grant truncate on table "public"."checkbox_question_table" to "anon";

grant update on table "public"."checkbox_question_table" to "anon";

grant delete on table "public"."checkbox_question_table" to "authenticated";

grant insert on table "public"."checkbox_question_table" to "authenticated";

grant references on table "public"."checkbox_question_table" to "authenticated";

grant select on table "public"."checkbox_question_table" to "authenticated";

grant trigger on table "public"."checkbox_question_table" to "authenticated";

grant truncate on table "public"."checkbox_question_table" to "authenticated";

grant update on table "public"."checkbox_question_table" to "authenticated";

grant delete on table "public"."checkbox_question_table" to "service_role";

grant insert on table "public"."checkbox_question_table" to "service_role";

grant references on table "public"."checkbox_question_table" to "service_role";

grant select on table "public"."checkbox_question_table" to "service_role";

grant trigger on table "public"."checkbox_question_table" to "service_role";

grant truncate on table "public"."checkbox_question_table" to "service_role";

grant update on table "public"."checkbox_question_table" to "service_role";

grant delete on table "public"."conditional_answer_table" to "anon";

grant insert on table "public"."conditional_answer_table" to "anon";

grant references on table "public"."conditional_answer_table" to "anon";

grant select on table "public"."conditional_answer_table" to "anon";

grant trigger on table "public"."conditional_answer_table" to "anon";

grant truncate on table "public"."conditional_answer_table" to "anon";

grant update on table "public"."conditional_answer_table" to "anon";

grant delete on table "public"."conditional_answer_table" to "authenticated";

grant insert on table "public"."conditional_answer_table" to "authenticated";

grant references on table "public"."conditional_answer_table" to "authenticated";

grant select on table "public"."conditional_answer_table" to "authenticated";

grant trigger on table "public"."conditional_answer_table" to "authenticated";

grant truncate on table "public"."conditional_answer_table" to "authenticated";

grant update on table "public"."conditional_answer_table" to "authenticated";

grant delete on table "public"."conditional_answer_table" to "service_role";

grant insert on table "public"."conditional_answer_table" to "service_role";

grant references on table "public"."conditional_answer_table" to "service_role";

grant select on table "public"."conditional_answer_table" to "service_role";

grant trigger on table "public"."conditional_answer_table" to "service_role";

grant truncate on table "public"."conditional_answer_table" to "service_role";

grant update on table "public"."conditional_answer_table" to "service_role";

grant delete on table "public"."conditional_question_choice_table" to "anon";

grant insert on table "public"."conditional_question_choice_table" to "anon";

grant references on table "public"."conditional_question_choice_table" to "anon";

grant select on table "public"."conditional_question_choice_table" to "anon";

grant trigger on table "public"."conditional_question_choice_table" to "anon";

grant truncate on table "public"."conditional_question_choice_table" to "anon";

grant update on table "public"."conditional_question_choice_table" to "anon";

grant delete on table "public"."conditional_question_choice_table" to "authenticated";

grant insert on table "public"."conditional_question_choice_table" to "authenticated";

grant references on table "public"."conditional_question_choice_table" to "authenticated";

grant select on table "public"."conditional_question_choice_table" to "authenticated";

grant trigger on table "public"."conditional_question_choice_table" to "authenticated";

grant truncate on table "public"."conditional_question_choice_table" to "authenticated";

grant update on table "public"."conditional_question_choice_table" to "authenticated";

grant delete on table "public"."conditional_question_choice_table" to "service_role";

grant insert on table "public"."conditional_question_choice_table" to "service_role";

grant references on table "public"."conditional_question_choice_table" to "service_role";

grant select on table "public"."conditional_question_choice_table" to "service_role";

grant trigger on table "public"."conditional_question_choice_table" to "service_role";

grant truncate on table "public"."conditional_question_choice_table" to "service_role";

grant update on table "public"."conditional_question_choice_table" to "service_role";

grant delete on table "public"."conditional_question_table" to "anon";

grant insert on table "public"."conditional_question_table" to "anon";

grant references on table "public"."conditional_question_table" to "anon";

grant select on table "public"."conditional_question_table" to "anon";

grant trigger on table "public"."conditional_question_table" to "anon";

grant truncate on table "public"."conditional_question_table" to "anon";

grant update on table "public"."conditional_question_table" to "anon";

grant delete on table "public"."conditional_question_table" to "authenticated";

grant insert on table "public"."conditional_question_table" to "authenticated";

grant references on table "public"."conditional_question_table" to "authenticated";

grant select on table "public"."conditional_question_table" to "authenticated";

grant trigger on table "public"."conditional_question_table" to "authenticated";

grant truncate on table "public"."conditional_question_table" to "authenticated";

grant update on table "public"."conditional_question_table" to "authenticated";

grant delete on table "public"."conditional_question_table" to "service_role";

grant insert on table "public"."conditional_question_table" to "service_role";

grant references on table "public"."conditional_question_table" to "service_role";

grant select on table "public"."conditional_question_table" to "service_role";

grant trigger on table "public"."conditional_question_table" to "service_role";

grant truncate on table "public"."conditional_question_table" to "service_role";

grant update on table "public"."conditional_question_table" to "service_role";

grant delete on table "public"."date_picker_answer_table" to "anon";

grant insert on table "public"."date_picker_answer_table" to "anon";

grant references on table "public"."date_picker_answer_table" to "anon";

grant select on table "public"."date_picker_answer_table" to "anon";

grant trigger on table "public"."date_picker_answer_table" to "anon";

grant truncate on table "public"."date_picker_answer_table" to "anon";

grant update on table "public"."date_picker_answer_table" to "anon";

grant delete on table "public"."date_picker_answer_table" to "authenticated";

grant insert on table "public"."date_picker_answer_table" to "authenticated";

grant references on table "public"."date_picker_answer_table" to "authenticated";

grant select on table "public"."date_picker_answer_table" to "authenticated";

grant trigger on table "public"."date_picker_answer_table" to "authenticated";

grant truncate on table "public"."date_picker_answer_table" to "authenticated";

grant update on table "public"."date_picker_answer_table" to "authenticated";

grant delete on table "public"."date_picker_answer_table" to "service_role";

grant insert on table "public"."date_picker_answer_table" to "service_role";

grant references on table "public"."date_picker_answer_table" to "service_role";

grant select on table "public"."date_picker_answer_table" to "service_role";

grant trigger on table "public"."date_picker_answer_table" to "service_role";

grant truncate on table "public"."date_picker_answer_table" to "service_role";

grant update on table "public"."date_picker_answer_table" to "service_role";

grant delete on table "public"."date_picker_question_table" to "anon";

grant insert on table "public"."date_picker_question_table" to "anon";

grant references on table "public"."date_picker_question_table" to "anon";

grant select on table "public"."date_picker_question_table" to "anon";

grant trigger on table "public"."date_picker_question_table" to "anon";

grant truncate on table "public"."date_picker_question_table" to "anon";

grant update on table "public"."date_picker_question_table" to "anon";

grant delete on table "public"."date_picker_question_table" to "authenticated";

grant insert on table "public"."date_picker_question_table" to "authenticated";

grant references on table "public"."date_picker_question_table" to "authenticated";

grant select on table "public"."date_picker_question_table" to "authenticated";

grant trigger on table "public"."date_picker_question_table" to "authenticated";

grant truncate on table "public"."date_picker_question_table" to "authenticated";

grant update on table "public"."date_picker_question_table" to "authenticated";

grant delete on table "public"."date_picker_question_table" to "service_role";

grant insert on table "public"."date_picker_question_table" to "service_role";

grant references on table "public"."date_picker_question_table" to "service_role";

grant select on table "public"."date_picker_question_table" to "service_role";

grant trigger on table "public"."date_picker_question_table" to "service_role";

grant truncate on table "public"."date_picker_question_table" to "service_role";

grant update on table "public"."date_picker_question_table" to "service_role";

grant delete on table "public"."datetime_picker_answer_table" to "anon";

grant insert on table "public"."datetime_picker_answer_table" to "anon";

grant references on table "public"."datetime_picker_answer_table" to "anon";

grant select on table "public"."datetime_picker_answer_table" to "anon";

grant trigger on table "public"."datetime_picker_answer_table" to "anon";

grant truncate on table "public"."datetime_picker_answer_table" to "anon";

grant update on table "public"."datetime_picker_answer_table" to "anon";

grant delete on table "public"."datetime_picker_answer_table" to "authenticated";

grant insert on table "public"."datetime_picker_answer_table" to "authenticated";

grant references on table "public"."datetime_picker_answer_table" to "authenticated";

grant select on table "public"."datetime_picker_answer_table" to "authenticated";

grant trigger on table "public"."datetime_picker_answer_table" to "authenticated";

grant truncate on table "public"."datetime_picker_answer_table" to "authenticated";

grant update on table "public"."datetime_picker_answer_table" to "authenticated";

grant delete on table "public"."datetime_picker_answer_table" to "service_role";

grant insert on table "public"."datetime_picker_answer_table" to "service_role";

grant references on table "public"."datetime_picker_answer_table" to "service_role";

grant select on table "public"."datetime_picker_answer_table" to "service_role";

grant trigger on table "public"."datetime_picker_answer_table" to "service_role";

grant truncate on table "public"."datetime_picker_answer_table" to "service_role";

grant update on table "public"."datetime_picker_answer_table" to "service_role";

grant delete on table "public"."datetime_picker_question_table" to "anon";

grant insert on table "public"."datetime_picker_question_table" to "anon";

grant references on table "public"."datetime_picker_question_table" to "anon";

grant select on table "public"."datetime_picker_question_table" to "anon";

grant trigger on table "public"."datetime_picker_question_table" to "anon";

grant truncate on table "public"."datetime_picker_question_table" to "anon";

grant update on table "public"."datetime_picker_question_table" to "anon";

grant delete on table "public"."datetime_picker_question_table" to "authenticated";

grant insert on table "public"."datetime_picker_question_table" to "authenticated";

grant references on table "public"."datetime_picker_question_table" to "authenticated";

grant select on table "public"."datetime_picker_question_table" to "authenticated";

grant trigger on table "public"."datetime_picker_question_table" to "authenticated";

grant truncate on table "public"."datetime_picker_question_table" to "authenticated";

grant update on table "public"."datetime_picker_question_table" to "authenticated";

grant delete on table "public"."datetime_picker_question_table" to "service_role";

grant insert on table "public"."datetime_picker_question_table" to "service_role";

grant references on table "public"."datetime_picker_question_table" to "service_role";

grant select on table "public"."datetime_picker_question_table" to "service_role";

grant trigger on table "public"."datetime_picker_question_table" to "service_role";

grant truncate on table "public"."datetime_picker_question_table" to "service_role";

grant update on table "public"."datetime_picker_question_table" to "service_role";

grant delete on table "public"."dropdown_answer_table" to "anon";

grant insert on table "public"."dropdown_answer_table" to "anon";

grant references on table "public"."dropdown_answer_table" to "anon";

grant select on table "public"."dropdown_answer_table" to "anon";

grant trigger on table "public"."dropdown_answer_table" to "anon";

grant truncate on table "public"."dropdown_answer_table" to "anon";

grant update on table "public"."dropdown_answer_table" to "anon";

grant delete on table "public"."dropdown_answer_table" to "authenticated";

grant insert on table "public"."dropdown_answer_table" to "authenticated";

grant references on table "public"."dropdown_answer_table" to "authenticated";

grant select on table "public"."dropdown_answer_table" to "authenticated";

grant trigger on table "public"."dropdown_answer_table" to "authenticated";

grant truncate on table "public"."dropdown_answer_table" to "authenticated";

grant update on table "public"."dropdown_answer_table" to "authenticated";

grant delete on table "public"."dropdown_answer_table" to "service_role";

grant insert on table "public"."dropdown_answer_table" to "service_role";

grant references on table "public"."dropdown_answer_table" to "service_role";

grant select on table "public"."dropdown_answer_table" to "service_role";

grant trigger on table "public"."dropdown_answer_table" to "service_role";

grant truncate on table "public"."dropdown_answer_table" to "service_role";

grant update on table "public"."dropdown_answer_table" to "service_role";

grant delete on table "public"."dropdown_question_option_table" to "anon";

grant insert on table "public"."dropdown_question_option_table" to "anon";

grant references on table "public"."dropdown_question_option_table" to "anon";

grant select on table "public"."dropdown_question_option_table" to "anon";

grant trigger on table "public"."dropdown_question_option_table" to "anon";

grant truncate on table "public"."dropdown_question_option_table" to "anon";

grant update on table "public"."dropdown_question_option_table" to "anon";

grant delete on table "public"."dropdown_question_option_table" to "authenticated";

grant insert on table "public"."dropdown_question_option_table" to "authenticated";

grant references on table "public"."dropdown_question_option_table" to "authenticated";

grant select on table "public"."dropdown_question_option_table" to "authenticated";

grant trigger on table "public"."dropdown_question_option_table" to "authenticated";

grant truncate on table "public"."dropdown_question_option_table" to "authenticated";

grant update on table "public"."dropdown_question_option_table" to "authenticated";

grant delete on table "public"."dropdown_question_option_table" to "service_role";

grant insert on table "public"."dropdown_question_option_table" to "service_role";

grant references on table "public"."dropdown_question_option_table" to "service_role";

grant select on table "public"."dropdown_question_option_table" to "service_role";

grant trigger on table "public"."dropdown_question_option_table" to "service_role";

grant truncate on table "public"."dropdown_question_option_table" to "service_role";

grant update on table "public"."dropdown_question_option_table" to "service_role";

grant delete on table "public"."dropdown_question_table" to "anon";

grant insert on table "public"."dropdown_question_table" to "anon";

grant references on table "public"."dropdown_question_table" to "anon";

grant select on table "public"."dropdown_question_table" to "anon";

grant trigger on table "public"."dropdown_question_table" to "anon";

grant truncate on table "public"."dropdown_question_table" to "anon";

grant update on table "public"."dropdown_question_table" to "anon";

grant delete on table "public"."dropdown_question_table" to "authenticated";

grant insert on table "public"."dropdown_question_table" to "authenticated";

grant references on table "public"."dropdown_question_table" to "authenticated";

grant select on table "public"."dropdown_question_table" to "authenticated";

grant trigger on table "public"."dropdown_question_table" to "authenticated";

grant truncate on table "public"."dropdown_question_table" to "authenticated";

grant update on table "public"."dropdown_question_table" to "authenticated";

grant delete on table "public"."dropdown_question_table" to "service_role";

grant insert on table "public"."dropdown_question_table" to "service_role";

grant references on table "public"."dropdown_question_table" to "service_role";

grant select on table "public"."dropdown_question_table" to "service_role";

grant trigger on table "public"."dropdown_question_table" to "service_role";

grant truncate on table "public"."dropdown_question_table" to "service_role";

grant update on table "public"."dropdown_question_table" to "service_role";

grant delete on table "public"."image_upload_answer_table" to "anon";

grant insert on table "public"."image_upload_answer_table" to "anon";

grant references on table "public"."image_upload_answer_table" to "anon";

grant select on table "public"."image_upload_answer_table" to "anon";

grant trigger on table "public"."image_upload_answer_table" to "anon";

grant truncate on table "public"."image_upload_answer_table" to "anon";

grant update on table "public"."image_upload_answer_table" to "anon";

grant delete on table "public"."image_upload_answer_table" to "authenticated";

grant insert on table "public"."image_upload_answer_table" to "authenticated";

grant references on table "public"."image_upload_answer_table" to "authenticated";

grant select on table "public"."image_upload_answer_table" to "authenticated";

grant trigger on table "public"."image_upload_answer_table" to "authenticated";

grant truncate on table "public"."image_upload_answer_table" to "authenticated";

grant update on table "public"."image_upload_answer_table" to "authenticated";

grant delete on table "public"."image_upload_answer_table" to "service_role";

grant insert on table "public"."image_upload_answer_table" to "service_role";

grant references on table "public"."image_upload_answer_table" to "service_role";

grant select on table "public"."image_upload_answer_table" to "service_role";

grant trigger on table "public"."image_upload_answer_table" to "service_role";

grant truncate on table "public"."image_upload_answer_table" to "service_role";

grant update on table "public"."image_upload_answer_table" to "service_role";

grant delete on table "public"."image_upload_question_table" to "anon";

grant insert on table "public"."image_upload_question_table" to "anon";

grant references on table "public"."image_upload_question_table" to "anon";

grant select on table "public"."image_upload_question_table" to "anon";

grant trigger on table "public"."image_upload_question_table" to "anon";

grant truncate on table "public"."image_upload_question_table" to "anon";

grant update on table "public"."image_upload_question_table" to "anon";

grant delete on table "public"."image_upload_question_table" to "authenticated";

grant insert on table "public"."image_upload_question_table" to "authenticated";

grant references on table "public"."image_upload_question_table" to "authenticated";

grant select on table "public"."image_upload_question_table" to "authenticated";

grant trigger on table "public"."image_upload_question_table" to "authenticated";

grant truncate on table "public"."image_upload_question_table" to "authenticated";

grant update on table "public"."image_upload_question_table" to "authenticated";

grant delete on table "public"."image_upload_question_table" to "service_role";

grant insert on table "public"."image_upload_question_table" to "service_role";

grant references on table "public"."image_upload_question_table" to "service_role";

grant select on table "public"."image_upload_question_table" to "service_role";

grant trigger on table "public"."image_upload_question_table" to "service_role";

grant truncate on table "public"."image_upload_question_table" to "service_role";

grant update on table "public"."image_upload_question_table" to "service_role";

grant delete on table "public"."long_text_answer_table" to "anon";

grant insert on table "public"."long_text_answer_table" to "anon";

grant references on table "public"."long_text_answer_table" to "anon";

grant select on table "public"."long_text_answer_table" to "anon";

grant trigger on table "public"."long_text_answer_table" to "anon";

grant truncate on table "public"."long_text_answer_table" to "anon";

grant update on table "public"."long_text_answer_table" to "anon";

grant delete on table "public"."long_text_answer_table" to "authenticated";

grant insert on table "public"."long_text_answer_table" to "authenticated";

grant references on table "public"."long_text_answer_table" to "authenticated";

grant select on table "public"."long_text_answer_table" to "authenticated";

grant trigger on table "public"."long_text_answer_table" to "authenticated";

grant truncate on table "public"."long_text_answer_table" to "authenticated";

grant update on table "public"."long_text_answer_table" to "authenticated";

grant delete on table "public"."long_text_answer_table" to "service_role";

grant insert on table "public"."long_text_answer_table" to "service_role";

grant references on table "public"."long_text_answer_table" to "service_role";

grant select on table "public"."long_text_answer_table" to "service_role";

grant trigger on table "public"."long_text_answer_table" to "service_role";

grant truncate on table "public"."long_text_answer_table" to "service_role";

grant update on table "public"."long_text_answer_table" to "service_role";

grant delete on table "public"."long_text_question_table" to "anon";

grant insert on table "public"."long_text_question_table" to "anon";

grant references on table "public"."long_text_question_table" to "anon";

grant select on table "public"."long_text_question_table" to "anon";

grant trigger on table "public"."long_text_question_table" to "anon";

grant truncate on table "public"."long_text_question_table" to "anon";

grant update on table "public"."long_text_question_table" to "anon";

grant delete on table "public"."long_text_question_table" to "authenticated";

grant insert on table "public"."long_text_question_table" to "authenticated";

grant references on table "public"."long_text_question_table" to "authenticated";

grant select on table "public"."long_text_question_table" to "authenticated";

grant trigger on table "public"."long_text_question_table" to "authenticated";

grant truncate on table "public"."long_text_question_table" to "authenticated";

grant update on table "public"."long_text_question_table" to "authenticated";

grant delete on table "public"."long_text_question_table" to "service_role";

grant insert on table "public"."long_text_question_table" to "service_role";

grant references on table "public"."long_text_question_table" to "service_role";

grant select on table "public"."long_text_question_table" to "service_role";

grant trigger on table "public"."long_text_question_table" to "service_role";

grant truncate on table "public"."long_text_question_table" to "service_role";

grant update on table "public"."long_text_question_table" to "service_role";

grant delete on table "public"."multiple_choice_answer_table" to "anon";

grant insert on table "public"."multiple_choice_answer_table" to "anon";

grant references on table "public"."multiple_choice_answer_table" to "anon";

grant select on table "public"."multiple_choice_answer_table" to "anon";

grant trigger on table "public"."multiple_choice_answer_table" to "anon";

grant truncate on table "public"."multiple_choice_answer_table" to "anon";

grant update on table "public"."multiple_choice_answer_table" to "anon";

grant delete on table "public"."multiple_choice_answer_table" to "authenticated";

grant insert on table "public"."multiple_choice_answer_table" to "authenticated";

grant references on table "public"."multiple_choice_answer_table" to "authenticated";

grant select on table "public"."multiple_choice_answer_table" to "authenticated";

grant trigger on table "public"."multiple_choice_answer_table" to "authenticated";

grant truncate on table "public"."multiple_choice_answer_table" to "authenticated";

grant update on table "public"."multiple_choice_answer_table" to "authenticated";

grant delete on table "public"."multiple_choice_answer_table" to "service_role";

grant insert on table "public"."multiple_choice_answer_table" to "service_role";

grant references on table "public"."multiple_choice_answer_table" to "service_role";

grant select on table "public"."multiple_choice_answer_table" to "service_role";

grant trigger on table "public"."multiple_choice_answer_table" to "service_role";

grant truncate on table "public"."multiple_choice_answer_table" to "service_role";

grant update on table "public"."multiple_choice_answer_table" to "service_role";

grant delete on table "public"."multiple_choice_question_choice_table" to "anon";

grant insert on table "public"."multiple_choice_question_choice_table" to "anon";

grant references on table "public"."multiple_choice_question_choice_table" to "anon";

grant select on table "public"."multiple_choice_question_choice_table" to "anon";

grant trigger on table "public"."multiple_choice_question_choice_table" to "anon";

grant truncate on table "public"."multiple_choice_question_choice_table" to "anon";

grant update on table "public"."multiple_choice_question_choice_table" to "anon";

grant delete on table "public"."multiple_choice_question_choice_table" to "authenticated";

grant insert on table "public"."multiple_choice_question_choice_table" to "authenticated";

grant references on table "public"."multiple_choice_question_choice_table" to "authenticated";

grant select on table "public"."multiple_choice_question_choice_table" to "authenticated";

grant trigger on table "public"."multiple_choice_question_choice_table" to "authenticated";

grant truncate on table "public"."multiple_choice_question_choice_table" to "authenticated";

grant update on table "public"."multiple_choice_question_choice_table" to "authenticated";

grant delete on table "public"."multiple_choice_question_choice_table" to "service_role";

grant insert on table "public"."multiple_choice_question_choice_table" to "service_role";

grant references on table "public"."multiple_choice_question_choice_table" to "service_role";

grant select on table "public"."multiple_choice_question_choice_table" to "service_role";

grant trigger on table "public"."multiple_choice_question_choice_table" to "service_role";

grant truncate on table "public"."multiple_choice_question_choice_table" to "service_role";

grant update on table "public"."multiple_choice_question_choice_table" to "service_role";

grant delete on table "public"."multiple_choice_question_table" to "anon";

grant insert on table "public"."multiple_choice_question_table" to "anon";

grant references on table "public"."multiple_choice_question_table" to "anon";

grant select on table "public"."multiple_choice_question_table" to "anon";

grant trigger on table "public"."multiple_choice_question_table" to "anon";

grant truncate on table "public"."multiple_choice_question_table" to "anon";

grant update on table "public"."multiple_choice_question_table" to "anon";

grant delete on table "public"."multiple_choice_question_table" to "authenticated";

grant insert on table "public"."multiple_choice_question_table" to "authenticated";

grant references on table "public"."multiple_choice_question_table" to "authenticated";

grant select on table "public"."multiple_choice_question_table" to "authenticated";

grant trigger on table "public"."multiple_choice_question_table" to "authenticated";

grant truncate on table "public"."multiple_choice_question_table" to "authenticated";

grant update on table "public"."multiple_choice_question_table" to "authenticated";

grant delete on table "public"."multiple_choice_question_table" to "service_role";

grant insert on table "public"."multiple_choice_question_table" to "service_role";

grant references on table "public"."multiple_choice_question_table" to "service_role";

grant select on table "public"."multiple_choice_question_table" to "service_role";

grant trigger on table "public"."multiple_choice_question_table" to "service_role";

grant truncate on table "public"."multiple_choice_question_table" to "service_role";

grant update on table "public"."multiple_choice_question_table" to "service_role";

grant delete on table "public"."number_picker_answer_table" to "anon";

grant insert on table "public"."number_picker_answer_table" to "anon";

grant references on table "public"."number_picker_answer_table" to "anon";

grant select on table "public"."number_picker_answer_table" to "anon";

grant trigger on table "public"."number_picker_answer_table" to "anon";

grant truncate on table "public"."number_picker_answer_table" to "anon";

grant update on table "public"."number_picker_answer_table" to "anon";

grant delete on table "public"."number_picker_answer_table" to "authenticated";

grant insert on table "public"."number_picker_answer_table" to "authenticated";

grant references on table "public"."number_picker_answer_table" to "authenticated";

grant select on table "public"."number_picker_answer_table" to "authenticated";

grant trigger on table "public"."number_picker_answer_table" to "authenticated";

grant truncate on table "public"."number_picker_answer_table" to "authenticated";

grant update on table "public"."number_picker_answer_table" to "authenticated";

grant delete on table "public"."number_picker_answer_table" to "service_role";

grant insert on table "public"."number_picker_answer_table" to "service_role";

grant references on table "public"."number_picker_answer_table" to "service_role";

grant select on table "public"."number_picker_answer_table" to "service_role";

grant trigger on table "public"."number_picker_answer_table" to "service_role";

grant truncate on table "public"."number_picker_answer_table" to "service_role";

grant update on table "public"."number_picker_answer_table" to "service_role";

grant delete on table "public"."number_picker_question_table" to "anon";

grant insert on table "public"."number_picker_question_table" to "anon";

grant references on table "public"."number_picker_question_table" to "anon";

grant select on table "public"."number_picker_question_table" to "anon";

grant trigger on table "public"."number_picker_question_table" to "anon";

grant truncate on table "public"."number_picker_question_table" to "anon";

grant update on table "public"."number_picker_question_table" to "anon";

grant delete on table "public"."number_picker_question_table" to "authenticated";

grant insert on table "public"."number_picker_question_table" to "authenticated";

grant references on table "public"."number_picker_question_table" to "authenticated";

grant select on table "public"."number_picker_question_table" to "authenticated";

grant trigger on table "public"."number_picker_question_table" to "authenticated";

grant truncate on table "public"."number_picker_question_table" to "authenticated";

grant update on table "public"."number_picker_question_table" to "authenticated";

grant delete on table "public"."number_picker_question_table" to "service_role";

grant insert on table "public"."number_picker_question_table" to "service_role";

grant references on table "public"."number_picker_question_table" to "service_role";

grant select on table "public"."number_picker_question_table" to "service_role";

grant trigger on table "public"."number_picker_question_table" to "service_role";

grant truncate on table "public"."number_picker_question_table" to "service_role";

grant update on table "public"."number_picker_question_table" to "service_role";

grant delete on table "public"."pdf_upload_answer_table" to "anon";

grant insert on table "public"."pdf_upload_answer_table" to "anon";

grant references on table "public"."pdf_upload_answer_table" to "anon";

grant select on table "public"."pdf_upload_answer_table" to "anon";

grant trigger on table "public"."pdf_upload_answer_table" to "anon";

grant truncate on table "public"."pdf_upload_answer_table" to "anon";

grant update on table "public"."pdf_upload_answer_table" to "anon";

grant delete on table "public"."pdf_upload_answer_table" to "authenticated";

grant insert on table "public"."pdf_upload_answer_table" to "authenticated";

grant references on table "public"."pdf_upload_answer_table" to "authenticated";

grant select on table "public"."pdf_upload_answer_table" to "authenticated";

grant trigger on table "public"."pdf_upload_answer_table" to "authenticated";

grant truncate on table "public"."pdf_upload_answer_table" to "authenticated";

grant update on table "public"."pdf_upload_answer_table" to "authenticated";

grant delete on table "public"."pdf_upload_answer_table" to "service_role";

grant insert on table "public"."pdf_upload_answer_table" to "service_role";

grant references on table "public"."pdf_upload_answer_table" to "service_role";

grant select on table "public"."pdf_upload_answer_table" to "service_role";

grant trigger on table "public"."pdf_upload_answer_table" to "service_role";

grant truncate on table "public"."pdf_upload_answer_table" to "service_role";

grant update on table "public"."pdf_upload_answer_table" to "service_role";

grant delete on table "public"."pdf_upload_question_table" to "anon";

grant insert on table "public"."pdf_upload_question_table" to "anon";

grant references on table "public"."pdf_upload_question_table" to "anon";

grant select on table "public"."pdf_upload_question_table" to "anon";

grant trigger on table "public"."pdf_upload_question_table" to "anon";

grant truncate on table "public"."pdf_upload_question_table" to "anon";

grant update on table "public"."pdf_upload_question_table" to "anon";

grant delete on table "public"."pdf_upload_question_table" to "authenticated";

grant insert on table "public"."pdf_upload_question_table" to "authenticated";

grant references on table "public"."pdf_upload_question_table" to "authenticated";

grant select on table "public"."pdf_upload_question_table" to "authenticated";

grant trigger on table "public"."pdf_upload_question_table" to "authenticated";

grant truncate on table "public"."pdf_upload_question_table" to "authenticated";

grant update on table "public"."pdf_upload_question_table" to "authenticated";

grant delete on table "public"."pdf_upload_question_table" to "service_role";

grant insert on table "public"."pdf_upload_question_table" to "service_role";

grant references on table "public"."pdf_upload_question_table" to "service_role";

grant select on table "public"."pdf_upload_question_table" to "service_role";

grant trigger on table "public"."pdf_upload_question_table" to "service_role";

grant truncate on table "public"."pdf_upload_question_table" to "service_role";

grant update on table "public"."pdf_upload_question_table" to "service_role";

grant delete on table "public"."phase_assignment_table" to "anon";

grant insert on table "public"."phase_assignment_table" to "anon";

grant references on table "public"."phase_assignment_table" to "anon";

grant select on table "public"."phase_assignment_table" to "anon";

grant trigger on table "public"."phase_assignment_table" to "anon";

grant truncate on table "public"."phase_assignment_table" to "anon";

grant update on table "public"."phase_assignment_table" to "anon";

grant delete on table "public"."phase_assignment_table" to "authenticated";

grant insert on table "public"."phase_assignment_table" to "authenticated";

grant references on table "public"."phase_assignment_table" to "authenticated";

grant select on table "public"."phase_assignment_table" to "authenticated";

grant trigger on table "public"."phase_assignment_table" to "authenticated";

grant truncate on table "public"."phase_assignment_table" to "authenticated";

grant update on table "public"."phase_assignment_table" to "authenticated";

grant delete on table "public"."phase_assignment_table" to "service_role";

grant insert on table "public"."phase_assignment_table" to "service_role";

grant references on table "public"."phase_assignment_table" to "service_role";

grant select on table "public"."phase_assignment_table" to "service_role";

grant trigger on table "public"."phase_assignment_table" to "service_role";

grant truncate on table "public"."phase_assignment_table" to "service_role";

grant update on table "public"."phase_assignment_table" to "service_role";

grant delete on table "public"."phase_outcome_table" to "anon";

grant insert on table "public"."phase_outcome_table" to "anon";

grant references on table "public"."phase_outcome_table" to "anon";

grant select on table "public"."phase_outcome_table" to "anon";

grant trigger on table "public"."phase_outcome_table" to "anon";

grant truncate on table "public"."phase_outcome_table" to "anon";

grant update on table "public"."phase_outcome_table" to "anon";

grant delete on table "public"."phase_outcome_table" to "authenticated";

grant insert on table "public"."phase_outcome_table" to "authenticated";

grant references on table "public"."phase_outcome_table" to "authenticated";

grant select on table "public"."phase_outcome_table" to "authenticated";

grant trigger on table "public"."phase_outcome_table" to "authenticated";

grant truncate on table "public"."phase_outcome_table" to "authenticated";

grant update on table "public"."phase_outcome_table" to "authenticated";

grant delete on table "public"."phase_outcome_table" to "service_role";

grant insert on table "public"."phase_outcome_table" to "service_role";

grant references on table "public"."phase_outcome_table" to "service_role";

grant select on table "public"."phase_outcome_table" to "service_role";

grant trigger on table "public"."phase_outcome_table" to "service_role";

grant truncate on table "public"."phase_outcome_table" to "service_role";

grant update on table "public"."phase_outcome_table" to "service_role";

grant delete on table "public"."phase_table" to "anon";

grant insert on table "public"."phase_table" to "anon";

grant references on table "public"."phase_table" to "anon";

grant select on table "public"."phase_table" to "anon";

grant trigger on table "public"."phase_table" to "anon";

grant truncate on table "public"."phase_table" to "anon";

grant update on table "public"."phase_table" to "anon";

grant delete on table "public"."phase_table" to "authenticated";

grant insert on table "public"."phase_table" to "authenticated";

grant references on table "public"."phase_table" to "authenticated";

grant select on table "public"."phase_table" to "authenticated";

grant trigger on table "public"."phase_table" to "authenticated";

grant truncate on table "public"."phase_table" to "authenticated";

grant update on table "public"."phase_table" to "authenticated";

grant delete on table "public"."phase_table" to "service_role";

grant insert on table "public"."phase_table" to "service_role";

grant references on table "public"."phase_table" to "service_role";

grant select on table "public"."phase_table" to "service_role";

grant trigger on table "public"."phase_table" to "service_role";

grant truncate on table "public"."phase_table" to "service_role";

grant update on table "public"."phase_table" to "service_role";

grant delete on table "public"."question_table" to "anon";

grant insert on table "public"."question_table" to "anon";

grant references on table "public"."question_table" to "anon";

grant select on table "public"."question_table" to "anon";

grant trigger on table "public"."question_table" to "anon";

grant truncate on table "public"."question_table" to "anon";

grant update on table "public"."question_table" to "anon";

grant delete on table "public"."question_table" to "authenticated";

grant insert on table "public"."question_table" to "authenticated";

grant references on table "public"."question_table" to "authenticated";

grant select on table "public"."question_table" to "authenticated";

grant trigger on table "public"."question_table" to "authenticated";

grant truncate on table "public"."question_table" to "authenticated";

grant update on table "public"."question_table" to "authenticated";

grant delete on table "public"."question_table" to "service_role";

grant insert on table "public"."question_table" to "service_role";

grant references on table "public"."question_table" to "service_role";

grant select on table "public"."question_table" to "service_role";

grant trigger on table "public"."question_table" to "service_role";

grant truncate on table "public"."question_table" to "service_role";

grant update on table "public"."question_table" to "service_role";

grant delete on table "public"."sections_table" to "anon";

grant insert on table "public"."sections_table" to "anon";

grant references on table "public"."sections_table" to "anon";

grant select on table "public"."sections_table" to "anon";

grant trigger on table "public"."sections_table" to "anon";

grant truncate on table "public"."sections_table" to "anon";

grant update on table "public"."sections_table" to "anon";

grant delete on table "public"."sections_table" to "authenticated";

grant insert on table "public"."sections_table" to "authenticated";

grant references on table "public"."sections_table" to "authenticated";

grant select on table "public"."sections_table" to "authenticated";

grant trigger on table "public"."sections_table" to "authenticated";

grant truncate on table "public"."sections_table" to "authenticated";

grant update on table "public"."sections_table" to "authenticated";

grant delete on table "public"."sections_table" to "service_role";

grant insert on table "public"."sections_table" to "service_role";

grant references on table "public"."sections_table" to "service_role";

grant select on table "public"."sections_table" to "service_role";

grant trigger on table "public"."sections_table" to "service_role";

grant truncate on table "public"."sections_table" to "service_role";

grant update on table "public"."sections_table" to "service_role";

grant delete on table "public"."short_text_answer_table" to "anon";

grant insert on table "public"."short_text_answer_table" to "anon";

grant references on table "public"."short_text_answer_table" to "anon";

grant select on table "public"."short_text_answer_table" to "anon";

grant trigger on table "public"."short_text_answer_table" to "anon";

grant truncate on table "public"."short_text_answer_table" to "anon";

grant update on table "public"."short_text_answer_table" to "anon";

grant delete on table "public"."short_text_answer_table" to "authenticated";

grant insert on table "public"."short_text_answer_table" to "authenticated";

grant references on table "public"."short_text_answer_table" to "authenticated";

grant select on table "public"."short_text_answer_table" to "authenticated";

grant trigger on table "public"."short_text_answer_table" to "authenticated";

grant truncate on table "public"."short_text_answer_table" to "authenticated";

grant update on table "public"."short_text_answer_table" to "authenticated";

grant delete on table "public"."short_text_answer_table" to "service_role";

grant insert on table "public"."short_text_answer_table" to "service_role";

grant references on table "public"."short_text_answer_table" to "service_role";

grant select on table "public"."short_text_answer_table" to "service_role";

grant trigger on table "public"."short_text_answer_table" to "service_role";

grant truncate on table "public"."short_text_answer_table" to "service_role";

grant update on table "public"."short_text_answer_table" to "service_role";

grant delete on table "public"."short_text_question_table" to "anon";

grant insert on table "public"."short_text_question_table" to "anon";

grant references on table "public"."short_text_question_table" to "anon";

grant select on table "public"."short_text_question_table" to "anon";

grant trigger on table "public"."short_text_question_table" to "anon";

grant truncate on table "public"."short_text_question_table" to "anon";

grant update on table "public"."short_text_question_table" to "anon";

grant delete on table "public"."short_text_question_table" to "authenticated";

grant insert on table "public"."short_text_question_table" to "authenticated";

grant references on table "public"."short_text_question_table" to "authenticated";

grant select on table "public"."short_text_question_table" to "authenticated";

grant trigger on table "public"."short_text_question_table" to "authenticated";

grant truncate on table "public"."short_text_question_table" to "authenticated";

grant update on table "public"."short_text_question_table" to "authenticated";

grant delete on table "public"."short_text_question_table" to "service_role";

grant insert on table "public"."short_text_question_table" to "service_role";

grant references on table "public"."short_text_question_table" to "service_role";

grant select on table "public"."short_text_question_table" to "service_role";

grant trigger on table "public"."short_text_question_table" to "service_role";

grant truncate on table "public"."short_text_question_table" to "service_role";

grant update on table "public"."short_text_question_table" to "service_role";

grant delete on table "public"."user_profiles_table" to "anon";

grant insert on table "public"."user_profiles_table" to "anon";

grant references on table "public"."user_profiles_table" to "anon";

grant select on table "public"."user_profiles_table" to "anon";

grant trigger on table "public"."user_profiles_table" to "anon";

grant truncate on table "public"."user_profiles_table" to "anon";

grant update on table "public"."user_profiles_table" to "anon";

grant delete on table "public"."user_profiles_table" to "authenticated";

grant insert on table "public"."user_profiles_table" to "authenticated";

grant references on table "public"."user_profiles_table" to "authenticated";

grant select on table "public"."user_profiles_table" to "authenticated";

grant trigger on table "public"."user_profiles_table" to "authenticated";

grant truncate on table "public"."user_profiles_table" to "authenticated";

grant update on table "public"."user_profiles_table" to "authenticated";

grant delete on table "public"."user_profiles_table" to "service_role";

grant insert on table "public"."user_profiles_table" to "service_role";

grant references on table "public"."user_profiles_table" to "service_role";

grant select on table "public"."user_profiles_table" to "service_role";

grant trigger on table "public"."user_profiles_table" to "service_role";

grant truncate on table "public"."user_profiles_table" to "service_role";

grant update on table "public"."user_profiles_table" to "service_role";

grant delete on table "public"."user_roles_table" to "anon";

grant insert on table "public"."user_roles_table" to "anon";

grant references on table "public"."user_roles_table" to "anon";

grant select on table "public"."user_roles_table" to "anon";

grant trigger on table "public"."user_roles_table" to "anon";

grant truncate on table "public"."user_roles_table" to "anon";

grant update on table "public"."user_roles_table" to "anon";

grant delete on table "public"."user_roles_table" to "authenticated";

grant insert on table "public"."user_roles_table" to "authenticated";

grant references on table "public"."user_roles_table" to "authenticated";

grant select on table "public"."user_roles_table" to "authenticated";

grant trigger on table "public"."user_roles_table" to "authenticated";

grant truncate on table "public"."user_roles_table" to "authenticated";

grant update on table "public"."user_roles_table" to "authenticated";

grant delete on table "public"."user_roles_table" to "service_role";

grant insert on table "public"."user_roles_table" to "service_role";

grant references on table "public"."user_roles_table" to "service_role";

grant select on table "public"."user_roles_table" to "service_role";

grant trigger on table "public"."user_roles_table" to "service_role";

grant truncate on table "public"."user_roles_table" to "service_role";

grant update on table "public"."user_roles_table" to "service_role";

grant delete on table "public"."video_upload_answer_table" to "anon";

grant insert on table "public"."video_upload_answer_table" to "anon";

grant references on table "public"."video_upload_answer_table" to "anon";

grant select on table "public"."video_upload_answer_table" to "anon";

grant trigger on table "public"."video_upload_answer_table" to "anon";

grant truncate on table "public"."video_upload_answer_table" to "anon";

grant update on table "public"."video_upload_answer_table" to "anon";

grant delete on table "public"."video_upload_answer_table" to "authenticated";

grant insert on table "public"."video_upload_answer_table" to "authenticated";

grant references on table "public"."video_upload_answer_table" to "authenticated";

grant select on table "public"."video_upload_answer_table" to "authenticated";

grant trigger on table "public"."video_upload_answer_table" to "authenticated";

grant truncate on table "public"."video_upload_answer_table" to "authenticated";

grant update on table "public"."video_upload_answer_table" to "authenticated";

grant delete on table "public"."video_upload_answer_table" to "service_role";

grant insert on table "public"."video_upload_answer_table" to "service_role";

grant references on table "public"."video_upload_answer_table" to "service_role";

grant select on table "public"."video_upload_answer_table" to "service_role";

grant trigger on table "public"."video_upload_answer_table" to "service_role";

grant truncate on table "public"."video_upload_answer_table" to "service_role";

grant update on table "public"."video_upload_answer_table" to "service_role";

grant delete on table "public"."video_upload_question_table" to "anon";

grant insert on table "public"."video_upload_question_table" to "anon";

grant references on table "public"."video_upload_question_table" to "anon";

grant select on table "public"."video_upload_question_table" to "anon";

grant trigger on table "public"."video_upload_question_table" to "anon";

grant truncate on table "public"."video_upload_question_table" to "anon";

grant update on table "public"."video_upload_question_table" to "anon";

grant delete on table "public"."video_upload_question_table" to "authenticated";

grant insert on table "public"."video_upload_question_table" to "authenticated";

grant references on table "public"."video_upload_question_table" to "authenticated";

grant select on table "public"."video_upload_question_table" to "authenticated";

grant trigger on table "public"."video_upload_question_table" to "authenticated";

grant truncate on table "public"."video_upload_question_table" to "authenticated";

grant update on table "public"."video_upload_question_table" to "authenticated";

grant delete on table "public"."video_upload_question_table" to "service_role";

grant insert on table "public"."video_upload_question_table" to "service_role";

grant references on table "public"."video_upload_question_table" to "service_role";

grant select on table "public"."video_upload_question_table" to "service_role";

grant trigger on table "public"."video_upload_question_table" to "service_role";

grant truncate on table "public"."video_upload_question_table" to "service_role";

grant update on table "public"."video_upload_question_table" to "service_role";

create policy "admin_cmd_answer_table"
on "public"."answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_answer"
on "public"."answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM application_table
  WHERE ((application_table.applicationid = answer_table.applicationid) AND (application_table.userid = auth.uid())))));


create policy "insert_answer"
on "public"."answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM application_table
  WHERE ((application_table.applicationid = answer_table.applicationid) AND (application_table.userid = auth.uid())))));


create policy "select_answer"
on "public"."answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM application_table
  WHERE ((application_table.applicationid = answer_table.applicationid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_answer_table"
on "public"."answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN question_table qt ON ((answer_table.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
     JOIN application_table at ON ((answer_table.applicationid = at.applicationid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.userid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_answer"
on "public"."answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM application_table
  WHERE ((application_table.applicationid = answer_table.applicationid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_application_table"
on "public"."application_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_application"
on "public"."application_table"
as permissive
for delete
to public
using ((userid = auth.uid()));


create policy "insert_application"
on "public"."application_table"
as permissive
for insert
to public
with check ((userid = auth.uid()));


create policy "select_application"
on "public"."application_table"
as permissive
for select
to public
using ((userid = auth.uid()));


create policy "select_reviewer_application_table"
on "public"."application_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "update_application"
on "public"."application_table"
as permissive
for update
to public
with check ((userid = auth.uid()));


create policy "delete_checkbox_answer"
on "public"."checkbox_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = checkbox_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_checkbox_answer"
on "public"."checkbox_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = checkbox_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_checkbox_answer"
on "public"."checkbox_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = checkbox_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "update_checkbox_answer"
on "public"."checkbox_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = checkbox_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_policy"
on "public"."checkbox_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "delete_conditional_answer"
on "public"."conditional_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = conditional_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_conditional_answer"
on "public"."conditional_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = conditional_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_conditional_answer"
on "public"."conditional_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = conditional_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "update_conditional_answer"
on "public"."conditional_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = conditional_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "conditional_question_choice_table"
on "public"."conditional_question_choice_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."conditional_question_choice_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_conditional_question_choice_table"
on "public"."conditional_question_choice_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_date_picker_answer_table"
on "public"."date_picker_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_date_picker_answer"
on "public"."date_picker_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = date_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_date_picker_answer"
on "public"."date_picker_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = date_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_date_picker_answer"
on "public"."date_picker_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = date_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_date_picker_answer_table"
on "public"."date_picker_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((date_picker_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_date_picker_answer"
on "public"."date_picker_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = date_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_date_picker_question_table"
on "public"."date_picker_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."date_picker_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_date_picker_question_table"
on "public"."date_picker_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_datetime_picker_answer_table"
on "public"."datetime_picker_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_datetime_picker_answer"
on "public"."datetime_picker_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = datetime_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_datetime_picker_answer"
on "public"."datetime_picker_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = datetime_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_datetime_picker_answer"
on "public"."datetime_picker_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = datetime_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_datetime_picker_answer_table"
on "public"."datetime_picker_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((datetime_picker_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_datetime_picker_answer"
on "public"."datetime_picker_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = datetime_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_datetime_picker_question_table"
on "public"."datetime_picker_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."datetime_picker_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_datetime_picker_question_table"
on "public"."datetime_picker_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_dropdown_answer_table"
on "public"."dropdown_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_dropdown_answer"
on "public"."dropdown_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = dropdown_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_dropdown_answer"
on "public"."dropdown_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = dropdown_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_dropdown_answer"
on "public"."dropdown_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = dropdown_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_dropdown_answer_table"
on "public"."dropdown_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((dropdown_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_dropdown_answer"
on "public"."dropdown_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = dropdown_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_dropdown_question_option_table"
on "public"."dropdown_question_option_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."dropdown_question_option_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_dropdown_question_option_table"
on "public"."dropdown_question_option_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_dropdown_question_table"
on "public"."dropdown_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."dropdown_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_dropdown_question_table"
on "public"."dropdown_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_image_upload_answer_table"
on "public"."image_upload_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_image_upload_answer"
on "public"."image_upload_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = image_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_image_upload_answer"
on "public"."image_upload_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = image_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_image_upload_answer"
on "public"."image_upload_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = image_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_image_upload_answer_table"
on "public"."image_upload_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((image_upload_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_image_upload_answer"
on "public"."image_upload_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = image_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_image_upload_question_table"
on "public"."image_upload_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."image_upload_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_image_upload_question_table"
on "public"."image_upload_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_long_text_answer_table"
on "public"."long_text_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_long_text_answer"
on "public"."long_text_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = long_text_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_long_text_answer"
on "public"."long_text_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = long_text_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_long_text_answer"
on "public"."long_text_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = long_text_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_long_text_answer_table"
on "public"."long_text_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((long_text_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_long_text_answer"
on "public"."long_text_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = long_text_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_long_text_question_table"
on "public"."long_text_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."long_text_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_long_text_question_table"
on "public"."long_text_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_multiple_choice_answer_table"
on "public"."multiple_choice_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_multiple_choice_answer"
on "public"."multiple_choice_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = multiple_choice_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_multiple_choice_answer"
on "public"."multiple_choice_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = multiple_choice_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_multiple_choice_answer"
on "public"."multiple_choice_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = multiple_choice_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_multiple_choice_answer_table"
on "public"."multiple_choice_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((multiple_choice_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_multiple_choice_answer"
on "public"."multiple_choice_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = multiple_choice_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_multiple_choice_question_choice_table"
on "public"."multiple_choice_question_choice_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."multiple_choice_question_choice_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_multiple_choice_question_choice_table"
on "public"."multiple_choice_question_choice_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_multiple_choice_question_table"
on "public"."multiple_choice_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."multiple_choice_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_multiple_choice_question_table"
on "public"."multiple_choice_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_number_picker_answer_table"
on "public"."number_picker_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_number_picker_answer"
on "public"."number_picker_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = number_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_number_picker_answer"
on "public"."number_picker_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = number_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_number_picker_answer"
on "public"."number_picker_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = number_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_number_picker_answer_table"
on "public"."number_picker_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((number_picker_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_number_picker_answer"
on "public"."number_picker_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = number_picker_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_number_picker_question_table"
on "public"."number_picker_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."number_picker_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_number_picker_question_table"
on "public"."number_picker_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_pdf_upload_answer_table"
on "public"."pdf_upload_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_pdf_upload_answer"
on "public"."pdf_upload_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = pdf_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_pdf_upload_answer"
on "public"."pdf_upload_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = pdf_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_pdf_upload_answer"
on "public"."pdf_upload_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = pdf_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_pdf_upload_answer_table"
on "public"."pdf_upload_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((pdf_upload_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "update_pdf_upload_answer"
on "public"."pdf_upload_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = pdf_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_pdf_upload_question_table"
on "public"."pdf_upload_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."pdf_upload_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_pdf_upload_question_table"
on "public"."pdf_upload_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "select_policy"
on "public"."phase_outcome_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "admin_cmd_phase_table"
on "public"."phase_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."phase_table"
as permissive
for select
to public
using (true);


create policy "admin_cmd_question_table"
on "public"."question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_question_table"
on "public"."question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "select_policy"
on "public"."sections_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "admin_cmd_short_text_answer_table"
on "public"."short_text_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_short_text_answer"
on "public"."short_text_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = short_text_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_short_text_answer"
on "public"."short_text_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = short_text_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_short_text_answer_table"
on "public"."short_text_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((short_text_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "select_short_text_answer"
on "public"."short_text_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = short_text_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "update_short_text_answer"
on "public"."short_text_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = short_text_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_short_text_question_table"
on "public"."short_text_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."short_text_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_short_text_question_table"
on "public"."short_text_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "delete_profile"
on "public"."user_profiles_table"
as permissive
for delete
to public
using ((userid = auth.uid()));


create policy "insert_profile"
on "public"."user_profiles_table"
as permissive
for insert
to public
with check ((userid = auth.uid()));


create policy "select_profile"
on "public"."user_profiles_table"
as permissive
for select
to public
using ((userid = auth.uid()));


create policy "update_profile"
on "public"."user_profiles_table"
as permissive
for update
to public
with check ((userid = auth.uid()));


create policy "admin_cmd_user_roles_table"
on "public"."user_roles_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."user_roles_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_user_roles_table"
on "public"."user_roles_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));


create policy "admin_cmd_video_upload_answer_table"
on "public"."video_upload_answer_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "delete_video_upload_answer"
on "public"."video_upload_answer_table"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = video_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "insert_video_upload_answer"
on "public"."video_upload_answer_table"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = video_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "select_reviewer_video_upload_answer_table"
on "public"."video_upload_answer_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((((user_profiles_table up
     JOIN phase_assignment_table pat ON ((up.userid = pat.user_role_2_id)))
     JOIN answer_table at ON ((video_upload_answer_table.answerid = at.answerid)))
     JOIN question_table qt ON ((at.questionid = qt.questionid)))
     JOIN phase_table pt ON ((qt.phaseid = pt.phaseid)))
  WHERE ((up.userid = auth.uid()) AND (up.userrole = 2) AND (pt.phaseid = pat.phase_id) AND (EXISTS ( SELECT 1
           FROM user_profiles_table up1
          WHERE ((up1.userid = at.applicationid) AND (up1.userrole = 1) AND (pat.user_role_1_id = up1.userid))))))));


create policy "select_video_upload_answer"
on "public"."video_upload_answer_table"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = video_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "update_video_upload_answer"
on "public"."video_upload_answer_table"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM (answer_table
     JOIN application_table ON ((application_table.applicationid = answer_table.applicationid)))
  WHERE ((answer_table.answerid = video_upload_answer_table.answerid) AND (application_table.userid = auth.uid())))));


create policy "admin_cmd_video_upload_question_table"
on "public"."video_upload_question_table"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 3)))));


create policy "select_policy"
on "public"."video_upload_question_table"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "select_reviewer_video_upload_question_table"
on "public"."video_upload_question_table"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles_table
  WHERE ((user_profiles_table.userid = auth.uid()) AND (user_profiles_table.userrole = 2)))));



