"use server";

import { createLogger } from "@/logger/logger"; 
const log = createLogger("actions/answers/conditional");

import { deleteAnswer, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

export async function saveConditionalAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("conditional_answer_table")
        .insert({
          answerid: answerid,
          selectedchoice: answertext,
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("conditional_answer_table")
        .update({
          selectedchoice: answertext,
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        log.error(JSON.stringify(updateAnswerError));
      }
    }
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
