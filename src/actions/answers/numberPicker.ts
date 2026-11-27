"use server";
import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/numberPicker");

export async function saveNumberPickerAnswer(
  pickednumber: string,
  questionid: string,
) {
  if (pickednumber == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid } = await saveAnswer(questionid);
    const { error } = await supabase.from("number_picker_answer_table").upsert(
      {
        answerid: answerid,
        pickednumber: Number(pickednumber),
      },
      { onConflict: "answerid" },
    );
    throwIfSaveFailed(error, log);
  }
}

interface NumberPickerAnswerResponse {
  answerid: string;
  pickednumber: string;
}

const initialstate: NumberPickerAnswerResponse = {
  answerid: "",
  pickednumber: "",
};

export async function fetchNumberPickerAnswer(
  questionid: string,
  applicationid: string,
): Promise<NumberPickerAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: numberPickerData, error: numberPickerError } = await supabase
    .rpc("fetch_number_picker_answer_table", {
      question_id: questionid,
      application_id: applicationid,
    })
    .single<NumberPickerAnswerResponse>();
  if (numberPickerError) {
    if (numberPickerError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(numberPickerError));
  }
  return numberPickerData || initialstate;
}
