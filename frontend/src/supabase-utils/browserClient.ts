import { Database } from "@/types/database.types";
import { getPublicEnv } from "@/utils/env";
import { createBrowserClient } from "@supabase/ssr";

export const getSupabaseBrowserClient = () =>
  createBrowserClient<Database>(
    getPublicEnv("NEXT_PUBLIC_SUPABASE_URL") ?? "https://localhost",
    getPublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?? "fake-key",
  );
