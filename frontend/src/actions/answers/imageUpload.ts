"use server";

import Logger from "@/logger/logger";

import { deleteAnswer, getCurrentUser } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { ImageAnswerResponse } from "@/components/questiontypes/imageupload_questiontype";

const log = new Logger("actions/answers/imageUpload");

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
