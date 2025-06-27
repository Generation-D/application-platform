"use server";

import Logger from "@/logger/logger";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";
import { VideoAnswerResponse } from "@/components/questiontypes/videoupload_questiontype";

const log = new Logger("actions/answers/videoUpload");

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
