"use server";

import { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { Question } from "@/components/questions";
import { AnswerTypeTable } from "@/components/questiontypes/utils/questiontype_selector";
import { createCurrentTimestamp } from "@/utils/helpers";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

export interface saveAnswerType {
  supabase: SupabaseClient;
  answerid: string;
  reqtype: string;
}

export interface Answer {
  answerid: string;
  questionid: string;
  applicationid: string;
  lastupdated: string;
  created: string;
}

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.log("Error: " + userError);
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

export async function fetchAllAnswersOfApplication(): Promise<Answer[]> {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  const { data: answerData, error: answerError } = await supabase
    .from("answer_table")
    .select("*")
    .eq("applicationid", applicationid);

  if (answerError) {
    if (answerError.code == "PGRST116") {
      console.log("answerError:");
      console.log(answerError);
      return [];
    }
    console.log(answerError);
  }
  return answerData as Answer[];
}

export async function saveAnswer(questionid: string): Promise<saveAnswerType> {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  const now = createCurrentTimestamp();

  let reqtype = "";
  if (answerid == "") {
    const insertAnswerResponse = await supabase
      .from("answer_table")
      .insert({
        questionid: questionid,
        applicationid: applicationid,
        created: now,
        lastupdated: now,
      })
      .select()
      .single();
    answerid = insertAnswerResponse!.data!.answerid;
    reqtype = "created";
  } else {
    const updateAnswerResponse = await supabase
      .from("answer_table")
      .update({
        lastupdated: now,
      })
      .eq("questionid", questionid)
      .eq("applicationid", applicationid)
      .select()
      .single();
    answerid = updateAnswerResponse!.data!.answerid;
    reqtype = "updated";
  }
  return { supabase: supabase, answerid: answerid, reqtype: reqtype };
}

export async function deleteAnswer(questionid: string, answertype: string) {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  if (answerid != "") {
    const deleteAnswerResponse = await supabase
      .from("answer_table")
      .delete()
      .eq("questionid", questionid)
      .eq("applicationid", applicationid);
  }
}

export async function deleteAnswersOfQuestions(questions: Question[]) {
  console.log(JSON.stringify(questions));
  for (const question of questions) {
    await deleteAnswer(
      question.questionid,
      AnswerTypeTable[
        `${question.questiontype.toUpperCase()}AnswerTable` as keyof typeof AnswerTypeTable
      ],
    );
  }
}
