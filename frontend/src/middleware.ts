import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getUserRole } from "./actions/middleware";
import { UserRole } from "./utils/userRole";

// Can't use own Logger in middleware, because of https://nextjs.org/docs/messages/node-module-in-edge-runtime

const redirectRoutes: Record<UserRole | number, string> = {
  [UserRole.Admin]: "/admin",
  [UserRole.Reviewer]: "/review",
  [UserRole.Applicant]: "/application",
  [UserRole.Unknown]: "/",
};

const requiredRoles: Record<string, UserRole> = {
  "/admin": UserRole.Admin,
  "/review": UserRole.Reviewer,
};

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
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Redirect user in case of not being logged in:
  if (!user) {
    if (pathname != "/") {
      console.log("Not logged in! Redirect to /");
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  // Redirect user in case of not having the access right (role):
  const userRole = await getUserRole(supabase);
  for (const [prefix, requiredRole] of Object.entries(requiredRoles)) {
    if (pathname.startsWith(prefix) && userRole < requiredRole) {
      const redirectUrl = redirectRoutes[userRole];
      console.log(
        `User ${user.email} is not authorized to access ${pathname}. Redirecting to ${redirectUrl}`
      );
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Redirect user in case of being inactive:
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

    // if user is signed in and the current path is / (login) redirect the user to respective path
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(
        new URL(redirectRoutes[userRole], request.url)
      );
    }
  }
  return response;
}

export const config = {
  matcher: ["/", "/review", "/admin", "/settings", "/application"],
};
