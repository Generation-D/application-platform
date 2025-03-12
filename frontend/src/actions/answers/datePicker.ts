"use server";
import Logger from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = new Logger("actions/ansers/datePicker");

export async function saveDatePickerAnswer(
  pickeddate: string,
  questionid: string,
) {
  if (pickeddate == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("date_picker_answer_table")
        .insert({
          answerid: answerid,
          pickeddate: new Date(pickeddate),
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("date_picker_answer_table")
        .update({
          pickeddate: new Date(pickeddate),
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        log.error(JSON.stringify(updateAnswerError));
      }
    }
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

export async function fetchDatePickerAnswer(questionid: string) {
  const supabase = await getSupabaseCookiesUtilClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: datePickerData, error: datePickerError } = await supabase
    .rpc("fetch_date_picker_answer_table", {
      question_id: questionid,
      user_id: user?.id,
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
