"use server";

import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/dropdown");

export async function saveDropdownAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "" || answertext == "empty" || answertext == "invalid") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid } = await saveAnswer(questionid);
    const { error } = await supabase.from("dropdown_answer_table").upsert(
      {
        answerid: answerid,
        selectedoptions: answertext,
      },
      { onConflict: "answerid" },
    );
    throwIfSaveFailed(error, log);
  }
}

interface DropdownAnswerResponse {
  answerid: string;
  selectedoptions: string;
}

const initialstate: DropdownAnswerResponse = {
  answerid: "",
  selectedoptions: "",
};

export async function fetchDropdownAnswer(
  questionid: string,
  applicationid: string,
): Promise<DropdownAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: dropdownData, error: dropdownError } = await supabase
    .rpc("fetch_dropdown_answer_table", {
      question_id: questionid,
      application_id: applicationid,
    })
    .single<DropdownAnswerResponse>();
  if (dropdownError) {
    if (dropdownError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(dropdownError));
  }
  return dropdownData || initialstate;
}
