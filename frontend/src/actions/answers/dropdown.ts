"use server";

import {logger} from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

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
        logger.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("dropdown_answer_table")
        .update({
          selectedoptions: answertext,
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        logger.error(JSON.stringify(updateAnswerError));
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
  applicationid: string
): Promise<DropdownAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: dropdownData, error: dropdownError } = await supabase
    .rpc("fetch_dropdown_answer_table", {
      question_id: questionid,
      application_id: applicationid
    })
    .single<DropdownAnswerResponse>();
  if (dropdownError) {
    if (dropdownError.code == "PGRST116") {
      return initialstate;
    }
    logger.error(JSON.stringify(dropdownError));
  }
  return dropdownData || initialstate;
}
