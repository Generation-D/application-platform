"use server";

import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/conditional");

export async function saveConditionalAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid } = await saveAnswer(questionid);
    const { error } = await supabase.from("conditional_answer_table").upsert(
      {
        answerid: answerid,
        selectedchoice: answertext,
      },
      { onConflict: "answerid" },
    );
    throwIfSaveFailed(error, log);
  }
}

interface ConditionalAnswerResponse {
  answerid: string;
  selectedchoice: string;
}

const initialstate: ConditionalAnswerResponse = {
  answerid: "",
  selectedchoice: "",
};

export async function fetchConditionalAnswer(
  questionid: string,
  applicationid: string,
) {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: conditionalTextData, error: conditionalTextError } =
    await supabase
      .rpc("fetch_conditional_answer_table", {
        question_id: questionid,
        application_id: applicationid,
      })
      .single<ConditionalAnswerResponse>();
  if (conditionalTextError) {
    if (conditionalTextError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(conditionalTextError));
  }
  return conditionalTextData || initialstate;
}
