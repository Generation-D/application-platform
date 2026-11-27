import { getSupabaseBrowserClient } from "@/supabase-utils/browserClient";
import { saveAnswerClient } from "@/actions/answers/answers";
import { getApplicationUploadUrl } from "@/actions/answers/downloadUpload";
import { createLogger } from "@/logger/logger";
import {
  SAVE_FAILED_MESSAGE,
  throwIfSaveFailed,
} from "@/actions/answers/saveErrors";
import { UserFacingError } from "@/utils/saveFeedback";

const log = createLogger("utils/uploadHelpers");

export type UploadTableName =
  | "image_upload_answer_table"
  | "pdf_upload_answer_table"
  | "video_upload_answer_table";
export type UploadFileName = "imagename" | "pdfname" | "videoname";
export type UploadRpcName =
  | "fetch_image_upload_answer_table"
  | "fetch_pdf_upload_answer_table"
  | "fetch_video_upload_answer_table";

export async function downloadApplicationFile(
  applicationId: string,
  questionId: string,
  uploadType: "image" | "pdf" | "video",
) {
  const signedUrl = await getApplicationUploadUrl(
    applicationId,
    questionId,
    uploadType,
  );
  const response = await fetch(signedUrl);
  if (!response.ok) {
    throw new Error("Die hochgeladene Datei konnte nicht geladen werden.");
  }
  return response.blob();
}

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
    throw new UserFacingError("Dieser Dateityp wird nicht unterstützt.");
  }
  if (fileSizeInMB > options.maxfilesizeinmb) {
    log.error(
      `File too large: ${fileSizeInMB} MB. Max: ${options.maxfilesizeinmb} MB.`,
    );
    throw new UserFacingError(
      `Die Datei ist zu groß (maximal ${options.maxfilesizeinmb} MB).`,
    );
  }
  const uploadFile = new File([file], options.storageSaveName(file.name), {
    type: file.type,
    lastModified: file.lastModified,
  });
  const bucket_name = `${options.bucketPrefix}-${questionid}`;
  const { answerid } = await saveAnswerClient(questionid);
  const supabase = getSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error(SAVE_FAILED_MESSAGE);

  const { data: oldData } = await supabase
    .from(options.table)
    .select(options.fileName)
    .eq("answerid", answerid)
    .maybeSingle();
  const oldFileName = (oldData as Record<string, string> | null)?.[
    options.fileName
  ];

  // Upload before writing the row; downloads build the object path from the stored name.
  const { error: bucketError } = await supabase.storage
    .from(bucket_name)
    .upload(`${user.id}_${uploadFile.name}`, uploadFile, { upsert: true });
  throwIfSaveFailed(bucketError, log);

  const { error: rowError } = await upsertUploadRow(
    supabase,
    options.table,
    answerid,
    uploadFile.name,
  );
  throwIfSaveFailed(rowError, log);

  if (oldFileName && oldFileName !== uploadFile.name) {
    const { error: removeError } = await supabase.storage
      .from(bucket_name)
      .remove([`${user.id}_${oldFileName}`]);
    if (removeError) log.error(JSON.stringify(removeError));
  }
}

function upsertUploadRow(
  supabase: ReturnType<typeof getSupabaseBrowserClient>,
  table: UploadTableName,
  answerid: string,
  name: string,
) {
  const onConflict = { onConflict: "answerid" };
  switch (table) {
    case "image_upload_answer_table":
      return supabase
        .from(table)
        .upsert({ answerid, imagename: name }, onConflict);
    case "pdf_upload_answer_table":
      return supabase
        .from(table)
        .upsert({ answerid, pdfname: name }, onConflict);
    case "video_upload_answer_table":
      return supabase
        .from(table)
        .upsert({ answerid, videoname: name }, onConflict);
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
    log.error({
      question_id: questionid,
      application_id: applicationid,
    });
    log.error(JSON.stringify(uploadError));
    return null;
  }
  if (!uploadData) {
    log.info("No existing upload data found for this question.");
    return null;
  } else {
    return uploadData;
  }
}
