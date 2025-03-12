"use server";

import Logger from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = new Logger("actions/ansers/shortText");

export async function saveShortTextAnswer(
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
        .from("short_text_answer_table")
        .insert({
          answerid: answerid,
          answertext: answertext,
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("short_text_answer_table")
        .update({
          answertext: answertext,
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        log.error(JSON.stringify(updateAnswerError));
      }
    }
  }
}

interface ShortTextAnswerResponse {
  answerid: string;
  answertext: string;
}

const initialstate: ShortTextAnswerResponse = {
  answerid: "",
  answertext: "",
};

export async function fetchShortTextAnswer(
  questionid: string,
): Promise<ShortTextAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: shortTextData, error: shortTextError } = await supabase
    .rpc("fetch_short_text_answer_table", {
      question_id: questionid,
      user_id: user?.id,
    })
    .single<ShortTextAnswerResponse>();
  if (shortTextError) {
    if (shortTextError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(shortTextError));
  }
  return shortTextData || initialstate;
}
