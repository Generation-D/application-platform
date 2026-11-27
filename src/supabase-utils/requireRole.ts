// Server-only helper. Deliberately not a "use server" module, so it is never
// exposed as a callable server action.
import {
  getSupabaseCookiesUtilClient,
  getSupabaseServiceRoleClient,
} from "@/supabase-utils/cookiesUtilClient";
import { UserRole } from "@/utils/userRole";

const ROLE_ERRORS: Partial<Record<UserRole, string>> = {
  [UserRole.Admin]: "Diese Aktion ist nur für Administratoren erlaubt.",
};

/**
 * Ensures the caller is signed in, active and has exactly `role`. Returns the
 * user and a service-role client that may only be used after this check.
 */
export async function requireRole(role: UserRole) {
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
  if (profileError || !profile?.isactive || profile.userrole !== role) {
    throw new Error(ROLE_ERRORS[role] ?? "Keine Berechtigung.");
  }

  return { user, supabaseAdmin: getSupabaseServiceRoleClient() };
}
