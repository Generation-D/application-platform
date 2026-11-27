"use server";

import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/shortText");

export async function saveShortTextAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid } = await saveAnswer(questionid);
    const { error } = await supabase.from("short_text_answer_table").upsert(
      {
        answerid: answerid,
        answertext: answertext,
      },
      { onConflict: "answerid" },
    );
    throwIfSaveFailed(error, log);
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
  applicationid: string,
): Promise<ShortTextAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: shortTextData, error: shortTextError } = await supabase
    .rpc("fetch_short_text_answer_table", {
      question_id: questionid,
      application_id: applicationid,
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
