"use server";

import { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { Question } from "@/components/questions";
import { QuestionType } from "@/components/questiontypes/utils/questiontype_selector";
import Logger from "@/logger/logger";
import { createCurrentTimestamp } from "@/utils/helpers";

import { deleteImageUploadAnswer } from "./imageUpload";
import { deletePdfUploadAnswer } from "./pdfUpload";
import { deleteVideoUploadAnswer } from "./videoUpload";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

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

const log = new Logger("actions/answers/answers");

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    log.error(JSON.stringify(userError));
    log.info("Redirecting to /login");
    redirect("/login");
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
    log.error(JSON.stringify(applicationError));
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
    log.error(JSON.stringify(answerError));
  }
  if (answerData!.length == 0) {
    return "";
  }
  return answerData![0].answerid;
}

export interface ExtendedAnswerType extends Answer {
  answervalue?: string | null;
}

export async function fetchAllAnswersOfApplication(): Promise<
  ExtendedAnswerType[]
> {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  const { data: answerData, error: answerError } = await supabase
    .from("answer_table")
    .select("*")
    .eq("applicationid", applicationid);

  if (answerError) {
    if (answerError.code == "PGRST116") {
      log.error(JSON.stringify(answerError));
      throw answerError;
    }
    log.error(JSON.stringify(answerError));
  }
  const answerIds = answerData!.map((answer) => answer.answerid);
  const { data: answerConditionalData, error: answerConditionalError } =
    await supabase
      .from("conditional_answer_table")
      .select("*")
      .in("answerid", answerIds);

  if (answerConditionalError) {
    if (answerConditionalError.code == "PGRST116") {
      log.debug(JSON.stringify(answerConditionalError));
      return [];
    }
    log.debug(JSON.stringify(answerConditionalError));
  }

  return (
    answerData?.map((answer: ExtendedAnswerType) => {
      const conditionalAnswer = answerConditionalData?.find(
        (condAnswer) => condAnswer.answerid === answer.answerid,
      );
      answer.answervalue = conditionalAnswer?.selectedchoice;
      return answer;
    }) || []
  );
}

export async function saveAnswer(questionid: string): Promise<saveAnswerType> {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  let answerid = await fetchAnswerId(supabase, user, applicationid, questionid);
  const now = createCurrentTimestamp();

  let reqtype = "";
  if (answerid == "") {
    const { data: insertAnswerData, error: insertAnswerError } = await supabase
      .from("answer_table")
      .insert({
        questionid: questionid,
        applicationid: applicationid,
        created: now,
        lastupdated: now,
      })
      .select()
      .single();
    if (insertAnswerError) {
      log.error(JSON.stringify(insertAnswerError));
    }
    answerid = insertAnswerData?.answerid;
    reqtype = "created";
  } else {
    const { data: updateAnswerData, error: updateAnswerError } = await supabase
      .from("answer_table")
      .update({
        lastupdated: now,
      })
      .eq("questionid", questionid)
      .eq("applicationid", applicationid)
      .select()
      .single();
    if (updateAnswerError) {
      log.error(JSON.stringify(updateAnswerError));
    }
    answerid = updateAnswerData?.answerid;
    reqtype = "updated";
  }
  return { supabase: supabase, answerid: answerid, reqtype: reqtype };
}

export async function saveAnswerClient(questionid: string) {
  const { answerid, reqtype } = await saveAnswer(questionid);
  return { answerid, reqtype }
}

export async function deleteAnswer(questionid: string) {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const applicationid = await getApplicationIdOfCurrentUser(supabase, user);
  const answerid = await fetchAnswerId(
    supabase,
    user,
    applicationid,
    questionid,
  );
  if (answerid != "") {
    const { error: deleteAnswerError } = await supabase
      .from("answer_table")
      .delete()
      .eq("questionid", questionid)
      .eq("applicationid", applicationid);
    if (deleteAnswerError) {
      log.error(JSON.stringify(deleteAnswerError));
    }
  }
}

export async function deleteAnswersOfQuestions(questions: Question[]) {
  for (const question of questions) {
    if (question.questiontype == QuestionType.ImageUpload) {
      await deleteImageUploadAnswer(question.questionid);
    } else if (question.questiontype == QuestionType.VideoUpload) {
      await deleteVideoUploadAnswer(question.questionid);
    } else if (question.questiontype == QuestionType.PDFUpload) {
      await deletePdfUploadAnswer(question.questionid);
    } else {
      await deleteAnswer(question.questionid);
    }
  }
}
