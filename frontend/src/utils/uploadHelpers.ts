import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { saveAnswerClient } from "@/actions/answers/answers";
import Logger from "@/logger/logger";

const log = new Logger("UploadHelpers");

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
    log.error(
      `Invalid file type: ${file.type}. Allowed: ${options.validTypes.join(
        ", ",
      )}`,
    );
    return;
  }
  if (fileSizeInMB > options.maxfilesizeinmb) {
    log.error(
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
    let insertObj:
      | { answerid: string; imagename: string }
      | { answerid: string; pdfname: string }
      | { answerid: string; videoname: string };
    if (options.fileName === "imagename") {
      insertObj = { answerid, imagename: uploadFile.name };
    } else if (options.fileName === "pdfname") {
      insertObj = { answerid, pdfname: uploadFile.name };
    } else if (options.fileName === "videoname") {
      insertObj = { answerid, videoname: uploadFile.name };
    } else {
      log.error(`Invalid fileName option: ${options.fileName}`);
      return;
    }
    const { error: insertAnswerError } = await supabase
      .from(options.table)
      .insert(insertObj);
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
    const { data: oldData, error: oldError } = await supabase
      .from(options.table)
      .select(options.fileName)
      .eq("answerid", answerid)
      .single();
    if (oldError) {
      log.error(JSON.stringify(oldError));
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
      log.error(`Invalid fileName option: ${options.fileName}`);
      return;
    }
    const { error: updatedError } = await supabase
      .from(options.table)
      .update(updateObj)
      .eq("answerid", answerid);
    if (updatedError) {
      log.error(JSON.stringify(updatedError));
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
      log.error(JSON.stringify(updatedBucketError));
    }
  }
}

export async function fetchUploadAnswer<T extends { [key: string]: any }>(
  questionid: string,
  options: {
    rpcName: UploadRpcName;
    fileName: UploadFileName;
  },
): Promise<(T & { userid: string }) | null> {
  const supabase = getSupabaseBrowserClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    log.error(JSON.stringify(userError));
  }
  const user_id = userData.user!.id;
  const { data: uploadData, error: uploadError } = await supabase
    .rpc(options.rpcName, {
      question_id: questionid,
      user_id: user_id,
    })
    .maybeSingle<T>();
  if (uploadError) {
    log.error(JSON.stringify(uploadError));
    return null;
  }
  if (!uploadData) {
    log.info("No existing upload data found for this question.");
    return null;
  } else {
    return { ...uploadData, userid: user_id };
  }
}
