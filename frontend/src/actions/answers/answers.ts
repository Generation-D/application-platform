"use server";

import { createCurrentTimestamp } from "@/utils/helpers";
import { createServerClient } from "@supabase/ssr";
import { SupabaseClient, User, UserResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface saveAnswerType {
  supabase: SupabaseClient;
  answerid: string;
  reqtype: string;
}

export async function setupSupabaseClient(): Promise<SupabaseClient> {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
  return supabase;
}

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.log(userError);
    redirect("/");
  }
  return userData.user;
}

export async function getApplicationIdOfCurrentUser(
  supabase: SupabaseClient,
  user: User,
) {
  const { data: applicationData, error: applicationError } = await supabase
    .from("application_table")
    .select("applicationid")
    .eq("userid", user.id)
    .single();
  if (applicationError) {
    console.log(applicationError);
  }
  return applicationData?.applicationid;
}

export async function fetchAnswerId(
  supabase: SupabaseClient,
  user: User,
  applicationid: string,
  questionid: string,
) {
  const { data: answerData, error: answerError } = await supabase
    .from("answer_table")
    .select("answerid")
    .eq("questionid", questionid)
    .eq("applicationid", applicationid);

  if (answerError) {
    console.log(answerError);
  }
  if (answerData!.length == 0) {
    return "";
  }
  return answerData![0].answerid;
}

export async function saveAnswer(questionid: string): Promise<saveAnswerType> {
  const supabase = await setupSupabaseClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  const now = createCurrentTimestamp();

  let reqtype = "";
  if (answerid == "") {
    const insertAnswerResponse = await supabase.from("answer_table").insert({
      questionid: questionid,
      applicationid: applicationid,
      created: now,
      lastupdated: now,
    });

    if (insertAnswerResponse) {
      console.log(insertAnswerResponse);
    }

    const selectAnswerResponse = await supabase
      .from("answer_table")
      .select("answerid")
      .eq("applicationid", applicationid)
      .eq("questionid", questionid)
      .single();

    if (selectAnswerResponse) {
      console.log(selectAnswerResponse);
    }
    answerid = selectAnswerResponse!.data!.answerid;
    reqtype = "created";
  } else {
    reqtype = "updated";
  }

  return { supabase: supabase, answerid: answerid, reqtype: reqtype };
}

export async function deleteAnswer(questionid: string, answertype: string) {
  const supabase = await setupSupabaseClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  console.log(answerid);
  if (answerid != "") {
    const deleteAnswerResponse = await supabase
      .from("answer_table")
      .delete()
      .eq("questionid", questionid)
      .eq("applicationid", applicationid);
    console.log(deleteAnswerResponse);
    const deleteAnswerTypeResponse = await supabase
      .from(answertype)
      .delete()
      .eq("answerid", answerid);
    console.log(deleteAnswerTypeResponse);
  }
}

export async function saveDatePickerAnswer(
  pickeddate: Date,
  questionid: string,
) {
  const { supabase, answerid } = await saveAnswer(questionid);

  const insertDatePickerAnswerResponse = await supabase
    .from("date_picker_answer_table")
    .insert({
      answerid: answerid,
      pickeddate: pickeddate,
    });
  if (insertDatePickerAnswerResponse) {
    console.log(insertDatePickerAnswerResponse);
  }
}

export async function saveDateTimePickerAnswer(
  pickeddatetime: string,
  questionid: string,
) {
  const { supabase, answerid } = await saveAnswer(questionid);

  const insertDatePickerAnswerResponse = await supabase
    .from("datetime_picker_answer_table")
    .insert({
      answerid: answerid,
      pickeddatetime: pickeddatetime,
    });
  if (insertDatePickerAnswerResponse) {
    console.log(insertDatePickerAnswerResponse);
  }
}