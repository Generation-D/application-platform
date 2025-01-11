"use server";

import Logger from "@/logger/logger";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

const log = new Logger("actions/ansers/checkBox");

export async function saveCheckBoxAnswer(checked: boolean, questionid: string) {
  if (!checked) {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("checkbox_answer_table")
        .insert({
          answerid: answerid,
          checked: checked,
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("checkbox_answer_table")
        .update({
          checked: checked,
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        log.error(JSON.stringify(updateAnswerError));
      }
    }
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
): Promise<LongTextAnswerResponse> {
  const supabase = await initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: checkBoxData, error: checkBoxError } = await supabase
    .rpc("fetch_checkbox_answer_table", {
      question_id: questionid,
      user_id: user?.id,
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
