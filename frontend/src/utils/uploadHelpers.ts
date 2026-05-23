import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { saveAnswerClient } from "@/actions/answers/answers";
import { logger } from "@/logger/logger";
import { VideoAnswerResponse } from "@/components/questiontypes/videoupload_questiontype";
import { ImageAnswerResponse } from "@/components/questiontypes/imageupload_questiontype";
import { PdfAnswerResponse } from "@/components/questiontypes/pdfupload_questiontype";

export type UploadTableName =
  | "image_upload_answer_table"
  | "pdf_upload_answer_table"
  | "video_upload_answer_table";
export type UploadFileName = "imagename" | "pdfname" | "videoname";
export type UploadRpcName =
  | "fetch_image_upload_answer_table"
  | "fetch_pdf_upload_answer_table"
  | "fetch_video_upload_answer_table";

export async function saveUploadAnswer(
  questionid: string,
  formData: FormData,
  options: {
    table: UploadTableName;
    fileName: UploadFileName;
    bucketPrefix: string;
    validTypes: string[];
    maxfilesizeinmb: number;
    storageSaveName: (name: string) => string;
  },
) {
  const file = formData.get(questionid) as File;
  if (!file) return;
  const fileSizeInMB = file.size / 1024 / 1024;
  if (!options.validTypes.includes(file.type)) {
    logger.error(
      `Invalid file type: ${file.type}. Allowed: ${options.validTypes.join(
        ", ",
      )}`,
    );
    return;
  }
  if (fileSizeInMB > options.maxfilesizeinmb) {
    logger.error(
      `File too large: ${fileSizeInMB} MB. Max: ${options.maxfilesizeinmb} MB.`,
    );
    return;
  }
  const uploadFile = new File([file], options.storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = `${options.bucketPrefix}-${questionid}`;
  const { answerid, reqtype } = await saveAnswerClient(questionid);
  const supabase = getSupabaseBrowserClient();
  if (reqtype == "created") {
    let insertAnswerError
    if (options.fileName === "imagename" && options.table === 'image_upload_answer_table') {
      const insertObj = { answerid, imagename: uploadFile.name };
      const { error } = await supabase
      .from(options.table)
      .insert(insertObj);
      insertAnswerError = error
    } else if (options.fileName === "pdfname" && options.table === 'pdf_upload_answer_table') {
      const insertObj = { answerid, pdfname: uploadFile.name };
      const { error } = await supabase
      .from(options.table)
      .insert(insertObj);
      insertAnswerError = error
    } else if (options.fileName === "videoname" && options.table === 'video_upload_answer_table') {
      const insertObj = { answerid, videoname: uploadFile.name };
      const { error } = await supabase
      .from(options.table)
      .insert(insertObj);
      insertAnswerError = error
    } else {
      logger.error(`Invalid fileName option: ${options.fileName}`);
      return;
    }
    
    if (insertAnswerError) {
      logger.error(JSON.stringify(insertAnswerError));
    }
    const { error: bucketError } = await supabase.storage
      .from(bucket_name)
      .upload(
        `${(await supabase.auth.getUser()).data.user!.id}_${uploadFile.name}`,
        uploadFile,
      );
    if (bucketError) {
      logger.error(JSON.stringify(bucketError));
    }
  } else if (reqtype == "updated") {
    const { data: oldData, error: oldError } = await supabase
      .from(options.table)
      .select(options.fileName)
      .eq("answerid", answerid)
      .single();
    if (oldError) {
      logger.error(JSON.stringify(oldError));
    }
    let updateObj:
      | { imagename: string }
      | { pdfname: string }
      | { videoname: string };
    if (options.fileName === "imagename") {
      updateObj = { imagename: uploadFile.name };
    } else if (options.fileName === "pdfname") {
      updateObj = { pdfname: uploadFile.name };
    } else if (options.fileName === "videoname") {
      updateObj = { videoname: uploadFile.name };
    } else {
      logger.error(`Invalid fileName option: ${options.fileName}`);
      return;
    }
    const { error: updatedError } = await supabase
      .from(options.table)
      .update(updateObj)
      .eq("answerid", answerid);
    if (updatedError) {
      logger.error(JSON.stringify(updatedError));
    }
    let oldFileName = "";
    if (oldData && typeof oldData === "object" && options.fileName in oldData) {
      oldFileName = (oldData as Record<string, string>)[options.fileName];
    }
    const { error: updatedBucketError } = await supabase.storage
      .from(bucket_name)
      .update(
        `${(await supabase.auth.getUser()).data.user!.id}_${oldFileName}`,
        uploadFile,
      );
    if (updatedBucketError) {
      logger.error(JSON.stringify(updatedBucketError));
    }
  }
}

export async function fetchUploadAnswer<T extends UploadRpcName>(
  questionid: string,
  applicationid: string,
  options: {
    rpcName: T;
    fileName: UploadFileName;
  },
) {
  const supabase = getSupabaseBrowserClient();
  if (!applicationid) {
    return null;
  }

  const { data: uploadData, error: uploadError } = await supabase
    .rpc(options.rpcName, {
      question_id: questionid,
      application_id: applicationid,
    })
    .maybeSingle();
  if (uploadError) {
    logger.error({
      question_id: questionid,
      application_id: applicationid,
    });
    logger.error(JSON.stringify(uploadError));
    return null;
  }
  if (!uploadData) {
    logger.info("No existing upload data found for this question.");
    return null;
  } else {
    return uploadData;
  }
}
