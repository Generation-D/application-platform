import { Database } from "@/types/database.types";
import { getPublicEnv } from "@/utils/env";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const getSupabaseReqResClient = ({
  request,
}: {
  request: NextRequest;
}) => {
  const response = {
    value: NextResponse.next({ request: request }),
  };

  const supabase = createServerClient<Database>(
    getPublicEnv("NEXT_PUBLIC_SUPABASE_URL") ?? "https://localhost",
    getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? "fake-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response.value = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.value.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  return { supabase, response };
};
