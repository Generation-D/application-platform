"use server";

import { logger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

export async function saveMultipleChoiceAnswer(
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
        .from("multiple_choice_answer_table")
        .insert({
          answerid: answerid,
          selectedchoice: answertext,
        });
      if (insertAnswerError) {
        logger.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("multiple_choice_answer_table")
        .update({
          selectedchoice: answertext,
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        logger.error(JSON.stringify(updateAnswerError));
      }
    }
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
    logger.error(JSON.stringify(multipleChoiceError));
  }
  return multipleChoiceData || initialstate;
}
