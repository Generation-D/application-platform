"use server";

import { ImageAnswerResponse } from "@/components/questiontypes/imageupload_questiontype";
import { PdfAnswerResponse } from "@/components/questiontypes/pdfupload_questiontype";
import { VideoAnswerResponse } from "@/components/questiontypes/videoupload_questiontype";
import Logger from "@/logger/logger";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { getCurrentUser, deleteAnswer } from "./answers";

const log = new Logger("actions/answers/deleteUpload");

type UploadRpcName =
  | "fetch_image_upload_answer_table"
  | "fetch_pdf_upload_answer_table"
  | "fetch_video_upload_answer_table";

async function deleteUploadAnswer<T extends { [key: string]: any }>(
  questionid: string,
  rpcName: UploadRpcName,
  bucketPrefix: string,
  fileProperty: string,
) {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const { data: uploadData, error: uploadError } = await supabase
    .rpc(rpcName, {
      question_id: questionid,
      user_id: user.id,
    })
    .single<T>();
  if (uploadError) {
    log.error(JSON.stringify(uploadError));
  }
  const bucket_name = `${bucketPrefix}-${questionid}`;
  const fileName = uploadData?.[fileProperty];
  if (fileName) {
    const { error: deleteError } = await supabase.storage
      .from(bucket_name)
      .remove([`${user.id}_${fileName}`]);
    if (deleteError) {
      log.error(JSON.stringify(deleteError));
    }
  }
  await deleteAnswer(questionid);
}

export async function deleteImageUploadAnswer(questionid: string) {
  return deleteUploadAnswer<ImageAnswerResponse>(
    questionid,
    "fetch_image_upload_answer_table",
    "image",
    "imagename",
  );
}

export async function deletePdfUploadAnswer(questionid: string) {
  return deleteUploadAnswer<PdfAnswerResponse>(
    questionid,
    "fetch_pdf_upload_answer_table",
    "pdf",
    "pdfname",
  );
}

export async function deleteVideoUploadAnswer(questionid: string) {
  return deleteUploadAnswer<VideoAnswerResponse>(
    questionid,
    "fetch_video_upload_answer_table",
    "video",
    "videoname",
  );
}
