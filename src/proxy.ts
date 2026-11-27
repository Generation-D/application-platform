import { getSupabaseReqResClient } from "@/supabase-utils/reqResClient";
import { NextRequest, NextResponse } from "next/server";

import { UserRole } from "./utils/userRole";

// Can't use own Logger in middleware, because of https://nextjs.org/docs/messages/node-module-in-edge-runtime

const PUBLIC_PATHS = new Set(["/login", "/review/login", "/403"]);

/** Where a user should go when they lack the role a path requires. */
function homeForRole(role: number) {
  if (role === UserRole.Admin) return "/admin";
  if (role === UserRole.Reviewer) return "/review";
  return "/";
}

function requiredRoleFor(pathname: string) {
  if (pathname.startsWith("/admin")) return UserRole.Admin;
  if (pathname.startsWith("/review")) return UserRole.Reviewer;
  return null;
}

export async function proxy(request: NextRequest) {
  const { supabase, response } = getSupabaseReqResClient({ request: request });
  const pathname = request.nextUrl.pathname;
  const redirectTo = (path: string) =>
    path === pathname
      ? response.value
      : NextResponse.redirect(new URL(path, request.url));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (PUBLIC_PATHS.has(pathname) || pathname.startsWith("/auth/callback")) {
      return response.value;
    }
    console.log("Not logged in! Redirect to login");
    return redirectTo(
      pathname.startsWith("/review") ? "/review/login" : "/login",
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles_table")
    .select("userrole,isactive")
    .eq("userid", user.id)
    .maybeSingle();

  // Missing or inactive profiles may only see /403. Redirecting /403 to itself
  // would loop, so it is served as is.
  if (profileError || !profile) {
    console.error(
      `No profile for user ${user.id}: ${JSON.stringify(profileError)}`,
    );
    return redirectTo("/403");
  }
  if (!profile.isactive) {
    console.log(`The User ${user.id} is not active. Redirect to /403`);
    return redirectTo("/403");
  }

  if (pathname === "/" || pathname === "/login") {
    return redirectTo(homeForRole(profile.userrole));
  }

  const requiredRole = requiredRoleFor(pathname);
  if (requiredRole !== null && profile.userrole < requiredRole) {
    const target = homeForRole(profile.userrole);
    console.log(
      `The User ${user.id} is not authorized to access ${pathname}. Redirect to ${target}`,
    );
    return redirectTo(target);
  }

  return response.value;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/review/:path*",
    "/admin/:path*",
    "/settings",
    "/((?!api|_next/static|_next/image|.*\\.(?:png|ico|svg|pdf)$).*)",
  ],
};
