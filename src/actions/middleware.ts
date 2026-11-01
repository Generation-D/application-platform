import { SupabaseClient } from "@supabase/supabase-js";

import { UserRole } from "@/utils/userRole";

// Can't use own Logger in middleware, because of https://nextjs.org/docs/messages/node-module-in-edge-runtime

export async function isAuthorized(
  supabase: SupabaseClient,
  requiredRole: UserRole,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userProfileData, error: userProfileError } = await supabase
    .from("user_profiles_table")
    .select("userrole")
    .eq("userid", user!.id)
    .single();
  if (userProfileError) {
    console.log(JSON.stringify(userProfileError));
    throw userProfileError;
  }
  if (userProfileData.userrole >= requiredRole.valueOf()) {
    return null; // User has the required role
  }

  // Redirect based on the user's role
  return userProfileData.userrole === UserRole.Reviewer
    ? "/review"
    : userProfileData.userrole === UserRole.Admin
      ? "/admin"
      : "/";
}
