"use server";

import { initSupabaseActions } from "@/utils/supabaseServerClients";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";
import { storageSaveName } from "@/utils/helpers";

export async function saveImageUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  console.log("UPLOADING...")
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = "image-" + questionid;
  if (uploadFile) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const insertImageUploadAnswerResponse = await supabase
        .from("image_upload_answer_table")
        .insert({
          answerid: answerid,
          imagename: uploadFile.name,
        });
      if (insertImageUploadAnswerResponse) {
        console.log("Inserted Image");
        console.log(insertImageUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .upload(
          `${(await supabase.auth.getUser()).data.user!.id}_${uploadFile.name}`,
          uploadFile,
        );
      console.log(createBucketEntry);
    } else if (reqtype == "updated") {
      const getOldImageUploadAnswerResponse = await supabase
        .from("image_upload_answer_table")
        .select("imagename")
        .eq("answerid", answerid)
        .single();
      const updateImageUploadAnswerResponse = await supabase
        .from("image_upload_answer_table")
        .update({ imagename: uploadFile.name })
        .eq("answerid", answerid);
      if (updateImageUploadAnswerResponse) {
        console.log("Updated Image");
        console.log(updateImageUploadAnswerResponse);
      }
      const createBucketEntry = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${getOldImageUploadAnswerResponse.data?.imagename}`,
          uploadFile,
        );
      console.log(createBucketEntry);
    }
  }
}

export async function deleteImageUploadAnswer(
  questionid: string,
  answerid: string,
) {
  const supabase = initSupabaseActions();
  const user = await getCurrentUser(supabase);
  const bucket_name = "image-" + questionid;
  const { data: imageUploadData, error: imageUploadError } = await supabase
    .from("image_upload_answer_table")
    .select("imagename")
    .eq("answerid", answerid)
    .single();
  if (!imageUploadError) {
    const { data: imageDeleteData, error: imageDeleteError } =
      await supabase.storage
        .from(bucket_name)
        .remove([`${user.id}_${imageUploadData!.imagename}`]);
  }
  await deleteAnswer(questionid, "image_upload_answer_table");
}
