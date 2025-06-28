"use server";

import { ImageAnswerResponse } from "@/components/questiontypes/imageupload_questiontype";
import { PdfAnswerResponse } from "@/components/questiontypes/pdfupload_questiontype";
import { VideoAnswerResponse } from "@/components/questiontypes/videoupload_questiontype";
import Logger from "@/logger/logger";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { getCurrentUser, deleteAnswer } from "./answers";

const log = new Logger("actions/answers/deleteUpload");

export async function deleteImageUploadAnswer(questionid: string) {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const { data: imageUploadData, error: imageUploadError } = await supabase
    .rpc("fetch_image_upload_answer_table", {
      question_id: questionid,
      user_id: user.id,
    })
    .single<ImageAnswerResponse>();
  if (imageUploadError) {
    log.error(JSON.stringify(imageUploadError));
  }
  const bucket_name = `image-${questionid}`;
  const { error: imageDeleteError } = await supabase.storage
    .from(bucket_name)
    .remove([`${user.id}_${imageUploadData?.imagename}`]);
  if (imageDeleteError) {
    log.error(JSON.stringify(imageDeleteError));
  }
  await deleteAnswer(questionid);
}

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

export async function deleteVideoUploadAnswer(questionid: string) {
  const supabase = await getSupabaseCookiesUtilClient();
  const user = await getCurrentUser(supabase);
  const { data: videoUploadData, error: videoUploadError } = await supabase
    .rpc("fetch_video_upload_answer_table", {
      question_id: questionid,
      user_id: user.id,
    })
    .single<VideoAnswerResponse>();
  if (videoUploadError) {
    log.error(JSON.stringify(videoUploadError));
  }
  const bucket_name = `video-${questionid}`;
  const { error: videoDeleteError } = await supabase.storage
    .from(bucket_name)
    .remove([`${user.id}_${videoUploadData?.videoname}`]);
  if (videoDeleteError) {
    log.error(JSON.stringify(videoDeleteError));
  }
  await deleteAnswer(questionid);
}
