"use server";

import Logger from "@/logger/logger";
import { initSupabase } from "@/utils/supabaseServerClients";

import { deleteAnswer, saveAnswer } from "./answers";

const log = new Logger("actions/answers/multipleChoice");

export async function saveMultipleChoiceAnswer(
  answertext: string,
  questionid: string,
) {
  if (answertext == "") {
    await deleteAnswer(questionid);
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("multiple_choice_answer_table")
        .insert({
          answerid: answerid,
          selectedchoice: answertext,
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
    } else if (reqtype == "updated") {
      const { error: updateAnswerError } = await supabase
        .from("multiple_choice_answer_table")
        .update({
          selectedchoice: answertext,
        })
        .eq("answerid", answerid);
      if (updateAnswerError) {
        log.error(JSON.stringify(updateAnswerError));
      }
    }
  }
}

interface MultipleChoiceAnswerResponse {
  answerid: string;
  selectedchoice: string;
}

const initialstate: MultipleChoiceAnswerResponse = {
  answerid: "",
  selectedchoice: "",
};

export async function fetchMultipleChoiceAnswer(
  questionid: string,
): Promise<MultipleChoiceAnswerResponse> {
  const supabase = await initSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: multipleChoiceData, error: multipleChoiceError } =
    await supabase
      .rpc("fetch_multiple_choice_answer_table", {
        question_id: questionid,
        user_id: user?.id,
      })
      .single<MultipleChoiceAnswerResponse>();
  if (multipleChoiceError) {
    if (multipleChoiceError.code == "PGRST116") {
      return initialstate;
    }
    log.error(JSON.stringify(multipleChoiceError));
  }
  return multipleChoiceData || initialstate;
}
