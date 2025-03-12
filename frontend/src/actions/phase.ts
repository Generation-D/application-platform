"use server";

import { RedirectType, redirect } from "next/navigation";

import { DefaultQuestion, Question } from "@/components/questions";
import {
  QuestionType,
  QuestionTypeTable,
} from "@/components/questiontypes/utils/questiontype_selector";
import Logger from "@/logger/logger";
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

type IdType = {
  questionid: string;
  [key: string]: any;
};

const log = new Logger("actions/phase");

export async function fetch_question_type_table(questions: DefaultQuestion[]) {
  const result: Record<QuestionType, any> = {
    [QuestionType.ShortText]: [{}],
    [QuestionType.LongText]: [{}],
    [QuestionType.NumberPicker]: [{}],
    [QuestionType.DatetimePicker]: [{}],
    [QuestionType.DatePicker]: [{}],
    [QuestionType.ImageUpload]: [{}],
    [QuestionType.VideoUpload]: [{}],
    [QuestionType.PDFUpload]: [{}],
    [QuestionType.MultipleChoice]: [{}],
    [QuestionType.Dropdown]: [{}],
    [QuestionType.CheckBox]: [{}],
    [QuestionType.Conditional]: [{}],
  };
  for (const questionType of Object.values(QuestionType)) {
    const tableName =
      QuestionTypeTable[
      `${questionType[0].toUpperCase()}${questionType.slice(
        1,
      )}QuestionTable` as keyof typeof QuestionTypeTable
      ];

    if (!tableName) {
      log.error(
        `Table for question type "${questionType}" is missing. Skipping...`,
      );
      throw Error(
        `Table for question type "${questionType}" is missing. Skipping...`,
      );
    }
    const supabase = await getSupabaseCookiesUtilClient();

    const { data: questionTypeData, error: questionTypeError } = await supabase
      .from(tableName)
      .select("*")
      .in(
        "questionid",
        questions
          .filter((q) => q.questiontype === questionType)
          .map((q) => q.questionid),
      );

    if (questionTypeError) {
      log.error(JSON.stringify(questionTypeError));
      result[questionType] = [{}];
    } else if (questionTypeData) {
      result[questionType] = questionTypeData;
    } else {
      log.debug(`No data found for question type: ${questionType}`);
      result[questionType] = [{}];
    }
  }

  return result;
}

export async function fetchAdditionalParams(
  questiontype: QuestionType,
): Promise<Record<string, any>> {
  let table_name:
    | "multiple_choice_question_choice_table"
    | "dropdown_question_option_table"
    | "conditional_question_choice_table";
  if (questiontype == QuestionType.MultipleChoice) {
    table_name = "multiple_choice_question_choice_table";
  } else if (questiontype == QuestionType.Dropdown) {
    table_name = "dropdown_question_option_table";
  } else if (questiontype == QuestionType.Conditional) {
    table_name = "conditional_question_choice_table";
  } else {
    log.debug(
      `Can't call fetchAdditionalParams() for QuestionType ${questiontype}`,
    );
    return {};
  }
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: paramsData, error } = await supabase
    .from(table_name)
    .select("*");

  if (error) {
    log.error(JSON.stringify(error));
    return {};
  }

  const paramsDict: Record<
    string,
    Array<{
      choiceid?: string;
      choicetext?: string;
      optionid?: string;
      optiontext?: string;
      choicevalue?: string;
    }>
  > = {};

  paramsData?.forEach((param) => {
    if (!paramsDict[param.questionid]) {
      paramsDict[param.questionid] = [];
    }

    if (
      questiontype === QuestionType.MultipleChoice &&
      "choiceid" in param &&
      "choicetext" in param
    ) {
      paramsDict[param.questionid].push({
        choiceid: param.choiceid,
        choicetext: param.choicetext,
      });
    } else if (
      questiontype === QuestionType.Dropdown &&
      "optionid" in param &&
      "optiontext" in param
    ) {
      paramsDict[param.questionid].push({
        optionid: param.optionid,
        optiontext: param.optiontext,
      });
    } else if (
      questiontype === QuestionType.Conditional &&
      "choiceid" in param &&
      "choicevalue" in param
    ) {
      paramsDict[param.questionid].push({
        choiceid: param.choiceid,
        choicevalue: param.choicevalue,
      });
    }
  });
  return paramsDict;
}

async function append_params(
  question_types_questions: any,
  question: DefaultQuestion,
  choicesData: Record<string, string[]>,
  optionsData: Record<string, string[]>,
  conditionalChoicesData: Record<string, string[]>,
) {
  const question_type_questions =
    question_types_questions[question.questiontype];
  const question_type_params =
    question_type_questions!.find(
      (params: IdType) => params.questionid === question.questionid,
    ) || {};
  const { questionid, ...rest } = question_type_params;
  if (question.questiontype === QuestionType.MultipleChoice) {
    rest["choices"] = choicesData[question.questionid];
  } else if (question.questiontype === QuestionType.Dropdown) {
    rest["options"] = optionsData[question.questionid];
  } else if (question.questiontype === QuestionType.Conditional) {
    rest["choices"] = conditionalChoicesData[question.questionid];
  }
  return {
    ...question,
    params: rest,
  };
}

export async function fetch_question_table(
  phaseId: string,
): Promise<Question[]> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: questionData, error: questionError } = await supabase
    .from("question_table")
    .select("*")
    .eq("phaseid", phaseId);

  if (questionError) {
    log.error(JSON.stringify(questionError));
    redirect("/404", RedirectType.replace);
  }

  if (!questionData) {
    log.error(`No questions defined for ${phaseId}`);
    redirect("/404", RedirectType.replace);
  }
  const questionTypesData = await fetch_question_type_table(questionData as DefaultQuestion[]);
  const choicesData = await fetchAdditionalParams(QuestionType.MultipleChoice);
  const optionsData = await fetchAdditionalParams(QuestionType.Dropdown);

  const conditionalChoicesData = await fetchAdditionalParams(
    QuestionType.Conditional,
  );
  const combinedQuestions = questionData.map(
    async (question) => {
      return await append_params(
        questionTypesData,
        question as DefaultQuestion,
        choicesData,
        optionsData,
        conditionalChoicesData,
      );
    },
  );
  const awaitedQuestions = await Promise.all(combinedQuestions);
  const standaloneQuestions = awaitedQuestions.filter(
    (q: Question) => q.depends_on == null,
  );
  const dependingQuestions = awaitedQuestions.filter(
    (q: Question) => q.depends_on != null,
  );
  const finishedQuestions = standaloneQuestions.map((question: Question) => {
    if (question.questiontype != QuestionType.Conditional) {
      return question;
    }
    question.params.choices.map((choice: Record<string, any>) => {
      choice["questions"] = dependingQuestions.filter(
        (q: Question) => q.depends_on == choice.choiceid,
      );
      return choice;
    });
    return question;
  });

  return finishedQuestions as Question[];
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

export async function fetch_phases_status(): Promise<PhaseOutcome[]> {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const all_phases = await fetch_all_phases();
  const { data, error } = await supabase
    .from("phase_outcome_table")
    .select("outcome_id, outcome, review_date, phase_id")
    .eq("user_id", user.id);
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
