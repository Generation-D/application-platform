"use server";

import { RedirectType, redirect } from "next/navigation";

import { BaseQuestion, Question, QuestionOfType } from "@/components/questions";
import {
  QuestionType,
  QuestionTypesTable,
} from "@/components/questiontypes/utils/questiontype_selector";
const log = createLogger("actions/phase");
import { PhaseData, SectionData } from "@/store/slices/phaseSlice";
import {
  createCurrentTimestamp,
  setToPrefferedTimeZone,
} from "@/utils/helpers";

import {
  getApplicationIdOfCurrentUser,
  getCurrentUser,
} from "./answers/answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

import { createLogger } from "@/logger/logger";
import { ShortTextQuestionTypeExtraProps } from "@/components/questiontypes/shorttext_questiontype";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { MultipleChoiceQuestionTypeExtraProps } from "@/components/questiontypes/multiplechoice_questiontype";

type QuestionData = Database["public"]["Tables"]["question_table"]["Row"];

function mapBaseQuestion(questionData: QuestionData) {
  return {
    questionid: questionData.questionid,
    questionorder: questionData.questionorder,
    // questionsuborder?: string;
    mandatory: questionData.mandatory,
    questiontext: questionData.questiontext,
    questionnote: questionData.questionnote || "",
    sectionid: questionData.sectionid,
    preinformationbox: questionData.preinformationbox,
    postinformationbox: questionData.postinformationbox,
    // selectedSection: string | null;
    selectedSection: null,
    // selectedCondChoice: string | null;
    selectedCondChoice: null,
    depends_on: questionData.depends_on,
  };
}

async function getShortTextQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<
  BaseQuestion<QuestionType.ShortText, ShortTextQuestionTypeExtraProps>[]
> {
  const { data: ShortTextquestionData, error: ShortTextquestionDataError } =
    await supabase
      .from("question_table")
      .select(
        `*, ${QuestionTypesTable[QuestionType.ShortText]}!inner(*), answer_table(answerid)`,
      )
      .eq("phaseid", phaseId);

  if (ShortTextquestionDataError) {
    throw new Error("failed to load short text questions");
  }

  return ShortTextquestionData.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.ShortText,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        maxtextlength: questionData.short_text_question_table.maxtextlength,
        formattingregex: questionData.short_text_question_table.formattingregex,
        formattingdescription:
          questionData.short_text_question_table.formattingdescription,
      },
    };
  });
}

async function getLongTextQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.LongText>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `*, ${QuestionTypesTable[QuestionType.LongText]}!inner(*), answer_table(answerid)`,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to load long text questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.LongText,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        maxtextlength: questionData.long_text_question_table.maxtextlength,
      },
    };
  });
}

async function getNumberPickerQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.NumberPicker>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `*, ${QuestionTypesTable[QuestionType.NumberPicker]}!inner(*), answer_table(answerid)`,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to load numberpicker questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.NumberPicker,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        minnumber: questionData.number_picker_question_table.minnumber,
        maxnumber: questionData.number_picker_question_table.maxnumber,
      },
    };
  });
}

async function getDateTimePickerQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.DatetimePicker>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `*, ${QuestionTypesTable[QuestionType.DatetimePicker]}!inner(*), answer_table(answerid)`,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to load numberpicker questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.DatetimePicker,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        mindatetime: new Date(
          questionData.datetime_picker_question_table.mindatetime,
        ),
        maxdatetime: new Date(
          questionData.datetime_picker_question_table.maxdatetime,
        ),
      },
    };
  });
}

async function getDatePickerQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.DatePicker>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `*, ${QuestionTypesTable[QuestionType.DatePicker]}!inner(*), answer_table(answerid)`,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to load numberpicker questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.DatePicker,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        mindate: new Date(questionData.date_picker_question_table.mindate),
        maxdate: new Date(questionData.date_picker_question_table.maxdate),
      },
    };
  });
}

async function getImageUploadQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.ImageUpload>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `*, ${QuestionTypesTable[QuestionType.ImageUpload]}!inner(*), answer_table(answerid)`,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to load numberpicker questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.ImageUpload,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        maxfilesizeinmb:
          questionData.image_upload_question_table.maxfilesizeinmb,
      },
    };
  });
}

async function getVideoUploadQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.VideoUpload>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `*, ${QuestionTypesTable[QuestionType.VideoUpload]}!inner(*), answer_table(answerid)`,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to load video upload questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.VideoUpload,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        maxfilesizeinmb:
          questionData.video_upload_question_table.maxfilesizeinmb,
      },
    };
  });
}

async function getPdfUploadQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.PDFUpload>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `*, ${QuestionTypesTable[QuestionType.PDFUpload]}!inner(*), answer_table(answerid)`,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to pdf upload questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.PDFUpload,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        maxfilesizeinmb: questionData.pdf_upload_question_table.maxfilesizeinmb,
      },
    };
  });
}

async function getCheckBoxQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.CheckBox>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `*, ${QuestionTypesTable[QuestionType.CheckBox]}!inner(*), answer_table(answerid)`,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to checkbox upload questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.CheckBox,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
      },
    };
  });
}

async function getMultipleChoiceQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<
  BaseQuestion<
    QuestionType.MultipleChoice,
    MultipleChoiceQuestionTypeExtraProps
  >[]
> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `
    *,
    multiple_choice_question_table!inner(
      *,
      multiple_choice_question_choice_table(*)
    ),
    answer_table(answerid)
  `,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to load multiple choice questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.MultipleChoice,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        choices:
          questionData.multiple_choice_question_table
            .multiple_choice_question_choice_table,
        minanswers: questionData.multiple_choice_question_table.minanswers,
        maxanswers: questionData.multiple_choice_question_table.maxanswers,
        userinput: questionData.multiple_choice_question_table.userinput,
      },
    };
  });
}

async function getDropdownQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.Dropdown>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `
    *,
    ${QuestionTypesTable[QuestionType.Dropdown]}!inner(
      *,
      dropdown_question_option_table(*)
    ),
    answer_table(answerid)
  `,
    )
    .eq("phaseid", phaseId);

  if (error) {
    throw new Error("failed to load dropdown questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.Dropdown,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        options:
          questionData.dropdown_question_table.dropdown_question_option_table,
        minanswers: questionData.dropdown_question_table.maxanswers,
        maxanswers: questionData.dropdown_question_table.minanswers,
        userinput: questionData.dropdown_question_table.userinput,
      },
    };
  });
}

async function getConditionalQuestion(
  supabase: SupabaseClient<Database>,
  phaseId: string,
): Promise<QuestionOfType<QuestionType.Conditional>[]> {
  const { data, error } = await supabase
    .from("question_table")
    .select(
      `
    *,
    conditional_question_choice_table(*),
    answer_table(answerid)
  `,
    )
    .eq("phaseid", phaseId)
    .eq("questiontype", QuestionType.Conditional);

  if (error) {
    throw new Error("failed to load conditional questions");
  }

  return data.map((questionData) => {
    return {
      phaseid: phaseId,
      ...mapBaseQuestion(questionData),
      questiontype: QuestionType.Conditional,
      params: {
        answerid: questionData.answer_table[0]?.answerid,
        choices: questionData.conditional_question_choice_table.map((c) => ({
          choiceid: c.choiceid,
          choicevalue: c.choicevalue,
          questions: [],
        })),
        phaseAnswers: [],
      },
    };
  });
}

export async function fetch_question_table(
  phaseId: string,
): Promise<Question[]> {
  const supabase = await getSupabaseCookiesUtilClient();
  const awaitedQuestions = (
    await Promise.all([
      getShortTextQuestion(supabase, phaseId),
      getLongTextQuestion(supabase, phaseId),
      getNumberPickerQuestion(supabase, phaseId),
      getDateTimePickerQuestion(supabase, phaseId),
      getDatePickerQuestion(supabase, phaseId),
      getImageUploadQuestion(supabase, phaseId),
      getVideoUploadQuestion(supabase, phaseId),
      getPdfUploadQuestion(supabase, phaseId),
      getCheckBoxQuestion(supabase, phaseId),
      getMultipleChoiceQuestion(supabase, phaseId),
      getDropdownQuestion(supabase, phaseId),
      getConditionalQuestion(supabase, phaseId),
    ])
  ).flat();

  // if (questionError) {
  //   log.error(JSON.stringify(questionError));
  //   redirect("/404", RedirectType.replace);
  // }

  if (awaitedQuestions.length === 0) {
    log.error(`No questions defined for ${phaseId}`);
    redirect("/404", RedirectType.replace);
  }

  const standaloneQuestions = awaitedQuestions.filter(
    (q) => q.depends_on == null,
  );
  const dependingQuestions = awaitedQuestions.filter(
    (q) => q.depends_on != null,
  );
  const finishedQuestions: Question[] = standaloneQuestions.map((question) => {
    if (question.questiontype !== QuestionType.Conditional) {
      return question;
    }

    return {
      ...question,
      params: {
        ...question.params,
        choices: question.params.choices.map((choice) => {
          return {
            questions: dependingQuestions.filter(
              (q) => q.depends_on == choice.choiceid,
            ),
            choiceid: choice.choiceid,
            choicevalue: choice.choicevalue,
          };
        }),
      },
    } satisfies QuestionOfType<QuestionType.Conditional>;
  });

  return finishedQuestions;
}

export async function fetch_conditional_questionid_mapping() {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: conditionalData, error: conditionalError } = await supabase
    .from("conditional_question_choice_table")
    .select("*");
  if (conditionalError) {
    log.error(JSON.stringify(conditionalError));
    return {} as Record<string, string[]>;
  }
  return conditionalData?.reduce(
    (
      acc: Record<string, string>,
      question: { choiceid: string; questionid: string; choicevalue: string },
    ) => {
      acc[question.choiceid] = question.questionid;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export async function fetch_phase_by_name(
  phaseName: string,
): Promise<PhaseData> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: phaseData, error: phaseError } = await supabase
    .from("phase_table")
    .select("*")
    .eq("phasename", phaseName)
    .single();
  // Redirection if error
  if (phaseError) {
    log.error(JSON.stringify(phaseError));
    redirect("/", RedirectType.replace);
  }
  // Redirection if no phaseName
  if (!phaseData) {
    log.debug("No PhaseData -> Redirect to Overview");
    redirect("/", RedirectType.replace);
  }
  phaseData.startdate = setToPrefferedTimeZone(phaseData.startdate);
  phaseData.enddate = setToPrefferedTimeZone(phaseData.enddate);
  return phaseData;
}

export async function fetch_all_phases(): Promise<PhaseData[]> {
  const supabase = await getSupabaseCookiesUtilClient();

  const { data: phasesData, error: phasesError } = await supabase
    .from("phase_table")
    .select("*");
  if (phasesError) {
    log.error(JSON.stringify(phasesError, null, 2));
  }
  if (!phasesData) {
    log.warn("No Phases found");
  }

  return (
    phasesData?.map((phase) => ({
      ...phase,
      startdate: setToPrefferedTimeZone(phase.startdate),
      enddate: setToPrefferedTimeZone(phase.enddate),
    })) || []
  );
}

export async function extractCurrentPhase(
  currentTime: Date,
): Promise<PhaseData> {
  const phasesData = await fetch_all_phases();
  const sortedPhases = phasesData!.sort((a, b) => a.phaseorder - b.phaseorder);

  let previous_phase: PhaseData;
  previous_phase = {
    phaseid: "",
    phasename: "",
    phaselabel: "",
    phaseorder: -1,
    startdate: "",
    enddate: "",
    sectionsenabled: false,
    finished_evaluation: "",
  };
  for (const phase of sortedPhases) {
    const startDate = new Date(phase.startdate);
    const endDate = new Date(phase.enddate);
    if (currentTime < startDate) {
      return previous_phase;
    } else if (currentTime >= startDate && currentTime <= endDate) {
      return phase;
    }
    previous_phase = phase;
  }
  return previous_phase;
}

export async function fetch_answer_table(
  questionIds: string[],
): Promise<number> {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);

  const { data: answerData, error: answerError } = await supabase
    .from("answer_table")
    .select("answerid")
    .in("questionid", questionIds)
    .eq("applicationid", applicationid);

  if (answerError) {
    log.error(JSON.stringify(answerError));
  }

  return answerData ? answerData.length : 0;
}

export async function fetch_first_phase_over(): Promise<boolean> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: phaseData, error: phaseError } = await supabase
    .from("phase_table")
    .select("enddate")
    .eq("phaseorder", 0)
    .single();

  if (phaseError) {
    log.error(JSON.stringify(phaseError, null, 2));
    return true;
  }

  if (!phaseData) {
    log.debug("No PhaseData found");
    return true;
  }
  const currentDate = new Date(createCurrentTimestamp());
  const endDate = new Date(setToPrefferedTimeZone(phaseData!.enddate));
  return currentDate < endDate;
}

export async function fetch_sections_by_phase(
  phaseId: string,
): Promise<SectionData[]> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: sectionsData, error: sectionsError } = await supabase
    .from("sections_table")
    .select("*")
    .eq("phaseid", phaseId);
  if (sectionsError) {
    log.error(JSON.stringify(sectionsError));
  }
  if (!sectionsData) {
    log.debug("No sectionsData found");
  }
  return sectionsData as SectionData[];
}

export type PhaseOutcome = {
  outcome_id: string;
  outcome: boolean;
  review_date: string;
  phase: {
    phaseid: string;
    phasename: string;
    phaselabel: string;
    phaseorder: number;
    startdate: string;
    enddate: string;
    finished_evaluation: string;
  };
};

export async function fetch_phases_status(
  userId?: string,
): Promise<PhaseOutcome[]> {
  const supabase = await getSupabaseCookiesUtilClient();
  if (!userId) {
    const user = await getCurrentUser(supabase);
    userId = user.id;
  }

  const all_phases = await fetch_all_phases();
  const { data, error } = await supabase
    .from("phase_outcome_table")
    .select("outcome_id, outcome, review_date, phase_id")
    .eq("user_id", userId);
  if (error) {
    log.error(JSON.stringify(error));
  }
  const transformedData = data?.map((item) => {
    const matchingPhase = all_phases.find(
      (phaseToFind) => phaseToFind.phaseid == item.phase_id,
    )!;
    return {
      ...item,
      phase: {
        ...matchingPhase,
      },
    };
  });

  transformedData?.sort((a, b) => a.phase?.phaseorder - b.phase?.phaseorder);
  return (transformedData as PhaseOutcome[]) || [];
}
