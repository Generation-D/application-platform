import { SupabaseClient } from "@supabase/supabase-js";

import { UserRole } from "@/utils/userRole";
import Logger from "@/logger/logger";
import { initSupabaseActions } from "@/utils/supabaseServerClients";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

const log = new Logger("actions/redirect");

export async function checkAccessRights(currentPath: string) {
  const supabase = initSupabaseActions();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!currentPath.startsWith("/")) {
    currentPath = `/${currentPath}`;
  }
  const splitted_path = currentPath.split("/");
  // User is not Logged In
  if (!user) {
    if (
      currentPath != "/login" &&
      splitted_path[1] != "admin" &&
      splitted_path[1] != "review"
    ) {
      log.debug("Not logged in! Redirect to /login");
      return redirect("/login");
    }
    if (
      currentPath != "/admin/login" &&
      (splitted_path[1] == "admin" || splitted_path[1] == "review")
    ) {
      log.debug("Not logged in! Redirect to /login");
      return redirect("/admin/login");
    }
    return;
  }

  // User is Logged In
  let redirectUrl = null;
  if (splitted_path[1] == "review") {
    redirectUrl = await isAuthorized(supabase, UserRole.Reviewer);
  } else if (splitted_path[1] == "admin" && currentPath !== "/admin/login") {
    redirectUrl = await isAuthorized(supabase, UserRole.Admin);
  } else if (currentPath === "/admin/login") {
    redirectUrl = "/admin";
  }

  if (redirectUrl) {
    console.log(
      `The User ${user.email} is not authorized to access ${currentPath}. Redirect to ${redirectUrl}`,
    );
    return redirect(redirectUrl);
  }

  if (user) {
    const { data: roleData, error: roleError } = await supabase
      .from("user_profiles_table")
      .select("isactive")
      .eq("userid", user!.id)
      .single();
    if (roleError) {
      console.error(roleError);
    }
    if (roleData && !roleData.isactive) {
      console.log(`The User ${user.email} is not active. Redirect to /403`);
      return redirect("/403");
    }

    // if user is signed in and the current path is /login redirect the user to /
    if (currentPath === "/login") {
      return redirect("/");
    }
  }
}

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
