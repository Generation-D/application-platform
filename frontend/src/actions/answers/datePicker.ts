"use server";
import { initSupabaseActions } from "@/utils/supabaseServerClients";
import {
  deleteAnswer,
  fetchAnswerId,
  getApplicationIdOfCurrentUser,
  getCurrentUser,
  saveAnswer,
} from "./answers";

export async function saveDatePickerAnswer(
  pickeddate: string,
  questionid: string,
) {
  if (pickeddate == "") {
    await deleteAnswer(questionid, "date_picker_answer_table");
    return;
  } else {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertDatePickerAnswerResponse = await supabase
        .from("date_picker_answer_table")
        .insert({
          answerid: answerid,
          pickeddate: new Date(pickeddate),
        });
      if (insertDatePickerAnswerResponse) {
        console.log(insertDatePickerAnswerResponse);
      }
    } else if (reqtype == "updated") {
      const updateDatePickerAnswerResponse = await supabase
        .from("date_picker_answer_table")
        .update({
          pickeddate: new Date(pickeddate),
        })
        .eq("answerid", answerid);
      if (updateDatePickerAnswerResponse) {
        console.log(updateDatePickerAnswerResponse);
      }
    }
  }
}

export async function fetchDatePickerAnswer(answerid: string) {
  const supabase = initSupabaseActions();
  if (answerid) {
    const { data: datePickerData, error: datePickerError } = await supabase
      .from("date_picker_answer_table")
      .select("pickeddate")
      .eq("answerid", answerid)
      .single();
    return datePickerData!.pickeddate;
  }
  return "";
}
