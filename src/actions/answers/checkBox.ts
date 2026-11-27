"use server";

import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/checkBox");

export async function saveCheckBoxAnswer(checked: boolean, questionid: string) {
  if (!checked) {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid } = await saveAnswer(questionid);
    const { error } = await supabase.from("checkbox_answer_table").upsert(
      {
        answerid: answerid,
        checked: checked,
      },
      { onConflict: "answerid" },
    );
    throwIfSaveFailed(error, log);
  }
}

interface LongTextAnswerResponse {
  answerid: string;
  checked: boolean;
}

const initialstate: LongTextAnswerResponse = {
  answerid: "",
  checked: false,
};

export async function fetchCheckBoxAnswer(
  questionid: string,
  applicationid: string,
): Promise<LongTextAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: checkBoxData, error: checkBoxError } = await supabase
    .rpc("fetch_checkbox_answer_table", {
      question_id: questionid,
      application_id: applicationid,
    })
    .single<LongTextAnswerResponse>();
  if (checkBoxError) {
    if (checkBoxError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(checkBoxError));
  }
  return checkBoxData || initialstate;
}
