"use server";

import { z } from "zod";

import {
  getSupabaseCookiesUtilClient,
  getSupabaseServiceRoleClient,
} from "@/supabase-utils/cookiesUtilClient";

const uploadTypeSchema = z.enum(["image", "pdf", "video"]);

const uploadTables = {
  image: { table: "image_upload_answer_table", column: "imagename" },
  pdf: { table: "pdf_upload_answer_table", column: "pdfname" },
  video: { table: "video_upload_answer_table", column: "videoname" },
} as const;

export async function getApplicationUploadUrl(
  applicationId: string,
  questionId: string,
  uploadTypeInput: "image" | "pdf" | "video",
) {
  z.uuid().parse(applicationId);
  z.uuid().parse(questionId);
  const uploadType = uploadTypeSchema.parse(uploadTypeInput);

  const supabase = await getSupabaseCookiesUtilClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Nicht angemeldet.");

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles_table")
    .select("isactive")
    .eq("userid", user.id)
    .single();
  if (profileError || !profile?.isactive) {
    throw new Error("Kein Zugriff auf diese Datei.");
  }

  const { data: application } = await supabase
    .from("application_table")
    .select("userid")
    .eq("applicationid", applicationId)
    .maybeSingle();
  const { data: answer } = await supabase
    .from("answer_table")
    .select("answerid")
    .eq("applicationid", applicationId)
    .eq("questionid", questionId)
    .maybeSingle();
  if (!application || !answer) {
    throw new Error("Kein Zugriff auf diese Datei.");
  }

  const { table, column } = uploadTables[uploadType];
  const { data: upload } = await supabase
    .from(table)
    .select(column)
    .eq("answerid", answer.answerid)
    .maybeSingle();
  const storedFileName = (upload as Record<string, string> | null)?.[column];
  if (!storedFileName) throw new Error("Datei nicht gefunden.");

  const bucket = `${uploadType}-${questionId}`;
  const path = `${application.userid}_${storedFileName}`;
  const { data: signedUrl, error: signedUrlError } =
    await getSupabaseServiceRoleClient()
      .storage.from(bucket)
      .createSignedUrl(path, 60 * 10);
  if (signedUrlError) throw signedUrlError;
  return signedUrl.signedUrl;
}
