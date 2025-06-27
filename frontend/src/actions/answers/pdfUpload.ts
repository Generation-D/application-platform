"use server";

import Logger from "@/logger/logger";
import { storageSaveName } from "@/utils/helpers";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { PdfAnswerResponse } from "@/components/questiontypes/pdfupload_questiontype";

const log = new Logger("actions/answers/pdfUpload");

export async function deletePdfUploadAnswer(questionid: string) {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const { data: pdfUploadData, error: pdfUploadError } = await supabase
    .rpc("fetch_pdf_upload_answer_table", {
      question_id: questionid,
      user_id: user.id,
    })
    .single<PdfAnswerResponse>();
  if (pdfUploadError) {
    log.error(JSON.stringify(pdfUploadError));
  }
  const bucket_name = `pdf-${questionid}`;
  const { error: pdfDeleteError } = await supabase.storage
    .from(bucket_name)
    .remove([`${user.id}_${pdfUploadData?.pdfname}`]);
  if (pdfDeleteError) {
    log.error(JSON.stringify(pdfDeleteError));
  }
  await deleteAnswer(questionid);
}
