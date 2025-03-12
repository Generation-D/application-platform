"use server";

import Logger from "@/logger/logger";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

const log = new Logger("actions/answers/dropdown");

export async function saveDropdownAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "" || answertext == "empty" || answertext == "invalid") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("dropdown_answer_table")
        .insert({
          answerid: answerid,
          selectedoptions: answertext,
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("dropdown_answer_table")
        .update({
          selectedoptions: answertext,
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        log.error(JSON.stringify(updateAnswerError));
      }
    }
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
): Promise<DropdownAnswerResponse> {
  const supabase = await initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: dropdownData, error: dropdownError } = await supabase
    .rpc("fetch_dropdown_answer_table", {
      question_id: questionid,
      user_id: user?.id,
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
