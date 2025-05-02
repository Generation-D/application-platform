"use server";

import Logger from "@/logger/logger";
import { storageSaveName } from "@/utils/helpers";
import { initSupabase } from "@/utils/supabaseServerClients";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";

const log = new Logger("actions/answers/imageUpload");

export async function saveImageUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = `image-${questionid}`;
  if (uploadFile) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("image_upload_answer_table")
        .insert({
          answerid: answerid,
          imagename: uploadFile.name,
        });
      if (insertAnswerError) {
        log.error(JSON.stringify(insertAnswerError));
      }
      const { error: bucketError } = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${uploadFile.name}`,
          uploadFile,
        );
      if (bucketError) {
        log.error(JSON.stringify(bucketError));
      }
    } else if (reqtype == "updated") {
      const { data: oldImageData, error: oldImageError } = await supabase
        .from("image_upload_answer_table")
        .select("imagename")
        .eq("answerid", answerid)
        .single();
      if (oldImageError) {
        log.error(JSON.stringify(oldImageError));
      }
      const { error: updatedImageError } = await supabase
        .from("image_upload_answer_table")
        .update({ imagename: uploadFile.name })
        .eq("answerid", answerid);
      if (updatedImageError) {
        log.error(JSON.stringify(updatedImageError));
      }
      const { error: updatedBucketError } = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${oldImageData?.imagename}`,
          uploadFile,
        );
      if (updatedBucketError) {
        log.error(JSON.stringify(updatedBucketError));
      }
    }
  }
}

export async function deleteImageUploadAnswer(questionid: string) {
  const supabase = await initSupabase();
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

interface ImageAnswerResponse {
  answerid: string;
  imagename: string;
}

export async function fetchImageUploadAnswer(questionid: string) {
  const supabase = await initSupabase();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    log.error(JSON.stringify(userError));
  }
  const user_id = userData.user!.id;

  const { data: imageUploadData, error: imageUploadError } = await supabase
    .rpc("fetch_image_upload_answer_table", {
      question_id: questionid,
      user_id: user_id,
    })
    .single<ImageAnswerResponse>();

  if (imageUploadError) {
    if (imageUploadError.code == "PGRST116") {
      return null;
    }
    log.error(JSON.stringify(imageUploadError));
    return null;
  }
  return { ...imageUploadData, userid: user_id };
}
