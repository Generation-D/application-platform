"use server";

import Logger from "@/logger/logger";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

const log = new Logger("actions/ansers/conditional");

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

export async function fetchConditionalAnswer(questionid: string) {
  const supabase = await initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: conditionalTextData, error: conditionalTextError } =
    await supabase
      .rpc("fetch_conditional_answer_table", {
        question_id: questionid,
        user_id: user?.id,
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
