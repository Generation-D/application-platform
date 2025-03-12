"use server";

import Logger from "@/logger/logger";
import { storageSaveName } from "@/utils/helpers";

import { deleteAnswer, getCurrentUser, saveAnswer } from "./answers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = new Logger("actions/answers/pdfUpload");

export async function savePdfUploadAnswer(
  questionid: string,
  formData: FormData,
) {
  const file = formData.get(questionid) as File;
  const uploadFile = new File([file], storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = `pdf-${questionid}`;
  if (uploadFile) {
    const { supabase, answerid, reqtype } = await saveAnswer(questionid);
    if (reqtype == "created") {
      const { error: insertAnswerError } = await supabase
        .from("pdf_upload_answer_table")
        .insert({
          answerid: answerid,
          pdfname: uploadFile.name,
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
      const { data: oldPdfData, error: oldPdfError } = await supabase
        .from("pdf_upload_answer_table")
        .select("pdfname")
        .eq("answerid", answerid)
        .single();
      if (oldPdfError) {
        log.error(JSON.stringify(oldPdfError));
      }
      const { error: updatedImageError } = await supabase
        .from("pdf_upload_answer_table")
        .update({ pdfname: uploadFile.name })
        .eq("answerid", answerid);
      if (updatedImageError) {
        log.error(JSON.stringify(updatedImageError));
      }
      const { error: updatedBucketError } = await supabase.storage
        .from(bucket_name)
        .update(
          `${
            (await supabase.auth.getUser()).data.user!.id
          }_${oldPdfData?.pdfname}`,
          uploadFile,
        );
      if (updatedBucketError) {
        log.error(JSON.stringify(updatedBucketError));
      }
    }
  }
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

interface PdfAnswerResponse {
  answerid: string;
  pdfname: string;
}

export async function fetchPdfUploadAnswer(questionid: string) {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    log.error(JSON.stringify(userError));
  }
  const user_id = userData.user!.id;

  const { data: pdfUploadData, error: pdfUploadError } = await supabase
    .rpc("fetch_pdf_upload_answer_table", {
      question_id: questionid,
      user_id: user_id,
    })
    .single<PdfAnswerResponse>();
  if (pdfUploadError) {
    if (pdfUploadError.code == "PGRST116") {
      return null;
    }
    log.error(JSON.stringify(pdfUploadError));
    return null;
  }
  return { ...pdfUploadData, userid: user_id };
}
