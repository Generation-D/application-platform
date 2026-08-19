import { Database } from "@/types/database.types";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

export const getSupabase = () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient<Database>(supabaseUrl, supabaseKey);
};
