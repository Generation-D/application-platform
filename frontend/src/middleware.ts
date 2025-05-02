import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isAuthorized } from "./actions/middleware";
import { UserRole } from "./utils/userRole";

// Can't use own Logger in middleware, because of https://nextjs.org/docs/messages/node-module-in-edge-runtime

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();
  console.log(getUserError);
  await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  if (!user) {
    if (pathname != "/login") {
      console.log("Not logged in! Redirect to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }

  let redirectUrl = null;

  if (pathname.startsWith("/review")) {
    redirectUrl = await isAuthorized(supabase, UserRole.Reviewer);
  } else if (pathname.startsWith("/admin")) {
    redirectUrl = await isAuthorized(supabase, UserRole.Admin);
  }

  if (redirectUrl) {
    console.log(
      `The User ${user.email} is not authorized to access ${pathname}. Redirect to ${redirectUrl}`,
    );
    return NextResponse.redirect(new URL(redirectUrl, request.url));
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
      return NextResponse.redirect(new URL("/403", request.url));
    }

    // if user is signed in and the current path is /login redirect the user to /
    if (request.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return response;
}

export const config = {
  matcher: ["/", "/login", "/review", "/admin", "/settings"],
};
