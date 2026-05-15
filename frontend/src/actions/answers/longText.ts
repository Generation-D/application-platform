"use server";
import { logger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

export async function saveLongTextAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid);
    return "";
  }
  const { supabase, answerid, reqtype } = await saveAnswer(questionid);
  if (reqtype == "created") {
    const { error: insertAnswerError } = await supabase
      .from("long_text_answer_table")
      .insert({
        answerid: answerid,
        answertext: answertext,
      });
    if (insertAnswerError) {
      logger.error(JSON.stringify(insertAnswerError));
    }
  } else if (reqtype == "updated") {
    const { error: updateAnswerError } = await supabase
      .from("long_text_answer_table")
      .update({
        answertext: answertext,
      })
      .eq("answerid", answerid);
    if (updateAnswerError) {
      logger.error(JSON.stringify(updateAnswerError));
    }
  }
  return answerid;
}

interface LongTextAnswerResponse {
  answerid: string;
  answertext: string;
}

const initialstate: LongTextAnswerResponse = {
  answerid: "",
  answertext: "",
};

export async function fetchLongTextAnswer(
  questionid: string,
  applicationid: string,
): Promise<LongTextAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: longTextData, error: longTextError } = await supabase
    .rpc("fetch_long_text_answer_table", {
      question_id: questionid,
      application_id: applicationid,
    })
    .single<LongTextAnswerResponse>();
  if (longTextError) {
    if (longTextError.code == "PGRST116") {
      return initialstate;
    }
    logger.error(JSON.stringify(longTextError));
  }
  return longTextData || initialstate;
}
