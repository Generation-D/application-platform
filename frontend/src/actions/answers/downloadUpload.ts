"use server";

import { z } from "zod";

import {
  getSupabaseCookiesUtilClient,
  getSupabaseServiceRoleClient,
} from "@/supabase-utils/cookiesUtilClient";
import { UserRole } from "@/utils/userRole";

const uploadTypeSchema = z.enum(["image", "pdf", "video"]);

export async function getApplicationUploadUrl(
  applicationId: string,
  questionId: string,
  uploadTypeInput: "image" | "pdf" | "video",
) {
  z.string().uuid().parse(applicationId);
  z.string().uuid().parse(questionId);
  const uploadType = uploadTypeSchema.parse(uploadTypeInput);

  const supabase = await getSupabaseCookiesUtilClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Nicht angemeldet.");

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles_table")
    .select("userrole,isactive")
    .eq("userid", user.id)
    .single();
  if (profileError || !profile?.isactive) {
    throw new Error("Kein Zugriff auf diese Datei.");
  }

  const supabaseAdmin = getSupabaseServiceRoleClient();
  const { data: answer, error: answerError } = await supabaseAdmin
    .from("answer_table")
    .select("answerid,applicationid,questionid")
    .eq("applicationid", applicationId)
    .eq("questionid", questionId)
    .single();
  if (answerError) throw answerError;

  const { data: application, error: applicationError } = await supabaseAdmin
    .from("application_table")
    .select("userid")
    .eq("applicationid", applicationId)
    .single();
  if (applicationError) throw applicationError;

  let isAllowed =
    profile.userrole === UserRole.Admin || application.userid === user.id;
  if (profile.userrole === UserRole.Reviewer) {
    const { data: question, error: questionError } = await supabaseAdmin
      .from("question_table")
      .select("phaseid")
      .eq("questionid", questionId)
      .single();
    if (questionError) throw questionError;
    const { data: answerPhase, error: answerPhaseError } = await supabaseAdmin
      .from("phase_table")
      .select("phaseorder")
      .eq("phaseid", question.phaseid)
      .single();
    if (answerPhaseError) throw answerPhaseError;
    const { data: assignments, error: assignmentError } = await supabaseAdmin
      .from("phase_assignment_table")
      .select("phase_id")
      .eq("user_role_1_id", application.userid)
      .eq("user_role_2_id", user.id);
    if (assignmentError) throw assignmentError;
    const assignmentPhaseIds = assignments?.map((item) => item.phase_id) ?? [];
    if (assignmentPhaseIds.length > 0) {
      const { data: assignmentPhases, error: assignmentPhaseError } =
        await supabaseAdmin
          .from("phase_table")
          .select("phaseorder")
          .in("phaseid", assignmentPhaseIds);
      if (assignmentPhaseError) throw assignmentPhaseError;
      isAllowed =
        assignmentPhases?.some(
          (phase) => phase.phaseorder >= answerPhase.phaseorder,
        ) ?? false;
    }
  }

  if (!isAllowed) throw new Error("Kein Zugriff auf diese Datei.");

  let storedFileName: string | null = null;
  if (uploadType === "image") {
    const { data, error } = await supabaseAdmin
      .from("image_upload_answer_table")
      .select("imagename")
      .eq("answerid", answer.answerid)
      .single();
    if (error) throw error;
    storedFileName = data.imagename;
  } else if (uploadType === "pdf") {
    const { data, error } = await supabaseAdmin
      .from("pdf_upload_answer_table")
      .select("pdfname")
      .eq("answerid", answer.answerid)
      .single();
    if (error) throw error;
    storedFileName = data.pdfname;
  } else {
    const { data, error } = await supabaseAdmin
      .from("video_upload_answer_table")
      .select("videoname")
      .eq("answerid", answer.answerid)
      .single();
    if (error) throw error;
    storedFileName = data.videoname;
  }

  const bucket = `${uploadType}-${questionId}`;
  const path = `${application.userid}_${storedFileName}`;
  const { data: signedUrl, error: signedUrlError } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 10);
  if (signedUrlError) throw signedUrlError;
  return signedUrl.signedUrl;
}
