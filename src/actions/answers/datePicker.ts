"use server";
import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/datePicker");

export async function saveDatePickerAnswer(
  pickeddate: string,
  questionid: string,
) {
  if (pickeddate == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid } = await saveAnswer(questionid);
    const { error } = await supabase.from("date_picker_answer_table").upsert(
      {
        answerid: answerid,
        pickeddate: new Date(pickeddate),
      },
      { onConflict: "answerid" },
    );
    throwIfSaveFailed(error, log);
  }
}

interface DateAnswerResponse {
  answerid: string;
  pickeddate: string;
}

const initialstate: DateAnswerResponse = {
  answerid: "",
  pickeddate: "",
};

export async function fetchDatePickerAnswer(
  questionid: string,
  applicationid: string,
) {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: datePickerData, error: datePickerError } = await supabase
    .rpc("fetch_date_picker_answer_table", {
      question_id: questionid,
      application_id: applicationid,
    })
    .single<DateAnswerResponse>();
  if (datePickerError) {
    if (datePickerError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(datePickerError));
  }
  return datePickerData || initialstate;
}
