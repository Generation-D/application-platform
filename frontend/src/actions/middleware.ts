import { SupabaseClient } from "@supabase/supabase-js";

import { UserRole } from "@/utils/userRole";

// Can't use own Logger in middleware, because of https://nextjs.org/docs/messages/node-module-in-edge-runtime

export async function getUserRole(supabaseClient: SupabaseClient) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  const { data: userProfileData, error: userProfileError } =
    await supabaseClient
      .from("user_profiles_table")
      .select("userrole")
      .eq("userid", user!.id)
      .single();
  if (userProfileError) {
    console.log(JSON.stringify(userProfileError));
    throw userProfileError;
  }
  return userProfileData.userrole;
}

export async function isAuthorized(
  supabaseClient: SupabaseClient,
  minRequiredRole: UserRole,
) {
  return (await getUserRole(supabaseClient)) >= minRequiredRole.valueOf();
}

export async function authorizationBasedUserRedirect(
  supabaseClient: SupabaseClient,
  minRequiredRole: UserRole,
) {
  const authorized = await isAuthorized(supabaseClient, minRequiredRole);
  // Redirect based on the user's role
  return authorized && UserRole.Reviewer
    ? "/review"
    : authorized && UserRole.Admin
      ? "/admin"
      : "/application";
}
