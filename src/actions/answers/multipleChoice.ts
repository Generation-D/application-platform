"use server";

import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/multipleChoice");

export async function saveMultipleChoiceAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid } = await saveAnswer(questionid);
    const { error } = await supabase
      .from("multiple_choice_answer_table")
      .upsert(
        {
          answerid: answerid,
          selectedchoice: answertext,
        },
        { onConflict: "answerid" },
      );
    throwIfSaveFailed(error, log);
  }
}

interface MultipleChoiceAnswerResponse {
  answerid: string;
  selectedchoice: string;
}

const initialstate: MultipleChoiceAnswerResponse = {
  answerid: "",
  selectedchoice: "",
};

export async function fetchMultipleChoiceAnswer(
  questionid: string,
  applicationid: string,
): Promise<MultipleChoiceAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: multipleChoiceData, error: multipleChoiceError } =
    await supabase
      .rpc("fetch_multiple_choice_answer_table", {
        question_id: questionid,
        application_id: applicationid,
      })
      .single<MultipleChoiceAnswerResponse>();
  if (multipleChoiceError) {
    if (multipleChoiceError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(multipleChoiceError));
  }
  return multipleChoiceData || initialstate;
}
