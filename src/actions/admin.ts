"use server";
import { createLogger } from "@/logger/logger";
import { requireRole } from "@/supabase-utils/requireRole";
import { UserRole } from "@/utils/userRole";
import { User } from "@supabase/supabase-js";

const log = createLogger("actions/admin");

export interface userData {
  id: string;
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
  const { user, supabaseAdmin } = await requireRole(UserRole.Admin);
  return { supabaseAdmin, adminUserId: user.id };
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
