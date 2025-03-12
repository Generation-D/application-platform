import { NextResponse } from "next/server";

import Logger from "@/logger/logger";
import { getURL } from "@/utils/helpers";
import { getSupabaseCookiesUtilClient } from "@/supabase-utils/cookiesUtilClient";

const log = new Logger("auth/admin/callback/route");

export async function GET() {
  const options: { redirectTo: string; scopes?: string } = {
    redirectTo: `${getURL()}/auth/admin/callback`,
  };

  const supabase = await getSupabaseCookiesUtilClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "slack",
    options,
  });

  if (error) {
    log.error(JSON.stringify(error));
    throw error;
  }

  return NextResponse.redirect(data.url);
}
