"use server";
import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/longText");

export async function saveLongTextAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid);
    return "";
  }
  const { supabase, answerid } = await saveAnswer(questionid);
  const { error } = await supabase.from("long_text_answer_table").upsert(
    {
      answerid: answerid,
      answertext: answertext,
    },
    { onConflict: "answerid" },
  );
  throwIfSaveFailed(error, log);
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
    log.error(JSON.stringify(longTextError));
  }
  return longTextData || initialstate;
}
