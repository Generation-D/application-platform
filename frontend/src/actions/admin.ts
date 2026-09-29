"use server";
import { ApplicantsStateType } from "@/components/applicantslist";
import { createLogger } from "@/logger/logger";
import {
  getSupabaseCookiesUtilClient,
  getSupabaseCookiesUtilClientAdmin,
  getSupabaseServiceRoleClient,
} from "@/supabase-utils/cookiesUtilClient";
import { createCurrentTimestamp } from "@/utils/helpers";
import { UserRole } from "@/utils/userRole";
import { User } from "@supabase/supabase-js";

const log = createLogger("actions/admin");

export interface userData {
  id: string;
  name: string;
  email: string | undefined;
  last_sign_in_at: string | undefined;
  provider: string | undefined;
  created_at: string;
  updated_at: string | undefined;
  userrole: UserRole;
  isactive: boolean;
}

interface ProfileData {
  isactive: boolean | null;
  userid: string;
  userrole: number;
}

function mergeUserDatas(
  users: User[],
  userProfiles: ProfileData[],
): userData[] {
  return users.map((user) => {
    const correspondingItem = userProfiles.find(
      (profile) => profile.userid === user.id,
    );

    return {
      id: user.id,
      name:
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : "",
      email: user.email!,
      last_sign_in_at: user.last_sign_in_at,
      provider: user.app_metadata?.provider,
      created_at: user.created_at,
      updated_at: user.updated_at,
      userrole: correspondingItem?.userrole ?? UserRole.Unknown,
      isactive: correspondingItem?.isactive ?? false,
    };
  });
}

async function requireAdminForUserManagement() {
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
  if (
    profileError ||
    !profile?.isactive ||
    profile.userrole !== UserRole.Admin
  ) {
    throw new Error("Diese Aktion ist nur für Administratoren erlaubt.");
  }
  return {
    supabaseAdmin: getSupabaseServiceRoleClient(),
    adminUserId: user.id,
  };
}

export async function fetchAllUsers() {
  const { supabaseAdmin } = await requireAdminForUserManagement();
  const users: User[] = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) {
      log.error(JSON.stringify(error));
      throw error;
    }
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  const { data: profileData, error: profileError } = await supabaseAdmin
    .from("user_profiles_table")
    .select("*");
  if (profileError) {
    log.error(JSON.stringify(profileError));
    throw profileError;
  }
  return mergeUserDatas(users, profileData!);
}

export async function toggleStatusOfUser(userId: string) {
  const { supabaseAdmin, adminUserId } = await requireAdminForUserManagement();
  if (userId === adminUserId) {
    throw new Error(
      "Du kannst deinen eigenen Admin-Zugang nicht deaktivieren.",
    );
  }
  const { data: profile, error: readError } = await supabaseAdmin
    .from("user_profiles_table")
    .select("isactive")
    .eq("userid", userId)
    .single();
  if (readError || !profile) throw readError ?? new Error("Profil fehlt.");

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("user_profiles_table")
    .update({ isactive: !profile.isactive })
    .eq("userid", userId)
    .select("isactive")
    .single();
  if (updateError || !updated) {
    throw (
      updateError ?? new Error("Aktiv-Status konnte nicht geändert werden.")
    );
  }
  return updated.isactive ?? false;
}

export async function changeRoleOfUser(userId: string, role: UserRole) {
  if (![UserRole.Applicant, UserRole.Reviewer, UserRole.Admin].includes(role)) {
    throw new Error("Ungültige Rolle.");
  }
  const { supabaseAdmin, adminUserId } = await requireAdminForUserManagement();
  if (userId === adminUserId && role !== UserRole.Admin) {
    throw new Error("Du kannst deine eigene Admin-Rolle nicht entfernen.");
  }
  const { data: updated, error } = await supabaseAdmin
    .from("user_profiles_table")
    .update({ userrole: role })
    .eq("userid", userId)
    .select("userrole")
    .single();
  if (error || !updated)
    throw error ?? new Error("Rolle konnte nicht geändert werden.");
  return updated.userrole;
}

export interface ApplicantsStatus {
  outcome_id: string;
  phase_id: string;
  user_id: string;
  outcome: boolean;
  reviewed_by: string;
  review_date: string;
}

export async function fetchAllApplicantsStatus(): Promise<ApplicantsStatus[]> {
  const supabase = await getSupabaseCookiesUtilClient();
  const { data: applicantsStatusData, error: applicantsStatusError } =
    await supabase.from("phase_outcome_table").select("*");
  if (applicantsStatusError) {
    log.error(JSON.stringify(applicantsStatusError));
    throw applicantsStatusError;
  }
  return applicantsStatusData;
}

export async function saveApplicationOutcome(
  phase_id: string,
  user_id: string,
  applicantStatus: ApplicantsStatus | undefined,
  admin_id: string,
  outcome?: boolean,
) {
  const supabase = await getSupabaseCookiesUtilClient();
  if (applicantStatus === undefined) {
    const { error: applicantStatusError } = await supabase
      .from("phase_outcome_table")
      .insert({
        phase_id: phase_id,
        user_id: user_id,
        outcome: outcome == undefined ? true : outcome,
        reviewed_by: admin_id,
        review_date: createCurrentTimestamp(),
      });
    if (applicantStatusError) {
      log.error(JSON.stringify(applicantStatusError));
      throw applicantStatusError;
    }
  } else {
    const { error: applicantStatusError } = await supabase
      .from("phase_outcome_table")
      .update({
        outcome: !applicantStatus.outcome,
        reviewed_by: admin_id,
        review_date: createCurrentTimestamp(),
      })
      .eq("outcome_id", applicantStatus.outcome_id);
    if (applicantStatusError) {
      log.error(JSON.stringify(applicantStatusError));
      throw applicantStatusError;
    }
  }
}

export async function finishEvaluationOfPhase(
  phase_id: string,
  users: userData[],
  applicantsState: ApplicantsStateType,
  previousPhaseId: string | null,
  isFirstPhase: boolean,
  admin_id: string,
) {
  const allPhaseOutcomes = await fetchAllApplicantsStatus();

  users.forEach(async (user) => {
    if (user.userrole > 1) {
      return null;
    }

    if (
      allPhaseOutcomes.find(
        (phaseOutcome) =>
          phaseOutcome.user_id == user.id && phaseOutcome.phase_id == phase_id,
      ) != undefined
    ) {
      return null;
    }

    const previousPhaseApplicantState =
      previousPhaseId && applicantsState[previousPhaseId]
        ? applicantsState[previousPhaseId][user.id]
        : { status: undefined, reviewer: undefined };

    const userIsInPhase =
      isFirstPhase || previousPhaseApplicantState.status?.outcome;

    if (userIsInPhase) {
      log.info(
        `Set Application Outcome of ${user.email} in Phase ${phase_id} to failed.`,
      );
      await saveApplicationOutcome(
        phase_id,
        user.id,
        undefined,
        admin_id,
        false,
      );
    }
  });
  const supabaseAdmin = await getSupabaseCookiesUtilClientAdmin();
  const { error: applicantStatusError } = await supabaseAdmin
    .from("phase_table")
    .update({ finished_evaluation: createCurrentTimestamp() })
    .eq("phaseid", phase_id);
  if (applicantStatusError) {
    log.error(JSON.stringify(applicantStatusError));
    throw applicantStatusError;
  }
  log.info(`Finished Evaluation of Phase ${phase_id}`);
}
