import { Database } from "@/types/database.types";
import { getPublicEnv } from "@/utils/env";
import { createBrowserClient } from "@supabase/ssr";

export const getSupabaseBrowserClient = () =>
  createBrowserClient<Database>(
    // getPublicEnv("NEXT_PUBLIC_SUPABASE_URL") ?? "http://127.0.0.1:54321",
    // getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
