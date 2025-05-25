"use server";

import Logger from "@/logger/logger";
import { storageSaveName } from "@/utils/helpers";
import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";

const log = new Logger("actions/answers/videoUpload");

export async function saveVideoUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = `video-${questionid}`;
  if (uploadFile) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("video_upload_answer_table")
        .insert({
          answerid: answerid,
          videoname: uploadFile.name,
        });
      if (insertAnswerError) {
        log.error("insertAnswerError " + JSON.stringify(insertAnswerError));
      }
      const { error: bucketError } = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${uploadFile.name}`,
          uploadFile,
        );
      if (bucketError) {
        log.error("bucketError: " + JSON.stringify(bucketError));
      }
    } else if (reqtype == "updated") {
      const { data: oldVideoData, error: oldVideoError } = await supabase
        .from("video_upload_answer_table")
        .select("videoname")
        .eq("answerid", answerid)
        .single();
      if (oldVideoError) {
        log.error("oldVideoError " + JSON.stringify(oldVideoError));
      }
      const { error: updatedVideoError } = await supabase
        .from("video_upload_answer_table")
        .update({ videoname: uploadFile.name })
        .eq("answerid", answerid);
      if (updatedVideoError) {
        log.error("updatedVideoError " + JSON.stringify(updatedVideoError));
      }
      const { error: updatedBucketError } = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${oldVideoData?.videoname}`,
          uploadFile,
        );
      if (updatedBucketError) {
        log.error("updatedBucketError " + JSON.stringify(updatedBucketError));
      }
    }
  }
}

export async function deleteVideoUploadAnswer(questionid: string) {
  const supabase = await initSupabaseActions();
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

interface VideoAnswerResponse {
  answerid: string;
  videoname: string;
}

export async function fetchVideoUploadAnswer(questionid: string) {
  const supabase = await initSupabaseActions();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    log.error(JSON.stringify(userError));
  }
  const user_id = userData.user!.id;

  const { data: videoUploadData, error: videoUploadError } = await supabase
    .rpc("fetch_video_upload_answer_table", {
      question_id: questionid,
      user_id: user_id,
    })
    .single<VideoAnswerResponse>();

  if (videoUploadError) {
    if (videoUploadError.code == "PGRST116") {
      return null;
    }
    log.error(JSON.stringify(videoUploadError));
    return null;
  }
  return { ...videoUploadData, userid: user_id };
}
