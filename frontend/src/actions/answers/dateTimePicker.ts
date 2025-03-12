"use server";
import Logger from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = new Logger("actions/answers/dateTimePicker");

export async function saveDateTimePickerAnswer(
  pickeddatetime: string,
  questionid: string,
) {
  if (pickeddatetime == "" || pickeddatetime == "Invalid date") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("datetime_picker_answer_table")
        .insert({
          answerid: answerid,
          pickeddatetime: new Date(pickeddatetime),
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "update") {
      const { error: updateAnswerError } = await supabase
        .from("datetime_picker_answer_table")
        .update({
          pickeddatetime: new Date(pickeddatetime),
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        log.error(JSON.stringify(updateAnswerError));
      }
    }
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

export async function fetchDateTimePickerAnswer(questionid: string) {
  const supabase = await getSupabaseCookiesUtilClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: dateTimePickerData, error: dateTimePickerError } =
    await supabase
      .rpc("fetch_datetime_picker_answer_table", {
        question_id: questionid,
        user_id: user?.id ?? "",
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
