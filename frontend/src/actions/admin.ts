"use server";
import { ApplicantsStateType } from "@/components/applicantslist";
import Logger from "@/logger/logger";
import {
  getSupabaseCookiesUtilClient,
  getSupabaseCookiesUtilClientAdmin,
} from "@/supabase-utils/cookiesUtilClient";
import { createCurrentTimestamp } from "@/utils/helpers";
import { UserRole } from "@/utils/userRole";

const log = new Logger("actions/admin");

export interface userData {
  id: string;
  email: string;
  last_sign_in_at: string;
  provider: string;
  created_at: string;
  updated_at: string;
  userrole: UserRole;
  isactive: boolean;
}

function mergeUserDatas(users: any[], userProfiles: any[]): userData[] {
  return users.map((user) => {
    const correspondingItem = userProfiles.find(
      (profile) => profile.userid === user.id,
    );

    return {
      id: user.id,
      email: user.email,
      last_sign_in_at: user.last_sign_in_at,
      provider: user.app_metadata?.provider,
      created_at: user.created_at,
      updated_at: user.updated_at,
      userrole: correspondingItem?.userrole || 0,
      isactive: correspondingItem?.isactive || false,
    };
  });
}

export async function fetchAllUsers() {
  const supabaseAdmin = await getSupabaseCookiesUtilClientAdmin();
  const {
    data: { users },
    error: adminError,
  } = await supabaseAdmin.auth.admin.listUsers();
  if (adminError) {
    log.error(JSON.stringify(adminError));
    throw adminError;
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

export async function toggleStatusOfUser(currUser: userData) {
  const supabaseAdmin = await getSupabaseCookiesUtilClientAdmin();
  try {
    const { error: userProfileError } = await supabaseAdmin
      .from("user_profiles_table")
      .update({ isactive: !currUser.isactive })
      .eq("userid", currUser.id);

    if (userProfileError) {
      log.error(JSON.stringify(userProfileError));
      throw userProfileError;
    }
    log.info(
      `Changed Status of User (${currUser.email} to '${
        currUser.isactive ? "inactive" : "active"
      }')`,
    );
    return { ...currUser, isactive: !currUser.isactive };
  } catch (error) {
    log.error(`Error toggling user status: ${error}`);
    return null;
  }
}

export async function changeRoleOfUser(currUser: userData, role: UserRole) {
  const supabaseAdmin = await getSupabaseCookiesUtilClientAdmin();
  try {
    const { error: userProfileError } = await supabaseAdmin
      .from("user_profiles_table")
      .update({ userrole: role.valueOf() })
      .eq("userid", currUser.id);

    if (userProfileError) {
      log.error(JSON.stringify(userProfileError));
      throw userProfileError;
    }
    log.info(`Changed Userrole of User (${currUser.email} to '${role}')`);
    return { ...currUser, userrole: role.valueOf() };
  } catch (error) {
    log.error(`Error changing user status: ${error}`);
    return null;
  }
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
