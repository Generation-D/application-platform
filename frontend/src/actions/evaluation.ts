"use server";

import { parse } from "csv-parse/sync";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { sendEmail } from "@/actions/smtp";
import {
  reviewEmailDefaults,
  reviewEmailOverviewRecipient,
  reviewEmailSender,
  ReviewEmailDefaults,
} from "@/config/reviewEmailConfig";
import {
  createMatchingOverviewEmail,
  createReviewerAssignmentEmail,
} from "@/emails/reviewerAssignmentEmail";
import { PhaseData } from "@/store/slices/phaseSlice";
import {
  getSupabaseCookiesUtilClient,
  getSupabaseServiceRoleClient,
} from "@/supabase-utils/cookiesUtilClient";
import { getURL } from "@/utils/helpers";
import {
  assignReviewers,
  MatchingApplication,
  MatchingReviewer,
  ReviewerAssignment,
} from "@/utils/reviewerMatching";
import { UserRole } from "@/utils/userRole";

interface CsvReviewer {
  name: string;
  email: string;
  new: string;
  max: string;
}

export interface EvaluationAssignment {
  phaseId: string;
  applicantUserId: string;
  applicationId: string;
  teamName: string;
  applicantEmail: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerIsExperienced: boolean;
}

export interface EvaluationDashboardData {
  phases: PhaseData[];
  applications: MatchingApplication[];
  eligibleApplicantIdsByPhase: Record<string, string[]>;
  assignments: EvaluationAssignment[];
  outcomes: {
    outcomeId: string;
    phaseId: string;
    applicantUserId: string;
    outcome: boolean;
  }[];
  emailDefaults: ReviewEmailDefaults;
}

const assignmentSchema = z.object({
  applicationId: z.string().uuid(),
  applicantUserId: z.string().uuid(),
  teamName: z.string(),
  applicantEmail: z.email(),
  reviewerName: z.string().trim().min(1),
  reviewerEmail: z.email(),
  reviewerIsExperienced: z.boolean(),
});

const evaluationBucket = "evaluation-records";

async function readMatching(
  supabaseAdmin: ReturnType<typeof getSupabaseServiceRoleClient>,
  phaseId: string,
): Promise<ReviewerAssignment[]> {
  const { data: objects, error: listError } = await supabaseAdmin.storage
    .from(evaluationBucket)
    .list(phaseId);
  if (listError) throw listError;
  if (!objects?.some((object) => object.name === "matching.json")) return [];
  const { data, error } = await supabaseAdmin.storage
    .from(evaluationBucket)
    .download(`${phaseId}/matching.json`);
  if (error) throw error;
  return z.array(assignmentSchema).parse(JSON.parse(await data.text()));
}

const emailSettingsSchema = z.object({
  subject: z.string().trim().min(1),
  confirmationDeadline: z.string().trim().min(1),
  confirmationUrl: z.url(),
  ratingDeadline: z.string().trim().min(1),
  instructionsUrl: z.url(),
  ratingUrl: z.url(),
  phaseNote: z.string().trim().min(1),
});

function normalizeEmail(email: string) {
  return email.trim().toLowerCase().replace("@googlemail.com", "@gmail.com");
}

async function requireAdmin() {
  const supabase = await getSupabaseCookiesUtilClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Nicht angemeldet.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles_table")
    .select("userrole,isactive")
    .eq("userid", user.id)
    .single();

  if (
    profileError ||
    !profile?.isactive ||
    profile.userrole !== UserRole.Admin
  ) {
    throw new Error("Diese Aktion ist nur für Administratoren erlaubt.");
  }

  return {
    user,
    supabaseAdmin: getSupabaseServiceRoleClient(),
  };
}

async function listAllAuthUsers(
  supabaseAdmin: ReturnType<typeof getSupabaseServiceRoleClient>,
) {
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return users;
}

async function requireOpenPhase(
  supabaseAdmin: ReturnType<typeof getSupabaseServiceRoleClient>,
  phaseId: string,
) {
  const { data: phase, error } = await supabaseAdmin
    .from("phase_table")
    .select("finished_evaluation")
    .eq("phaseid", z.string().uuid().parse(phaseId))
    .single();
  if (error) throw error;
  if (phase.finished_evaluation !== null) {
    throw new Error("Diese Phase ist bereits abgeschlossen.");
  }
}

async function fetchEligibleApplications(
  supabaseAdmin: ReturnType<typeof getSupabaseServiceRoleClient>,
  phaseId: string,
): Promise<MatchingApplication[]> {
  const { data: phase, error: phaseError } = await supabaseAdmin
    .from("phase_table")
    .select("phaseid,phaseorder")
    .eq("phaseid", phaseId)
    .single();
  if (phaseError) throw phaseError;

  const [
    { data: applications, error: applicationError },
    { data: profiles, error: profileError },
    authUsers,
  ] = await Promise.all([
    supabaseAdmin
      .from("application_table")
      .select("applicationid,userid,team_name"),
    supabaseAdmin
      .from("user_profiles_table")
      .select("userid,userrole,isactive"),
    listAllAuthUsers(supabaseAdmin),
  ]);
  if (applicationError) throw applicationError;
  if (profileError) throw profileError;

  const activeApplicantIds = new Set(
    profiles
      ?.filter(
        (profile) =>
          profile.userrole === UserRole.Applicant && profile.isactive,
      )
      .map((profile) => profile.userid),
  );

  let eligibleApplicantIds = activeApplicantIds;
  if (phase.phaseorder > 0) {
    const { data: previousPhase, error: previousPhaseError } =
      await supabaseAdmin
        .from("phase_table")
        .select("phaseid")
        .eq("phaseorder", phase.phaseorder - 1)
        .single();
    if (previousPhaseError) throw previousPhaseError;

    const { data: outcomes, error: outcomeError } = await supabaseAdmin
      .from("phase_outcome_table")
      .select("user_id")
      .eq("phase_id", previousPhase.phaseid)
      .eq("outcome", true);
    if (outcomeError) throw outcomeError;
    eligibleApplicantIds = new Set(
      outcomes
        ?.map((outcome) => outcome.user_id)
        .filter((userId) => activeApplicantIds.has(userId)),
    );
  }

  const emailByUserId = new Map(
    authUsers.map((authUser) => [authUser.id, authUser.email ?? ""]),
  );

  return (applications ?? [])
    .filter((application) => eligibleApplicantIds.has(application.userid))
    .map((application) => ({
      applicationId: application.applicationid,
      applicantUserId: application.userid,
      teamName:
        application.team_name?.trim() ||
        `Bewerbung ${application.applicationid.slice(0, 8)}`,
      email: emailByUserId.get(application.userid) || "",
    }));
}

export async function fetchEvaluationDashboardData(): Promise<EvaluationDashboardData> {
  const { supabaseAdmin } = await requireAdmin();
  const [
    authUsers,
    phasesResult,
    applicationsResult,
    outcomesResult,
    profilesResult,
  ] = await Promise.all([
    listAllAuthUsers(supabaseAdmin),
    supabaseAdmin.from("phase_table").select("*").order("phaseorder"),
    supabaseAdmin
      .from("application_table")
      .select("applicationid,userid,team_name"),
    supabaseAdmin.from("phase_outcome_table").select("*"),
    supabaseAdmin
      .from("user_profiles_table")
      .select("userid,userrole,isactive"),
  ]);

  for (const result of [
    phasesResult,
    applicationsResult,
    outcomesResult,
    profilesResult,
  ]) {
    if (result.error) throw result.error;
  }

  const authUserById = new Map(authUsers.map((user) => [user.id, user]));
  const activeApplicantIds = new Set(
    profilesResult.data
      ?.filter(
        (profile) =>
          profile.userrole === UserRole.Applicant && profile.isactive,
      )
      .map((profile) => profile.userid),
  );

  const applications = (applicationsResult.data ?? [])
    .filter((application) => activeApplicantIds.has(application.userid))
    .map((application) => ({
      applicationId: application.applicationid,
      applicantUserId: application.userid,
      teamName:
        application.team_name?.trim() ||
        `Bewerbung ${application.applicationid.slice(0, 8)}`,
      email: authUserById.get(application.userid)?.email || "",
    }));

  const eligibleApplicantIdsByPhase: Record<string, string[]> = {};
  const assignments: EvaluationAssignment[] = [];
  for (const phase of phasesResult.data ?? []) {
    eligibleApplicantIdsByPhase[phase.phaseid] = (
      await fetchEligibleApplications(supabaseAdmin, phase.phaseid)
    ).map((application) => application.applicantUserId);
    const phaseAssignments = await readMatching(supabaseAdmin, phase.phaseid);
    assignments.push(
      ...phaseAssignments.map((assignment) => ({
        ...assignment,
        phaseId: phase.phaseid,
      })),
    );
  }

  return {
    phases: (phasesResult.data ?? []) as PhaseData[],
    applications,
    eligibleApplicantIdsByPhase,
    assignments,
    outcomes: (outcomesResult.data ?? []).map((outcome) => ({
      outcomeId: outcome.outcome_id,
      phaseId: outcome.phase_id,
      applicantUserId: outcome.user_id,
      outcome: outcome.outcome,
    })),
    emailDefaults: reviewEmailDefaults,
  };
}

export async function previewReviewerMatching(
  phaseId: string,
  csvText: string,
  reviewersPerApplication: number,
): Promise<ReviewerAssignment[]> {
  const { supabaseAdmin } = await requireAdmin();
  const rows = parse(csvText, {
    bom: true,
    columns: (headers: string[]) =>
      headers.map((header) => header.trim().toLowerCase()),
    skip_empty_lines: true,
    trim: true,
  }) as CsvReviewer[];

  if (rows.length === 0) {
    throw new Error("Die Bewerter-CSV ist leer.");
  }

  const reviewers: MatchingReviewer[] = rows.map((row, index) => {
    if (
      !row.name ||
      !row.email ||
      row.new === undefined ||
      row.max === undefined
    ) {
      throw new Error(
        `Zeile ${index + 2}: Erwartet werden die Spalten name,email,new,max.`,
      );
    }
    const email = z.email().parse(normalizeEmail(row.email));

    const normalizedNewValue = row.new.trim().toLowerCase();
    if (!["ja", "nein", "yes", "no"].includes(normalizedNewValue)) {
      throw new Error(
        `Zeile ${index + 2}: "new" muss ja/nein oder yes/no sein.`,
      );
    }

    return {
      name: row.name.trim(),
      email,
      isExperienced: ["nein", "no"].includes(normalizedNewValue),
      maxApplications: Number(row.max),
    };
  });

  const applications = await fetchEligibleApplications(supabaseAdmin, phaseId);
  return assignReviewers(applications, reviewers, reviewersPerApplication);
}

export async function saveReviewerAssignments(
  phaseId: string,
  assignmentsInput: ReviewerAssignment[],
) {
  const { supabaseAdmin } = await requireAdmin();
  await requireOpenPhase(supabaseAdmin, phaseId);
  const assignments = z.array(assignmentSchema).min(1).parse(assignmentsInput);
  const eligibleApplications = await fetchEligibleApplications(
    supabaseAdmin,
    phaseId,
  );
  const eligibleApplicationById = new Map(
    eligibleApplications.map((application) => [
      application.applicationId,
      application,
    ]),
  );

  const seenPairs = new Set<string>();
  for (const assignment of assignments) {
    const application = eligibleApplicationById.get(assignment.applicationId);
    if (
      !application ||
      application.applicantUserId !== assignment.applicantUserId
    ) {
      throw new Error("Das Matching enthält eine ungültige Bewerbung.");
    }
    const pair = `${assignment.applicantUserId}:${normalizeEmail(assignment.reviewerEmail)}`;
    if (seenPairs.has(pair)) {
      throw new Error("Das Matching enthält eine doppelte Zuweisung.");
    }
    seenPairs.add(pair);
  }

  const { error: uploadError } = await supabaseAdmin.storage
    .from(evaluationBucket)
    .upload(
      `${phaseId}/matching.json`,
      new Blob([JSON.stringify(assignments)], { type: "application/json" }),
      { contentType: "application/json", upsert: true },
    );
  if (uploadError) throw uploadError;

  revalidatePath("/admin/evaluation");
  return { savedAssignments: assignments.length };
}

async function buildReviewerEmails(
  phaseId: string,
  settingsInput: ReviewEmailDefaults,
) {
  const { supabaseAdmin } = await requireAdmin();
  const settings = emailSettingsSchema.parse(settingsInput);
  await requireOpenPhase(supabaseAdmin, phaseId);
  const [{ data: phase, error: phaseError }, assignments] = await Promise.all([
    supabaseAdmin
      .from("phase_table")
      .select("phaseid,phaselabel")
      .eq("phaseid", phaseId)
      .single(),
    readMatching(supabaseAdmin, phaseId),
  ]);
  if (phaseError) throw phaseError;
  if (assignments.length === 0) {
    throw new Error("Für diese Phase ist noch kein Matching gespeichert.");
  }

  const assignmentsByReviewer = new Map<string, ReviewerAssignment[]>();
  for (const assignment of assignments) {
    const reviewerAssignments =
      assignmentsByReviewer.get(assignment.reviewerEmail) ?? [];
    reviewerAssignments.push(assignment);
    assignmentsByReviewer.set(assignment.reviewerEmail, reviewerAssignments);
  }

  const reviewUrl = `${getURL()}review/applications`;
  const messages = [...assignmentsByReviewer.entries()].map(
    ([reviewerEmail, reviewerAssignments]) => {
      return {
        reviewerEmail,
        applicationIds: reviewerAssignments.map(
          (assignment) => assignment.applicationId,
        ),
        subject: settings.subject,
        html: createReviewerAssignmentEmail({
          phaseLabel: phase.phaselabel,
          confirmationDeadline: settings.confirmationDeadline,
          confirmationUrl: settings.confirmationUrl,
          ratingDeadline: settings.ratingDeadline,
          instructionsUrl: settings.instructionsUrl,
          ratingUrl: settings.ratingUrl,
          reviewUrl,
          phaseNote: settings.phaseNote,
          applications: reviewerAssignments.map((assignment) => ({
            label: assignment.teamName,
            url: `${getURL()}review/applications/${assignment.applicationId}`,
          })),
        }),
      };
    },
  );

  return { phaseLabel: phase.phaselabel, messages };
}

export async function sendReviewerTestEmail(
  phaseId: string,
  settings: ReviewEmailDefaults,
  recipient: string,
) {
  const { messages } = await buildReviewerEmails(phaseId, settings);
  const testRecipient = z.email().parse(recipient.trim());
  const example = messages[0];
  await sendEmail(
    testRecipient,
    `[TEST] ${example.subject}`,
    `<p><strong>Testmail für ${example.reviewerEmail}</strong></p>${example.html}`,
    reviewEmailSender,
  );
  return { recipient: testRecipient };
}

export async function sendReviewerAssignmentEmails(
  phaseId: string,
  settings: ReviewEmailDefaults,
) {
  const { phaseLabel, messages } = await buildReviewerEmails(phaseId, settings);
  const results: {
    message: (typeof messages)[number];
    status: "angenommen" | "fehlgeschlagen";
  }[] = [];

  for (const message of messages) {
    let status: "angenommen" | "fehlgeschlagen" = "angenommen";
    try {
      await sendEmail(
        message.reviewerEmail,
        message.subject,
        message.html,
        reviewEmailSender,
      );
    } catch {
      status = "fehlgeschlagen";
    }
    results.push({ message, status });
  }

  const overview = createMatchingOverviewEmail(
    phaseLabel,
    results.map(({ message, status }) => ({
      recipient: message.reviewerEmail,
      status,
      applicationCount: message.applicationIds.length,
      html: message.html,
    })),
  );
  try {
    await sendEmail(
      reviewEmailOverviewRecipient,
      `[Matching-Übersicht] ${phaseLabel}`,
      overview,
      reviewEmailSender,
    );
  } catch {
    throw new Error(
      `Die Bewerter-Mails wurden bereits verarbeitet, aber die Übersicht an ${reviewEmailOverviewRecipient} ist fehlgeschlagen. Bitte nicht den Rundversand erneut starten.`,
    );
  }

  const failed = results.filter(({ status }) => status === "fehlgeschlagen");
  if (failed.length > 0) {
    throw new Error(
      `Versand an ${failed.length} Empfänger fehlgeschlagen: ${failed.map(({ message }) => message.reviewerEmail).join(", ")}. Details stehen in der Matching-Übersicht bei ${reviewEmailOverviewRecipient}.`,
    );
  }
  return {
    sentEmails: messages.length,
    overviewRecipient: reviewEmailOverviewRecipient,
  };
}

export async function savePhaseDecision(
  phaseId: string,
  applicantUserId: string,
  outcome: boolean,
) {
  const { user, supabaseAdmin } = await requireAdmin();
  z.string().uuid().parse(phaseId);
  z.string().uuid().parse(applicantUserId);
  await requireOpenPhase(supabaseAdmin, phaseId);

  const eligibleApplications = await fetchEligibleApplications(
    supabaseAdmin,
    phaseId,
  );
  if (
    !eligibleApplications.some(
      (application) => application.applicantUserId === applicantUserId,
    )
  ) {
    throw new Error(
      "Dieses Startup ist für die ausgewählte Phase nicht teilnahmeberechtigt.",
    );
  }

  const { data: existingOutcomes, error: selectError } = await supabaseAdmin
    .from("phase_outcome_table")
    .select("outcome_id")
    .eq("phase_id", phaseId)
    .eq("user_id", applicantUserId);
  if (selectError) throw selectError;

  if (existingOutcomes && existingOutcomes.length > 0) {
    const { error } = await supabaseAdmin
      .from("phase_outcome_table")
      .update({
        outcome,
        reviewed_by: user.id,
        review_date: new Date().toISOString(),
      })
      .eq("phase_id", phaseId)
      .eq("user_id", applicantUserId);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from("phase_outcome_table").insert({
      phase_id: phaseId,
      user_id: applicantUserId,
      outcome,
      reviewed_by: user.id,
      review_date: new Date().toISOString(),
    });
    if (error) throw error;
  }

  revalidatePath("/admin/evaluation");
  return { outcome };
}

export async function saveBulkPhaseDecisions(
  phaseId: string,
  approvedEmailsText: string,
) {
  const { user, supabaseAdmin } = await requireAdmin();
  z.string().uuid().parse(phaseId);
  await requireOpenPhase(supabaseAdmin, phaseId);
  const approvedEmails = new Set(
    approvedEmailsText
      .split(/[\s,;]+/)
      .map(normalizeEmail)
      .filter(Boolean),
  );
  const eligibleApplications = await fetchEligibleApplications(
    supabaseAdmin,
    phaseId,
  );
  const eligibleApplicationByEmail = new Map(
    eligibleApplications.map((application) => [
      normalizeEmail(application.email),
      application,
    ]),
  );
  const unknownEmails = [...approvedEmails].filter(
    (email) => !eligibleApplicationByEmail.has(email),
  );
  if (unknownEmails.length > 0) {
    throw new Error(
      `Diese E-Mail-Adressen sind in der Phase nicht teilnahmeberechtigt: ${unknownEmails.join(", ")}`,
    );
  }

  const { data: existingOutcomes, error: existingOutcomeError } =
    await supabaseAdmin
      .from("phase_outcome_table")
      .select("user_id")
      .eq("phase_id", phaseId);
  if (existingOutcomeError) throw existingOutcomeError;
  const existingApplicantIds = new Set(
    existingOutcomes?.map((outcome) => outcome.user_id),
  );
  const now = new Date().toISOString();
  const passedApplicantIds = eligibleApplications
    .filter((application) =>
      approvedEmails.has(normalizeEmail(application.email)),
    )
    .map((application) => application.applicantUserId);
  const failedApplicantIds = eligibleApplications
    .filter(
      (application) => !approvedEmails.has(normalizeEmail(application.email)),
    )
    .map((application) => application.applicantUserId);

  for (const [applicantIds, outcome] of [
    [passedApplicantIds, true],
    [failedApplicantIds, false],
  ] as const) {
    const idsToUpdate = applicantIds.filter((id) =>
      existingApplicantIds.has(id),
    );
    if (idsToUpdate.length > 0) {
      const { error } = await supabaseAdmin
        .from("phase_outcome_table")
        .update({ outcome, reviewed_by: user.id, review_date: now })
        .eq("phase_id", phaseId)
        .in("user_id", idsToUpdate);
      if (error) throw error;
    }
  }

  const newOutcomes = eligibleApplications
    .filter(
      (application) => !existingApplicantIds.has(application.applicantUserId),
    )
    .map((application) => ({
      phase_id: phaseId,
      user_id: application.applicantUserId,
      outcome: approvedEmails.has(normalizeEmail(application.email)),
      reviewed_by: user.id,
      review_date: now,
    }));
  if (newOutcomes.length > 0) {
    const { error } = await supabaseAdmin
      .from("phase_outcome_table")
      .insert(newOutcomes);
    if (error) throw error;
  }

  revalidatePath("/admin/evaluation");
  return {
    passed: passedApplicantIds.length,
    failed: failedApplicantIds.length,
  };
}

export async function finishPhaseEvaluation(phaseId: string) {
  const { supabaseAdmin } = await requireAdmin();
  await requireOpenPhase(supabaseAdmin, phaseId);
  const eligibleApplications = await fetchEligibleApplications(
    supabaseAdmin,
    phaseId,
  );
  const { data: outcomes, error: outcomeError } = await supabaseAdmin
    .from("phase_outcome_table")
    .select("user_id,outcome")
    .eq("phase_id", phaseId);
  if (outcomeError) throw outcomeError;

  const outcomesByApplicant = new Map<string, Set<boolean>>();
  for (const outcome of outcomes ?? []) {
    const values =
      outcomesByApplicant.get(outcome.user_id) ?? new Set<boolean>();
    values.add(outcome.outcome);
    outcomesByApplicant.set(outcome.user_id, values);
  }

  const missingApplications = eligibleApplications.filter(
    (application) => !outcomesByApplicant.has(application.applicantUserId),
  );
  if (missingApplications.length > 0) {
    throw new Error(
      `Für ${missingApplications.length} Startups fehlt noch eine Entscheidung.`,
    );
  }
  const conflictingOutcomes = [...outcomesByApplicant.values()].filter(
    (values) => values.size > 1,
  );
  if (conflictingOutcomes.length > 0) {
    throw new Error(
      "Es existieren widersprüchliche doppelte Entscheidungen. Bitte speichere die betroffenen Entscheidungen erneut.",
    );
  }

  const finishedAt = new Date().toISOString();
  const { error: finishError } = await supabaseAdmin
    .from("phase_table")
    .update({ finished_evaluation: finishedAt })
    .eq("phaseid", phaseId)
    .is("finished_evaluation", null);
  if (finishError) throw finishError;

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/evaluation");
  return { finishedAt };
}
