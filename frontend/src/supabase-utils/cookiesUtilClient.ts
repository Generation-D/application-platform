import { Database } from "@/types/database.types";
import { getPublicEnv } from "@/utils/env";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getSupabaseCookiesUtilClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getPublicEnv("NEXT_PUBLIC_SUPABASE_URL") ?? "https://localhost",
    getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? "fake-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    },
  );
};

export const getSupabaseCookiesUtilClientAdmin = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getPublicEnv("NEXT_PUBLIC_SUPABASE_URL") ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    },
  );
};
