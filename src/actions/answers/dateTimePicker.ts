"use server";
import { createLogger } from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { throwIfSaveFailed } from "./saveErrors";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = createLogger("actions/answers/dateTimePicker");

export async function saveDateTimePickerAnswer(
  pickeddatetime: string,
  questionid: string,
) {
  if (pickeddatetime == "" || pickeddatetime == "Invalid date") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid } = await saveAnswer(questionid);
    const { error } = await supabase
      .from("datetime_picker_answer_table")
      .upsert(
        {
          answerid: answerid,
          pickeddatetime: new Date(pickeddatetime),
        },
        { onConflict: "answerid" },
      );
    throwIfSaveFailed(error, log);
  }
}

interface DateTimeAnswerResponse {
  answerid: string;
  pickeddatetime: string;
}

const initialstate: DateTimeAnswerResponse = {
  answerid: "",
  pickeddatetime: "",
};

export async function fetchDateTimePickerAnswer(
  questionid: string,
  applicationid: string,
) {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: dateTimePickerData, error: dateTimePickerError } =
    await supabase
      .rpc("fetch_datetime_picker_answer_table", {
        question_id: questionid,
        application_id: applicationid,
      })
      .single<DateTimeAnswerResponse>();
  if (dateTimePickerError) {
    if (dateTimePickerError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(dateTimePickerError));
  }
  return dateTimePickerData || initialstate;
}
