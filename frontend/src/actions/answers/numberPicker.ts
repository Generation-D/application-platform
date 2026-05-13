"use server";
import {logger} from "@/logger/logger";

import { deleteAnswer, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";


export async function saveNumberPickerAnswer(
  pickednumber: string,
  questionid: string,
) {
  if (pickednumber == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("number_picker_answer_table")
        .insert({
          answerid: answerid,
          pickednumber: Number(pickednumber),
        });
      if (insertAnswerError) {
        logger.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("number_picker_answer_table")
        .update({
          pickednumber: pickednumber,
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        logger.error(JSON.stringify(updateAnswerError));
      }
    }
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
  applicationid: string
): Promise<NumberPickerAnswerResponse> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: numberPickerData, error: numberPickerError } = await supabase
    .rpc("fetch_number_picker_answer_table", {
      question_id: questionid,
      application_id: applicationid
    })
    .single<NumberPickerAnswerResponse>();
  if (numberPickerError) {
    if (numberPickerError.code == "PGRST116") {
      return initialstate;
    }
    logger.error(JSON.stringify(numberPickerError));
  }
  return numberPickerData || initialstate;
}
